import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { FormControl } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { baseUrl } from '../../../url';
import { SearchResult } from '../../../models/searchResult';
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
fetchSuggestions = (query: string): Observable<any[]> => {
 
 console.log(query)
 console.log(this.searchControl.value)
  return this.http.post<any[]>(`${baseUrl}/api/search`, {query}).pipe(
    map((results: SearchResult[]) =>
      results.map((result: SearchResult) => ({
        name: result.name,
        id: result._id,
      }))
    )
  );
};

onOptionSelected(option: any) {
  console.log('Selected option:', option);
  // Navigate to the relevant page or perform an action
}


} 