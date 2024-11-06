
import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../../services/cards-data.service';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {

  
  @Input() dataType: 'Company' | 'User' | 'locale' | 'event'= 'locale';

  places = this.dataService.places
  events = this.dataService.events;
  companies = this.dataService.companies

  constructor(private dataService: DataService) {}
ngOnInit(): void {
  
  if (this.dataType === 'locale'){
    this.dataService.fetchPlaces();
    
  }else if(this.dataType === 'Company'){
    this.dataService.fetchCompanies();
  }else if(this.dataType === 'event'){

    this.dataService.fetchEvents();
  }
  
}
   
    
  
}
