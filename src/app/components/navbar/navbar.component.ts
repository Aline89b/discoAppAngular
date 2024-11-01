import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
constructor(private cookie: CookieService){}
logout() {
  const token = this.cookie.get('token')
  if(token){
    this.cookie.delete('token')
  }
 
}


} 