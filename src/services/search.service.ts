import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../url';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  

  constructor(private http: HttpClient) {}

 
  fetchSuggestions(query: string): Observable<any[]> {
    return this.http.post<any[]>(`${baseUrl}/search`, { query });
  }

  
  getItemDetails(id: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/api/search/searchDetail/${id}`);  
  }
}
