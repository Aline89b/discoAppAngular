import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../../services/snackbar.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
})
export class SnackbarComponent implements OnInit {
  message = '';
  isVisible = false;

  constructor(public snackbarService: SnackbarService) {}

  ngOnInit(): void {
    
    this.snackbarService.snackbarState$.subscribe(({ message, type }) => {
      this.message = message;
      this.isVisible = true;

      // Auto-hide after a set time
      setTimeout(() => {
        this.isVisible = false;
      }, 3000); // 3 seconds
    });
  }
}

