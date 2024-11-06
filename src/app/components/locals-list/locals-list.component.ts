import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-locals-list',
  standalone: true,
  imports: [CardComponent,CommonModule],
  templateUrl: './locals-list.component.html',
  styleUrl: './locals-list.component.css'
})
export class LocalsListComponent {

}
