import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { locale } from '../models/locale';
import  {event} from '../models/event'
import { Company } from '../models/company'
@Injectable({
  providedIn: 'root'
})


export class DataService {
  companyUrl = "http://localhost:3000/api/companies"
  eventUrl = "http://localhost:3000/api/events"
  localeUrl = "http://localhost:3000/api/locali"
  listUrl = "http://localhost:3000/api/lists"
  guestUrl = "http://localhost:3000/api/guests"
 
  private placesSignal = signal<locale[]>([]);
  private eventsSignal = signal<event[]>([]);
  private companiesSignal = signal<Company[]>([]);

  constructor(private http: HttpClient) {}

  fetchPlaces(): void {
    this.http.get<locale[]>(this.localeUrl).subscribe((placeData) => {
      this.placesSignal.set(placeData);
      console.log(placeData)
    });
  }

  fetchPlacesById(id:string): void {
    this.http.get<locale[]>(`${this.localeUrl}/byUser/${id}`).subscribe((placeData) => {
      this.placesSignal.set(placeData);
      console.log(placeData)
    });
  }

  getPlaceById(endpoint:string,id:string): Observable<locale> {
    return this.http.get<locale>(`${endpoint}/${id}`)
  }

  fetchEvents(): void {
    this.http.get<event[]>(this.eventUrl).subscribe((eventsData) => {
      this.eventsSignal.set(eventsData);
      console.log(eventsData)
    });
  }
  fetchEventsById(id:string): void {
    this.http.get<event[]>(`${this.eventUrl}/${id}`).subscribe((eventsData) => {
      this.eventsSignal.set(eventsData);
      console.log(eventsData)
    });
  }
  getEventById(endpoint:string,id:string): Observable<event> {
    return this.http.get<event> (`${endpoint}/${id}`)
  }
  getEventByCompany():Observable<event[]> {
    return this.http.get<event[]> ( `${this.eventUrl}/byCompany `)
  }

  fetchCompanies(): void {
    this.http.get<Company[]>(this.companyUrl).subscribe((companiesData) => {
      this.companiesSignal.set(companiesData);
      console.log(companiesData)
    });
  }

  fetchCompaniesById(id:string): void {
    this.http.get<Company[]>(`${this.companyUrl}/${id}`).subscribe((companiesData) => {
      this.companiesSignal.set(companiesData);
      console.log(companiesData)
    });
  }
  getCompanyById(endpoint:string, id:string):void{
    this.http.get<Company>(`${endpoint}/${id}`).subscribe((companyData) => {
      this.companiesSignal.set([companyData]);
      console.log(companyData)
    });
  }

    get places() {
    return this.placesSignal
  }
  
  get events() {
    return this.eventsSignal
  }

  get companies() {
    return this.companiesSignal
  }

  deleteElement(endpoint:string,id:string){
    return this.http.delete(`${endpoint}/${id}`)
  }
}
