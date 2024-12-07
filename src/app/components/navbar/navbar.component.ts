import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { FormControl } from '@angular/forms';
import { map, Observable, tap } from 'rxjs';
import { baseUrl } from '../../../url';
import { SearchResult, Option } from '../../../models/searchResult';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, AutocompleteComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
  
export class NavbarComponent {
  searchControl = new FormControl('');
  router = inject(Router)
  http = inject(HttpClient)
constructor(private cookie: CookieService){}
logout() {
  const token = this.cookie.get('token')
  if(token){
    this.cookie.delete('token')
    this.router.navigate(['/login']);
  }
 
}
fetchSuggestions = (query: string): Observable<Option[]> => {
  return this.http.post<any[]>(`${baseUrl}/api/search`, { query }).pipe(
    tap(results => console.log('API response:', results)),
    map(results =>
      results.map(result => ({
        name: result.name,
        id: result._id,
      }))
    )
  );
};

onOptionSelected(option: Option) {
  console.log(option.id)
  this.searchControl.setValue(option.name); 
  this.router.navigate([`/searchDetail/${option.id}`])
  console.log(`/searchDetail/${option.id}`)
}


} 