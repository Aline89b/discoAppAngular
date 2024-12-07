import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateCardsDataService } from '../../../services/create-cards-data.service';

import { CommonModule } from '@angular/common';
import { startWith, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SnackbarService } from '../../../services/snackbar.service';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { decodedToken } from '../../../models/decodedToken';
import { LocaleOption } from '../../../models/locale';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})


export class FormComponent implements OnInit {
  @Input() dataType: 'Company' | 'User' | 'Locale' | 'Event'='Company';
  @Input() initialData: any = {}; 
  form!: FormGroup;

  filteredOptions: Observable<any[]> | undefined  
  options: any[] =[]
  
  filteredLocali: Observable<any[]> | undefined  
  locali: any[] =[]
  
  constructor(private cookie: CookieService, public snackbar: SnackbarService, private http: HttpClient, private fb: FormBuilder, private createDataService: CreateCardsDataService) {}

  ngOnInit(): void {
    
    
   
    if (this.dataType === 'User') {
      this.form = this.fb.group({
        name: [this.initialData.name || '', Validators.required],
        email: [this.initialData.email || '', [Validators.required, Validators.email]],
        role: [this.initialData.role || 'employee', Validators.required],
      });
    } else if (this.dataType === 'Locale') {
      this.form = this.fb.group({
        name: [this.initialData.name || '', Validators.required],
        address: [this.initialData.address || '', Validators.required],
        city: [this.initialData.city || '', Validators.required],
        zipCode:[this.initialData.city || '', Validators.required],
        capacity: [this.initialData.capacity || 0, Validators.min(1)],
      });
      this.filteredOptions = this.form.get('address')!.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value:any) => this.fetchAddressSuggestions(value))
      );
    } else if (this.dataType === 'Event') {
      this.form = this.fb.group({
        name: [this.initialData.name || '', Validators.required],
        locale: [this.initialData.locale || '', Validators.required],
        date: [this.initialData.date || '', Validators.required],
        time: [this.initialData.time || '', Validators.required],
        price: [this.initialData.price || 0, Validators.min(0)],
      });
      this.filteredLocali = this.form.get('locale')!.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value:any) => this.fetchLocale(value))
      );
      
    }else if (this.dataType === 'Company') {
      this.form = this.fb.group({
        name: [this.initialData.name || '', Validators.required],
        regione_sociale: [this.initialData.locale || '', Validators.required],
        PI: [this.initialData.date || '', [Validators.required, Validators.pattern('^IT\\d{11}$')]],
        SDI: [this.initialData.time || '',[Validators.required,Validators.pattern('^[A-Za-z0-9]{7}$')]],
        address: [this.initialData.address || '', Validators.required],
        city: [this.initialData.city || '', Validators.required],
        zipCode:[this.initialData.city || '', Validators.required],
        email: [this.initialData.email || '', Validators.email],
        phone: [this.initialData.phone || '',[Validators.required, Validators.pattern(/^\+39\d{10}$/)] ],
      });
      
      
      this.filteredOptions = this.form.get('address')!.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value:any) => this.fetchAddressSuggestions(value))
      );
    }
  }
  isVisible: boolean = true;

  fetchLocale(value: string):Observable<LocaleOption[]>{
    if (value.length < 3) return of([]);
return this.http.get('http://localhost:3000/api/locali').pipe(
  map((locali:any) =>
    locali.map((locale:LocaleOption) =>({
       name: locale.name,
       address: locale.address
      })
    
      )),
     
    )

  }
  selectLocale(locale:LocaleOption): void {
    this.form.patchValue({
      locale: locale.name,
      
    });
    this.isVisible =!this.isVisible
  }
 
  fetchAddressSuggestions(query: string): Observable<any[]> {
    if (query.length < 3) return of([]); 

    const params = {
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '5'
    };

    return this.http.get<any[]>('https://nominatim.openstreetmap.org/search', { params }).pipe(
      map((results) => results.map(result => ({
        
        display_name: result.display_name, 
        city: result.address.city || result.address.town || result.address.village || '',
        postcode: result.address.postcode || ''
        
      })))
    );
  }
 
  selectOption(option: any): void {
    this.form.patchValue({
      address: option.display_name,
      city: option.city,
      zipCode: option.postcode
    });
    this.isVisible =!this.isVisible
  }
  
 
  onSubmit(): void {
    if (this.form.valid) {
      const formData = { ...this.form.value };
      console.log(formData)
      const token = this.cookie.get('token'); // Or any storage method you use
      console.log(token)
      const decodedToken:decodedToken = jwtDecode(token)
      console.log(decodedToken.userId)
      formData.userId= decodedToken.userId
      if (this.dataType === 'Company') {
        
        this.createDataService.addCompany(formData).subscribe({
          next: (res: any) => {
            console.log('Success:', res);
            this.snackbar.show(res.message,"success")
          },
          error: (err) => {
            console.error(err);
            this.snackbar.show(err.error.message, "error")
          },
          complete: () => {
            console.log('completed');
          },
        });
      } else if (this.dataType === 'Locale') {
        this.createDataService.addLocale(formData).subscribe({
          next: (res: any) => {
            console.log('Success:', res);
            this.snackbar.show(res.message,"success")
          },
          error: (err) => {
            console.error(err);
            this.snackbar.show(err.error.message, "error")
          },
          complete: () => {
            console.log('completed');
          },
        });
      } else if (this.dataType === 'Event') {
        console.log(formData)
        this.createDataService.addEvent(formData).subscribe({
          next: (res: any) => {
            console.log('Success:', res);
            this.snackbar.show(res.message,"success")
          },
          error: (err) => {
            console.error(err);
            this.snackbar.show(err.error.message, "error")
          },
          complete: () => {
            console.log('completed');
          },
        });
      }
    }
  }
}


