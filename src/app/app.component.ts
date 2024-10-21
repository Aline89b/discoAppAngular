import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFormComponent } from './components/auth-form/auth-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AuthFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'discoAppAngular';
}
