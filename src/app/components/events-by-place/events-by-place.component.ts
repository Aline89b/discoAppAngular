import { Component, Inject, inject, OnInit } from '@angular/core';
import { DataService } from '../../../services/cards-data.service';
import { event } from '../../../models/event';
import { ActivatedRoute} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events-by-place',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-by-place.component.html',
  styleUrl: './events-by-place.component.css'
})
export class EventsByPlaceComponent implements OnInit{
dataService = inject(DataService)
events: event[] = []
route = inject(ActivatedRoute)
constructor(){}

ngOnInit(): void {
  this.route.params.subscribe(params => {
    const name = params['name'];
  this.dataService.getEventsByPlace(name).subscribe({
    next:(res)=>{
      console.log(res)
    this.events= res
  },
    error:(err)=>console.error(err)
  })
})
}
trackByEvent(index: number, item: any): string {
  return item._id; // Use a unique identifier from your event model
}

viewEventDetails(event: any): void {
  console.log('View event:', event);
  // Add navigation or logic to show event details
}
}
