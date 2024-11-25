
import { Component, effect, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { DataService } from '../../../services/cards-data.service';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { decodedToken } from '../../../models/decodedToken';
import { FormComponent } from '../form/form.component';
import { locale, LocaleOption } from '../../../models/locale';
import { event } from '../../../models/event';
import { Company } from '../../../models/company';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';




@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, FormComponent, ReactiveFormsModule,AutocompleteComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})


export class CardComponent implements OnInit {

  
  @Input() dataType: 'Company' | 'User' | 'locale' | 'event'= 'locale';
  places = this.dataService.places
  events = this.dataService.events;
  companies = this.dataService.companies
  cookie =inject(CookieService)
  role = ''
  userId = ''
 isEditingMode: boolean = false
 editedItemId = signal<string | null>(null);
placeToEdit= signal<locale>
eventToEdit = signal<event>
eventForm! : FormGroup
placeForm! : FormGroup
eventControl!:FormControl
placeControl!: FormControl

http = inject(HttpClient)

  constructor(private dataService: DataService) { 
   }
  ngOnInit(): void {
 
  if( this.dataType === 'locale'){
    console.log('fetchSuggestions passed to Autocomplete:', this.fetchAddressSuggestions);
    this.placeForm = new FormGroup({
      name: new FormControl(''),
      address: new FormControl(''),
      city:new FormControl(''),
      zipCode: new FormControl(''),
      capacity: new FormControl(0),
     
    })
   
    this.placeControl = this.placeForm.get('address') as FormControl 
  }else if (this.dataType === 'event'){
    console.log('fetchSuggestions passed to Autocomplete:', this.fetchLocale);
      this.eventForm = new FormGroup({
      name: new FormControl(''),
      locale: new FormControl(''),
      date:new FormControl(''),
      time: new FormControl(''),
      price: new FormControl(0),
     
    })
    this.eventControl = this.eventForm.get('locale') as FormControl 
    
    
   }

    const token = this.cookie.get('token')
    const decodedToken:decodedToken = jwtDecode(token)
        console.log(decodedToken.role)
        this.role= decodedToken.role
        this.userId = decodedToken.userId
        if(this.role = 'Admin'){
          this.loadData()
        }else{
          this.loadDataById(this.userId)
        }
  
  
  }
  
loadData(){
  if (this.dataType === 'locale'){
  
    this.dataService.fetchPlaces();
    
  }else if(this.dataType === 'Company'){
    
    this.dataService.fetchCompanies();
  }else if(this.dataType === 'event'){

    this.dataService.fetchEvents();
  }
}
loadDataById(id:string){
  if (this.dataType === 'locale'){
  
    this.dataService.fetchPlacesById(id);
    
  }else if(this.dataType === 'Company'){
    
    this.dataService.fetchCompaniesById(id);
  }else if(this.dataType === 'event'){

    this.dataService.fetchEventsById(id);
  }
}

deleteElement(id:string){
  let endpoint = '';
    if (this.dataType === 'locale') {
      endpoint = 'http://localhost:3000/api/locali';
    } else if (this.dataType === 'Company') {
      endpoint = 'http://localhost:3000/api/companies';
    } else if (this.dataType === 'event') {
      endpoint = 'http://localhost:3000/api/events';
    }
console.log(endpoint)
    this.dataService.deleteElement(endpoint, id).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error('Error deleting element:', err)
    });
  }
  trackByEvent(index: number, item: event):string {
  
    return item._id; 
  }
  trackByPlace(index: number, item: locale):string {
    console.log(item._id, index)
    return item._id; 
  }
  trackByCompany(index: number, item: Company):string {
    console.log(item._id, index)
    return item._id; 
  }

  editElement(id:string){
    this.isEditingMode = true
    let endpoint = '';
    if (this.dataType === 'locale') {
      endpoint = 'http://localhost:3000/api/locali';
     this.dataService.getPlaceById(endpoint, id).subscribe(place => {
      console.log(place.name);
      
       this.placeForm.setValue({
        name: place.name,
        address: place.address,
        city: place.city,
        zipCode: place.zipCode,
        capacity: place.capacity
      });
      this.editedItemId.set(id);
      
    })
  
       } else if (this.dataType === 'Company') {
      endpoint = 'http://localhost:3000/api/companies';
      this.dataService.getCompanyById(endpoint, id);
         this.editedItemId.set(id);
    } else if (this.dataType === 'event') {
      this.editedItemId.set(id);
      console.log(id)
      endpoint = 'http://localhost:3000/api/events';
       this.dataService.getEventById(endpoint,id).subscribe(event => {
        console.log(event.name);
        
         this.eventForm.setValue({
          name: event.name,
          date: event.date,
          time: event.time,
          locale: event.locale,
          price: event.price
        });

    })
 
  }}
  
  fetchLocale = (value: string) => {
    console.log('Inside fetchSuggestions:', value);
    return this.http.get<LocaleOption[]>('http://localhost:3000/api/locali').pipe(
      map((locali: any[]) =>
        locali.map((locale: LocaleOption) => ({
          name: locale.name,
          address: locale.address,
        }))
      )
    );
  };
  fetchAddressSuggestions = (value:string) => {
    
    console.log('Inside fetchSuggestions:', value);
    const params = { q: value, format: 'json', addressdetails: '1', limit: '5' };
    return this.http.get<any[]>('https://nominatim.openstreetmap.org/search', { params }).pipe(
      map((results) =>
        results.map((result) => ({
          display_name: result.display_name,
          city: result.address.city || result.address.town || result.address.village || '',
          postcode: result.address.postcode || ''
        }))
      )
    );
  }
  selectOption(option: any) {
    this.placeForm.patchValue({
      address: option.display_name,
      city: option.city,
      zipCode: option.postcode
    });
  }
  
  selectLocale(locale: any) {
    console.log('Selected locale:', locale);
    this.eventForm.patchValue({ locale: locale.name });
  }

  save(place:locale){
    console.log(place)
  }

  saveEvent(event:event){
    console.log(event)
  }
  
  cancel(){
    this.isEditingMode = false
    this.editedItemId.set(null) 
  }

  
   
    }
    





    
  

