import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, input, OnInit, signal, } from '@angular/core';
import { GuestList } from '../../../models/lista';
import { SnackbarService } from '../../../services/snackbar.service';
import { Router, RouterLink } from '@angular/router';
import { CreateCardsDataService } from '../../../services/create-cards-data.service';
import { Guest } from '../../../models/guest';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [ CommonModule, RouterLink],
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.css'
})


export class GuestListComponent implements OnInit {
  http = inject(HttpClient)
  snackbar = inject(SnackbarService)
  lists  = signal<GuestList[]>([])
  guests: Guest[] = []
  dataService = inject(CreateCardsDataService)
  router = inject(Router)
  constructor() { }
ngOnInit(): void {
 
this.getLists()


}
getLists(){
  this.http.get('http://localhost:3000/api/lists').subscribe({
    next: (res:any) => {
      console.log(res)
      this.lists.set(res); 
    },
    error: (err) => {
      console.error('Error fetching lists:', err);
      this.snackbar.show(err.error.message, "error");
    }
  });
}

deleteGuest(listId:string, guestId: string): void {
  this.http.delete(`http://localhost:3000/api/lists/${listId}/${guestId}`).subscribe({
    next: () => {
      console.log('Guest removed successfully');
      this.guests = this.guests.filter(guest => guest._id !== guestId);
      this.getLists()
    },
    error: (err) => {
      console.error('Error fetching lists:', err);
      this.snackbar.show(err.error.message, "error");
    }
  })
}
 addGuest(listName: string, eventDefined:string,listId:string) {
  console.log(listName,eventDefined,listId)
  this.router.navigate(['/create-guest-list'], {
    state: { listName, eventDefined,listId }
  });
}
deleteList(id:string){
  this.dataService.deleteList(id).subscribe({
    next: (res:any) => {
      console.log(res)
      this.lists.set(res); 
    },
    error: (err) => {
      console.error('Error fetching lists:', err);
      this.snackbar.show(err.error.message, "error");
    }
  })
}

}

