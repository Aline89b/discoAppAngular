import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-reset-pw',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterOutlet, RouterLink],
  templateUrl: './reset-pw.component.html',
  styleUrl: './reset-pw.component.css'
})

export class ResetPWComponent implements OnInit{
  
  passwordForm!: FormGroup;
  passwordMatchError: boolean = false;
  auth= inject(AuthService)
  path:string=''
  userId:string=''
  constructor( private route: ActivatedRoute , private router: Router) {}


  ngOnInit(): void {
    
    this.passwordForm =  new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/),
      ]),
      verificationCode: new FormControl('', Validators.required),
    });

    this.route.params.subscribe(params => {
      this.userId = params['id'];
      console.log('User ID from URL:', this.userId);
    });
    
  this.route.url.subscribe((url) => {
    this.path= url[0].path
    console.log(this.path)
    if (this.path === 'resetPW') {
      this.passwordForm.removeControl('email');
    } else if (this.path === 'resetPWrequest') {
      this.passwordForm.removeControl('password');
      this.passwordForm.removeControl('confirmPassword');
      this.passwordForm.removeControl('verificationCode')
    }
      
    })
  
  }

  checkPasswords() {
    const password = this.passwordForm.get('password')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
    this.passwordMatchError = password !== confirmPassword;
  }

  onSubmit() {
    const {email, password, verificationCode }= this.passwordForm.value
    this.checkPasswords();
    
    if (this.path === 'resetPW' && this.passwordForm.valid && !this.passwordMatchError) {
     // console.log('Form Submitted', this.passwordForm.value);
      this.auth.resetPW(this.userId, password, verificationCode).subscribe({
        next: (res: any) => {
          console.log('Success:', res);
          this.router.navigate(['/homepage']);
          
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          console.log('completed');
        },
      });
    }else if(this.path === 'resetPWrequest'){
      this.auth.resetPWrequest(email).subscribe({
        next: (res: any) => {
          console.log('Success:', res);
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          console.log('completed');
        },
      });
    }
  }
}
