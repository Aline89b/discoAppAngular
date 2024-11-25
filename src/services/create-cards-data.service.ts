import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guest } from '../models/guest';
import { GuestList } from '../models/lista';
import { Company } from '../models/company';
import { event } from '../models/event';
import { locale } from '../models/locale';

@Injectable({
  providedIn: 'root'
})
export class CreateCardsDataService {
companyUrl = "http://localhost:3000/api/companies"
eventUrl = "http://localhost:3000/api/events"
localeUrl = "http://localhost:3000/api/locali"
listUrl = "http://localhost:3000/api/lists"
guestUrl = "http://localhost:3000/api/lists"
qrcodeUrl = "http://localhost:3000/api/qrcodes"



  constructor(private http: HttpClient) { }

  addEvent(eventData:event): Observable<any>{
    return this.http.post(this.eventUrl, {eventData})

  }
  addCompany(companyData:Company): Observable<any>{
    return this.http.post(this.companyUrl, {companyData})

  }
  addGuest(guestData:Guest,listId:string): Observable<any>{
    return this.http.post(`${this.guestUrl}/${listId}/guests `, {guestData})

  }
  sendCode(listId:string,guestId:string,status:string,phone:string): Observable<any>{
    return this.http.post(`${this.qrcodeUrl}/${listId}/${guestId} `, {listId,guestId,status,phone})
  }
  addList(listData: GuestList): Observable<any>{
    return this.http.post( this.listUrl , {listData})

  }
  addLocale(localeData: locale): Observable<any>{
    return this.http.post(this.localeUrl, {localeData})

  }
  deleteList(id:string) {
    return this.http.delete(`${this.listUrl}/${id}`)

  }

  

}
