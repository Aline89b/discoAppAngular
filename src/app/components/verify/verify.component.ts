import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent implements OnInit {
  token: string | null = null;
  message: string = '';
  id: string | null = null
  status: string | null =''
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
  this.status = this.route.snapshot.queryParamMap.get('status');

    if (this.status === 'success') {
      this.message = 'Your email has been successfully verified!';
    
    } else if (this.status === 'error') {
      this.message = 'An error occurred during verification. Please try again.';
    } else {
      this.message = 'Verification status unknown. Please contact support.';
    }
  }
}
