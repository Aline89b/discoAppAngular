import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { locale } from '../models/locale';
import  {event} from '../models/event'
import { Company } from '../models/company'
import { Guest } from '../models/guest';
import { baseUrl } from '../url';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})


export class DataService {
  companyUrl = `${baseUrl}/api/companies`
  eventUrl = `${baseUrl}/api/events`
  localeUrl = `${baseUrl}/api/locali`
  listUrl = `${baseUrl}/api/lists`
  guestUrl = `${baseUrl}/api/guests`
  userUrl = `${baseUrl}/api/users`
  private placesSignal = signal<locale[]>([]);
  private eventsSignal = signal<event[]>([]);
  private companiesSignal = signal<Company[]>([]);
private usersSignal = signal<User[]>([])
  constructor(private http: HttpClient) {}

  fetchPlaces(): void {
    this.http.get<locale[]>(this.localeUrl).subscribe((placeData) => {
      this.placesSignal.set(placeData);
      console.log(placeData)
    });
  }
  fetchUsers(): void {
    this.http.get<User[]>(this.userUrl).subscribe((User) => {
      this.usersSignal.set(User);
      console.log(User)
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
  fetchUserById( id:string):void{
    this.http.get<User>(`${this.userUrl}/${id}`).subscribe((User) => {
      this.usersSignal.set([User]);
      console.log(User)
    })
  }
  
  getGuestById(listId:String, guestId:string): Observable<Guest> {
    return this.http.get<Guest> (`${this.listUrl}/${listId}/${guestId}`)
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
  get users() {
    return this.usersSignal
  }
  deleteElement(endpoint:string,id:string){
    return this.http.delete(`${endpoint}/${id}`)
  }
}
