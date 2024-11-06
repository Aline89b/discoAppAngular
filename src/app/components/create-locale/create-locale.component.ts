import { Component } from '@angular/core';
import { FormComponent } from '../form/form.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-create-locale',
  standalone: true,
  imports: [FormComponent,CommonModule],
  templateUrl: './create-locale.component.html',
  styleUrl: './create-locale.component.css'
})
export class CreateLocaleComponent {

}
