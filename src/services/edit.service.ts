import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guest } from '../models/guest';
import { GuestList } from '../models/lista';
import { Company } from '../models/company';
import { event } from '../models/event';
import { locale } from '../models/locale';
import { Observable } from 'rxjs';
import { baseUrl } from '../url';

@Injectable({
  providedIn: 'root'
})

export class EditService {
companyUrl = `${baseUrl}/api/companies`
eventUrl = `${baseUrl}/api/events`
localeUrl = `${baseUrl}/api/locali`
listUrl = `${baseUrl}/api/lists`
qrcodeUrl = `${baseUrl}/api/qrcodes`

  constructor(private http:HttpClient) { }

  editEvent(id: string, eventData:event): Observable<any>{
    return this.http.patch(`${this.eventUrl}/${id}`, { eventData })
  }

  editPlace(id: string, localeData:locale): Observable<any>{
    return this.http.patch(`${this.localeUrl}/${id}`, { localeData })
  }

  editList(id: string, listData: GuestList): Observable<any>{
    return this.http.patch(`${this.listUrl}/${id}`, { listData })
  }

  editCompany(id: string, companyData:Company): Observable<any>{
    return this.http.patch(`${this.companyUrl}/${id}`, { companyData })
  }

  changeStatus(listId:string, guestId:string): Observable<any> {
    return this.http.patch(`${this.listUrl}/${listId}/${guestId}`, { listId, guestId }); 
  }

}
