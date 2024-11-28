import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guest } from '../models/guest';
import { GuestList } from '../models/lista';
import { Company } from '../models/company';
import { event } from '../models/event';
import { locale } from '../models/locale';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EditService {
companyUrl = "http://localhost:3000/api/companies"
eventUrl = "http://localhost:3000/api/events"
localeUrl = "http://localhost:3000/api/locali"
listUrl = "http://localhost:3000/api/lists"
guestUrl = "http://localhost:3000/api/lists"
qrcodeUrl = "http://localhost:3000/api/qrcodes"

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

}
