
import { ChangeDetectorRef, Component, effect, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { DataService } from '../../../services/cards-data.service';
import { CommonModule, I18nPluralPipe } from '@angular/common';
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
import { EditService } from '../../../services/edit.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { baseUrl } from '../../../url';
import { User } from '../../../models/user';
import { SearchService } from '../../../services/search.service';




@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, FormComponent,RouterLink, ReactiveFormsModule,AutocompleteComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})


export class CardComponent implements OnInit {

  @Input() dataType:'List' | 'Company' | 'User' | 'locale' | 'event'= 'locale';
   item:any
   places = this.dataService.places
   events = this.dataService.events;
   companies = this.dataService.companies
  users = this.dataService.users
cdr= inject(ChangeDetectorRef)
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
isLoading:boolean = true
http = inject(HttpClient)
editService = inject(EditService)
route = inject(ActivatedRoute)
searchService = inject(SearchService)
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
      
       this.role= decodedToken.role
       this.userId = decodedToken.userId
        this.route.params.subscribe(params => {
      const id = params['id'];
      console.log(this.role)
      if(id){
        this.getItemDetails(id);
        console.log(id)
        this.isLoading = false
      }  else if (!id) {
        if (this.role === 'admin') {
          console.log('Admin Role: Loading all data...');
          this.loadData();
          this.isLoading = false
        } else {
          console.log('Non-Admin Role: Loading user-specific data...');
          this.loadDataById(this.userId);
          this.isLoading = false
        }
      } else {
        console.error('Unhandled case!');
      }
      
    })
   
  
      
  }
  
loadData(){
  if (this.dataType === 'locale'){
  
    this.dataService.fetchPlaces();
    
  }else if(this.dataType === 'Company'){
    
    this.dataService.fetchCompanies();
  }else if(this.dataType === 'event'){

    this.dataService.fetchEvents();
  }else if(this.dataType === 'User'){

    this.dataService.fetchUsers();
}
}

loadDataById(id:string){
  if (this.dataType === 'locale'){
  
    this.dataService.fetchPlacesById(id);
    
  }else if(this.dataType === 'Company'){
    
    this.dataService.fetchCompaniesById(id);
  }else if(this.dataType === 'event'){

    this.dataService.fetchEventsById(id);
  }else if(this.dataType === 'User'){

    this.dataService.fetchUserById(id);
  }
}

getItemDetails(id:string){
  let endpoint = '';
  if (this.dataType === 'locale') {
    endpoint = `${baseUrl}/api/locali`;
  } else if (this.dataType === 'Company') {
    endpoint = `${baseUrl}/api/companies`;
  } else if (this.dataType === 'event') {
    endpoint = `${baseUrl}/api/events`;
  }else if (this.dataType === 'User') {
    endpoint = `${baseUrl}/api/users`;
  }
  if (this.dataType === 'locale'){
  
    this.dataService.getPlaceById(endpoint,id).subscribe({
      next: (res) => {
        this.item = {...res}
        console.log(this.item)
      },
      error: (err) => console.error('Error :', err)
    });;
    
  }else if(this.dataType === 'Company'){
    
    this.dataService.getCompanyById(endpoint,id).subscribe({
      next: (res) => {
        this.item =  {...res}
        console.log(this.item)
       },
      error: (err) => console.error('Error :', err)
    });
  }else if(this.dataType === 'event'){

    this.dataService.getEventById(endpoint,id).subscribe({
      next: (res) => {
        this.item = {...res}
        console.log(this.item)
      },
      error: (err) => console.error('Error :', err)
    });;
  }else if(this.dataType === 'User'){

    this.dataService.getUserById(endpoint,id).subscribe({
      next: (res) => {
        this.item =  {...res}
        
        
      },
      error: (err) => console.error('Error :', err)
    });;
  }
}


deleteElement(id:string){
  let endpoint = '';
    if (this.dataType === 'locale') {
      endpoint = `${baseUrl}/api/locali`;
    } else if (this.dataType === 'Company') {
      endpoint = `${baseUrl}/api/companies`;
    } else if (this.dataType === 'event') {
      endpoint = `${baseUrl}/api/events`;
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
  trackByUser(index: number, item: User):string {
    console.log(item._id, index)
    return item._id; 
  }

  editElement(id:string){
    this.isEditingMode = true
    let endpoint = '';
    if (this.dataType === 'locale') {
      endpoint = `${baseUrl}/api/locali`;
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
      endpoint = `${baseUrl}/api/companies`;
      this.dataService.getCompanyById(endpoint, id);
         this.editedItemId.set(id);
    } else if (this.dataType === 'event') {
      this.editedItemId.set(id);
      console.log(id)
      endpoint = `${baseUrl}/api/events`;
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
    return this.http.get<LocaleOption[]>(`${baseUrl}/api/locali`).pipe(
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

  save(){
    if (!this.isEditingMode || !this.editedItemId()) {
      console.error('No element is being edited.');
      return;
    }
  
    let endpoint = '';
    let payload: any = {};
    const id = this.editedItemId();
  
    if (this.dataType === 'locale') {

      payload = this.placeForm.value; 
      
      this.editService.editPlace(id!,payload).subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          this.isEditingMode = false;
          this.editedItemId.set(null);
          this.loadData(); 
        },
        error: (err) => {
          console.error('Error updating element:', err);
        },
      });
    } else if (this.dataType === 'event') {
       payload = this.eventForm.value; 
       console.log(payload)
      this.editService.editEvent(id!,payload).subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          this.isEditingMode = false;
          this.editedItemId.set(null);
          this.loadData(); 
        },
        error: (err) => {
          console.error('Error updating element:', err);
        },
      });
    } else if (this.dataType === 'Company') {
      endpoint = `http://localhost:3000/api/companies/${id}`;
      console.log(payload)
    }
  
    
  }


  cancel(){
    this.isEditingMode = false
    this.editedItemId.set(null) 
  }

  
   
    }
    





    
  

