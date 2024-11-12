
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
  this.loadData()
 
  }
  
loadData(){
  if (this.dataType === 'locale'){
  
    this.dataService.fetchPlaces();
    
  }else if(this.dataType === 'Company'){
    
    this.dataService.fetchCompanies();
  }else if(this.dataType === 'event'){

    this.dataService.fetchEvents();
  }
}
deleteElement(id:string){
  let endpoint = '';
    if (this.dataType === 'locale') {
      endpoint = '/api/locali';
    } else if (this.dataType === 'Company') {
      endpoint = '/api/companies';
    } else if (this.dataType === 'event') {
      endpoint = '/api/events';
    }

    this.dataService.deleteElement(endpoint, id).subscribe({
      next: () => this.loadData(),
      error: (err) => console.error('Error deleting element:', err)
    });
  }
}
    
  

