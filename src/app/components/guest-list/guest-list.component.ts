import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, input, OnInit, signal, } from '@angular/core';
import { GuestList } from '../../../models/lista';
import { SnackbarService } from '../../../services/snackbar.service';
import { Router, RouterLink } from '@angular/router';
import { CreateCardsDataService } from '../../../services/create-cards-data.service';
import { Guest } from '../../../models/guest';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditService } from '../../../services/edit.service';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [ CommonModule, RouterLink, ReactiveFormsModule],
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
  editedItemId = signal<string | null>(null);

  editService =inject(EditService)
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
      
    },
    error: (err) => {
      console.error('Error fetching lists:', err);
      this.snackbar.show(err.error.message, "error");
    }
  });
}
getFormGroupAt(index: number): FormGroup {
  return this.formArray.at(index) as FormGroup;
}
getFormControl(group: FormGroup, controlName: string): FormControl {
  return group.get(controlName) as FormControl;
}

getGuestsFormArray(index: number): FormArray {
  return this.getFormGroupAt(index).get('guests') as FormArray;
}
getGuestControl(listIndex: number, guestIndex: number, controlName: string): FormControl {
  return this.getGuestsFormArray(listIndex).at(guestIndex).get(controlName) as FormControl;
}

initFormArray(lists: GuestList[]): void {
  lists.forEach((list) => {
    const guestsFormArray = new FormArray(
      list.guests.map((guest) => this.createNewGroup(guest))
    );

    const listFormGroup = new FormGroup({
      name: new FormControl(list.name, Validators.required),
      event: new FormControl(list.event, Validators.required),
      guests: guestsFormArray,
    });

    this.formArray.push(listFormGroup);
  });
}

cancel(){
 this.isEditing= false
 this.editedItemId.set(null);
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
trackByList(index: number, item: GuestList):string {
  
  return item._id; 
}
trackByGuest(index: number, item: Guest):string {

  return item._id; 
}
edit(id:string) {
  this.isEditing = true;
  this.editedItemId.set(id);
   
  console.log(id)
}
save(){
  if (!this.isEditing  || !this.editedItemId()) {
    console.error('No element is being edited.');
    return;
  }

  
  let payload: any = {};
  const id = this.editedItemId();
   console.log(id)
   /* payload = this.listForm.value; 
    
    this.editService.editList(id!,payload).subscribe({
      next: (response) => {
        console.log('Update successful:', response);
        this.isEditing = false;
        this.editedItemId.set(null);
        this.getLists(); 
      },
      error: (err) => {
        console.error('Error updating element:', err);
      },
    });
  }
    
*/
}
}

