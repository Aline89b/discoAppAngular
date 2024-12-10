import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../../services/cards-data.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { CreateCardsDataService } from '../../../services/create-cards-data.service';
import { jwtDecode } from 'jwt-decode';
import { decodedToken } from '../../../models/decodedToken';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-create-guest-list',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './create-guest-list.component.html',
  styleUrl: './create-guest-list.component.css'
})
export class CreateGuestListComponent implements OnInit {
  guestForm!: FormGroup;
  events: Array<{ value: string; label: string, id:number }> =[]
  listName!: string; 
  eventDefined!: string; 
  listId!: string
  constructor(private cookie: CookieService, public snackbar: SnackbarService, private dataService: DataService,private createDataService: CreateCardsDataService) { }
ngOnInit(): void {
  
  
  const { listName, eventDefined,listId } = history.state;
    this.listName = listName;
    this.eventDefined = eventDefined;
    this.listId = listId
if(this.listName && this.eventDefined){
  console.log(this.listName,typeof(this.eventDefined),listId)
   
    this.guestForm = new FormGroup({
      name: new FormControl({ value: listName, disabled: true }, Validators.required), 
      event: new FormControl({ value: this.eventDefined, disabled: true }, Validators.required), 
      guests: new FormArray([]) 
    });
}else{

  this.dataService.getEventByCompany().subscribe({
    next: (res: any[]) => {
      console.log(res)
   this.events = res.map(event => ({
    label: event.name,
    value: event.name,
    id: event._id
  }));
  console.log(this.events)
    },
    error: (err) => {
      console.error(err);
      this.snackbar.show(err.error.message, "error")
    },
    complete: () => {
      console.log('completed');
    },
  });
  
    this.guestForm = new FormGroup({
      name: new FormControl('', Validators.required),
      event: new FormControl('', Validators.required),
      guests: new FormArray([])
      
    })
}


}
getGuests(){
  return this.guestForm.get('guests') as FormArray
}
  
  createGuest(){
    this.getGuests().push(this.createNewGroup());
  }
  
  createNewGroup():FormGroup{
    return new FormGroup({
      name:new FormControl('', Validators.required),
      surname:new FormControl('', Validators.required),
      noOfFriends:new FormControl(0,[Validators.required,Validators.pattern(/^\d+(\.\d+)?$/)]),
      phone:new FormControl('',[Validators.required, Validators.pattern(/^\+39\d{9,10}$/)])
       })
  }

  removeGuest(index: number): void {
    this.getGuests().removeAt(index);
  }

 
  onSubmit(): void {
    const guestsData ={ ...this.guestForm.value } 
    
    if(this.guestForm.valid && this.listId){
      console.log(this.listId)
      guestsData.listId = this.listId
      console.log(guestsData)
      this.createDataService.addGuest(guestsData,this.listId).subscribe({
        next: (res: any) => {
          console.log('Success:', res);
          this.snackbar.show(res.message,"success")
        },
        error: (err) => {
          console.error(err);
          this.snackbar.show(err.error.message, "error")
        },
    })
  }else if (this.guestForm.valid && !this.listId) {
      
    const token = this.cookie.get('token'); 
    console.log(token)
    const decodedToken:decodedToken = jwtDecode(token)
    console.log(decodedToken.userId)
    guestsData.userId= decodedToken.userId
    
    console.log('Guest List:', guestsData);
    this.createDataService.addList(guestsData).subscribe({
      next: (res: any) => {
        console.log('Success:', res);
        this.snackbar.show(res.message,"success")
      },
      error: (err) => {
        console.error(err);
        this.snackbar.show(err.error.message, "error")
      },
      complete: () => {
        console.log('completed');
      },
      
    })
    
  }
}    
    
  }
