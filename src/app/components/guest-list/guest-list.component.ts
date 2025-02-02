import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, effect, ElementRef, inject, input, OnInit, QueryList, signal, ViewChildren, } from '@angular/core';
import { GuestList } from '../../../models/lista';
import { SnackbarService } from '../../../services/snackbar.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CreateCardsDataService } from '../../../services/create-cards-data.service';
import { Guest } from '../../../models/guest';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditService } from '../../../services/edit.service';
import { baseUrl } from '../../../url';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { decodedToken } from '../../../models/decodedToken';
import { DataService } from '../../../services/cards-data.service';

@Component({
  selector: 'app-guest-list',
  standalone: true,
  imports: [ CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './guest-list.component.html',
  styleUrl: './guest-list.component.css'
})


export class GuestListComponent implements OnInit, AfterViewInit {
  data = inject(DataService)
  http = inject(HttpClient)
  snackbar = inject(SnackbarService)
  lists = this.data.lists
  guests: Guest[] = []
  dataService = inject(CreateCardsDataService)
  router = inject(Router)
  isEditing:boolean =false
  private fb = inject(FormBuilder);
  formArray: FormArray = this.fb.array([]);
  guestForm!: FormGroup
  editedItemId = signal<string | null>(null);
  checked:boolean = false
  editService =inject(EditService)
  listId!:string
  guestId!:string
  isLoading: boolean = true
  highlightedId: string | null = null;
  route= inject(ActivatedRoute)
  @ViewChildren('listElement') listElements!: QueryList<ElementRef>
  item: GuestList = {
    _id: '',
    name: '',
    event: {
      id: '',
      name: ''
    },
    guests: [],
    createdBy: { name: '', id: '', email: '' }
  }
  cookie = inject(CookieService)
  role: string = ''
  
  id =''
  constructor() { }

  ngOnInit(): void {
      const token = this.cookie.get('token')
       const decodedToken:decodedToken = jwtDecode(token)
          
           this.role= decodedToken.role
      if (this.role !== 'admin') {
        this.data.fetchListsByCompany()
        this.isLoading = false
      }else{
        this.getLists()
      }    
    const { listId, guestId } = history.state;
    console.log(listId,guestId)
    this.guestId= guestId
    this.listId = listId
     if(this.id){
    this.route.params.subscribe(params => {
      this.id = params['id'];
     
        this.http.get<GuestList> (`${baseUrl}/api/lists/${this.id}`).subscribe({
          next: (res) => {
            this.item = {...res}
            console.log(this.item)
          },
          error: (err) => console.error('Error :', err)
        });
  
    })}  

}

ngAfterViewInit(): void {
  if(this.listId && this.guestId) {
      
    this.scrollToList(this.listId)
  }
}
getLists(){
  this.http.get( `${baseUrl}/api/lists`).subscribe({
    next: (res:any) => {
      console.log(res)
      this.lists.set(res); 
      this.initFormArray(res);
      this.isLoading = false
    },
    error: (err) => {
      console.error('Error fetching lists:', err);
      this.snackbar.show(err.error.message, "error");
      this.isLoading = false
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

  if(listIndex === -1){
    const guestControl = this.formArray.controls[guestIndex].get(controlName)
    if (guestControl) {
      return guestControl as FormControl;
    }
    throw new Error(`Guest control not found for field ${controlName}`);
  } ;
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
  this.http.delete(`${baseUrl}/api/lists/${listId}/${guestId}`).subscribe({
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
  
  return item._id
}
trackByGuest(index: number, item: Guest):string {

  return `${item._id}-${index}` 
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
  const id = this.editedItemId();
  console.log(id)
  const formGroupIndex = this.lists().findIndex(list => list._id === id);

  if (formGroupIndex === -1) {
    console.error('No matching list found for the provided ID.');
    return;
  }

  const listFormGroup = this.getFormGroupAt(formGroupIndex);
  let payload: any = {};
  
   payload = {
    name: listFormGroup.get('name')?.value,
    event: listFormGroup.get('event')?.value,
    guests: listFormGroup.get('guests')?.value,
  };
   
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
    



scrollToList(listId: string) {
  this.highlightedId = listId;
  const element = this.listElements.find(el => el.nativeElement.getAttribute('_id') === listId)?.nativeElement;
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      this.highlightedId = null;
    }, 2000);
  }
}

onCheckboxChange(event: Event): void {
  const isChecked = (event.target as HTMLInputElement).checked;
  if (isChecked) {
    this.editService.changeStatus(this.listId,this.guestId).subscribe({
      next: (res) => {console.log(res)},
      error:(err)=>{
        console.error(console.log(err))
      }
    })
     
  }
}
}

