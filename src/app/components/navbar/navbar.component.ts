import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
  
export class NavbarComponent {
  router = inject(Router)
constructor(private cookie: CookieService){}
logout() {
  const token = this.cookie.get('token')
  if(token){
    this.cookie.delete('token')
    this.router.navigate(['/login']);
  }
 
}


} 