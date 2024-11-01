import { Component, inject, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import { NavbarComponent } from '../navbar/navbar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { FooterComponent } from '../footer/footer.component';


@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NavbarComponent,BottomNavComponent,FooterComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
CookieService = inject(CookieService)

ngOnInit(): void {
  const token = this.CookieService.get('token')
  const email = this.CookieService.get('email')
  console.log(token, email)
 
}

}
