import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent {
  router=inject(Router)

  navigateToHome(): void {
    this.router.navigate(['/homepage']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
