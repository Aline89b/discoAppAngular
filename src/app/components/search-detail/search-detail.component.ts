import { Component, inject, Input, OnInit } from '@angular/core';


import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-search-detail',
  standalone: true,
  imports: [CardComponent,CommonModule],
  templateUrl: './search-detail.component.html',
  styleUrl: './search-detail.component.css'
})
export class SearchDetailComponent implements OnInit {
  dataType: 'List' | 'Company' | 'User' | 'locale' | 'event'= 'locale';
 item: any = {};
  isLoading:boolean = true
  searchService = inject(SearchService)
  route = inject(ActivatedRoute)
  constructor(){}
ngOnInit(): void {
  this.route.params.subscribe(params => {
    const id = params['id'];
    if(id){
   this.getItemDetails(id!)
    }
})
}
getItemDetails(id:string){
  this.searchService.getItemDetails(id).subscribe(item=>{
   console.log(item)
    if(item && item.time){
      this.dataType = 'event'
    }else if(item && item.PI){
      this.dataType = 'Company'
    }else if(item && item.capacity){
      this.dataType = 'locale'
    }else if(item && item.role){
      this.dataType = 'User'
    }else{
      this.dataType = 'List'
    }
    this.isLoading = false;
  })
}
}