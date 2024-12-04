import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Guest } from '../models/guest';
import { GuestList } from '../models/lista';
import { Company } from '../models/company';
import { event } from '../models/event';
import { locale } from '../models/locale';
import { baseUrl } from '../url';

@Injectable({
  providedIn: 'root'
})
export class CreateCardsDataService {
companyUrl = `${baseUrl}/api/companies`
eventUrl = `${baseUrl}/api/events`
localeUrl = `${baseUrl}/api/locali`
listUrl = `${baseUrl}/api/lists`
guestUrl = `${baseUrl}/api/lists`
qrcodeUrl = `${baseUrl}/api/qrcodes`



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
