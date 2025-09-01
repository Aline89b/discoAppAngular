import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component';
import { ResetPWComponent } from './components/reset-pw/reset-pw.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,AuthFormComponent,HomepageComponent,NavbarComponent,BottomNavComponent,ResetPWComponent,SnackbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  
  title = 'discoAppAngular';
  constructor(private router: Router) {}
  
  shouldShowNav(): boolean {
    
    
     if(this.router.url.includes('/login') || this.router.url.includes('/signup') || this.router.url.includes('/resetPW') || this.router.url.includes('/resetPWrequest') || this.router.url.includes('/verify') || this.router.url.includes('/resetPW/:id')){
      return false
    }else{
      return true
    }
  }

   
  
}

