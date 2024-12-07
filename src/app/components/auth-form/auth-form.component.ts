import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import {CookieService} from 'ngx-cookie-service';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterOutlet, RouterLink,SnackbarComponent],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css',
})
export class AuthFormComponent implements OnInit {
  authForm!: FormGroup;
  isSignUp: boolean = false;
  isInvitingUser: boolean = false;
  CookieService = inject(CookieService);

  roles: Array<{ value: string; label: string }> = [
    { value: 'admin', label: 'admin' },
    { value: 'manager', label: 'manager' },
    { value: 'staff', label: 'staff' },
    { value: 'pr', label: 'pr' },
  ];
  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
   public snackbar: SnackbarService

  ) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/),
      ]),
      role: new FormControl('', Validators.required),
    });

    this.route.url.subscribe((url) => {
      const path = url[0].path;
      this.isSignUp = path === 'signup';
      this.isInvitingUser = path === 'invite-user';
      console.log(this.isInvitingUser)

      if (this.isSignUp || this.isInvitingUser) {
        if (!this.authForm.contains('role')) {
          this.authForm.addControl('role', new FormControl('', Validators.required));
        }
      } else {
        if (this.authForm.contains('role')) {
          this.authForm.removeControl('role');
        }
      }
      if (this.isSignUp || !this.isInvitingUser) {
        if (this.authForm.contains('name')){
          this.authForm.removeControl('name');
        }
        
      }
      if (this.isInvitingUser) {
        this.authForm.addControl('name', new FormControl('', Validators.required));
      }
    });
    
  }

  // Toggle between Sign In and Sign Up
  toggleForm() {
    this.isSignUp = !this.isSignUp;
    console.log(this.isSignUp);
    this.router.navigate([this.isSignUp ? '/signup' : '/login']);

  }

  // Handle form submission
  onSubmit() {
    if (this.authForm.invalid) return;

    const {name, email, password, role } = this.authForm.value;

        if (this.isSignUp) {
      this.auth.addUser(email, password, role).subscribe({
        next: (res: any) => {
          console.log('Success:', res);
          this.snackbar.show(res.message,"success")
        },
        error: (err) => {
          console.error(err);
          this.snackbar.show(err.error.message, "error")
        },
        complete: () => {
          console.log('completed');
        },
      });
     } else if(this.isInvitingUser){
      console.log(name,email,password,role)
      this.auth.inviteUser(name,email,password,role).subscribe({
        next: (res) => {
          console.log('User invited successfully:', res);
          this.snackbar.show(res.message, "success");
        },
        error: (err) => {
          console.error('Error inviting user:', err);
          this.snackbar.show(err.error.message, "error");
        },
        complete: () => {
          console.log('Invite user action completed.');
        }
      })
     }else {
      this.auth.logIn(email, password).subscribe({
        next: (res: any) => {
        
          this.CookieService.set('token', res.token)
          this.CookieService.set('email', res.email)
          this.router.navigate(['/homepage']);
        },
        error: (err: any) => console.error('Login Error:', err),
        complete: () => {
          console.log('completed');
        },
      });
    }
  }
}
