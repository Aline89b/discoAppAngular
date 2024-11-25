import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, input, OnInit, signal, } from '@angular/core';
import { GuestList } from '../../../models/lista';
import { SnackbarService } from '../../../services/snackbar.service';
import { Router, RouterLink } from '@angular/router';
import { CreateCardsDataService } from '../../../services/create-cards-data.service';
import { Guest } from '../../../models/guest';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
  isEditing:boolean =false
  private fb = inject(FormBuilder);
  formArray: FormArray = this.fb.array([]);
  guestForm!: FormGroup
  constructor() { }
ngOnInit(): void {
 
this.getLists()


}
getLists(){
  this.http.get('http://localhost:3000/api/lists').subscribe({
    next: (res:any) => {
      console.log(res)
      this.lists.set(res); 
      this.initFormArray(res);
      console.log(typeof(res))
    },
    error: (err) => {
      console.error('Error fetching lists:', err);
      this.snackbar.show(err.error.message, "error");
    }
  });
}

initFormArray(lists: GuestList[]): void {
lists.forEach((list)=>{
  this.guestForm = new FormGroup({
    name: new FormControl(list.name, Validators.required),
    event: new FormControl(list.event, Validators.required),
    guests: new FormArray([])
    
  })
  this.formArray.push(this.guestForm);
})
  
  
}

getGuests(){
  return this.guestForm.get('guests') as FormArray
}
  
  
  createNewGroup(guest:Guest):FormGroup{

    return new FormGroup({
      name:new FormControl(guest?.name, Validators.required),
      surname:new FormControl(guest?.surname, Validators.required),
      noOfFriends:new FormControl(guest?.noOfFriends,[Validators.required,Validators.pattern(/^\d+(\.\d+)?$/)]),
      phone:new FormControl(guest?.phone,[Validators.required, Validators.pattern(/^\+39\d{9,10}$/)])
       })
  }
  createGuest(guest:Guest){
    this.getGuests().push(this.createNewGroup(guest));
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

sendCode(listId:string, guestId:string, status:string,phone:string){
  console.log(listId,guestId,status)
  this.dataService.sendCode(listId,guestId,status,phone).subscribe({
    next: (res:any) => {
      console.log(res)
      this.snackbar.show(res.message, "success")
    },
    error: (err) => {
      console.error('Error fetching lists:', err);
      this.snackbar.show(err.error.message, "error");
    }
  })
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

edit() {
  this.isEditing = true;
}
saveField(listId: string, guestIndex: number): void {
  const guestForm = this.formArray.at(guestIndex) as FormGroup;
  const updatedGuestData = guestForm.value;
  console.log(updatedGuestData)
/*
  this.http.put(`http://localhost:3000/api/lists/${listId}/guests/${guestIndex}`, updatedGuestData).subscribe({
    next: () => this.snackbar.show('Guest updated successfully', 'success'),
    error: (err) => this.snackbar.show(err.error.message, 'error'),
  });
  */
}

}

