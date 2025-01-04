import { Component, inject, Input, OnInit } from '@angular/core';


import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-search-detail',
  standalone: true,
  imports: [CardComponent,CommonModule],
  templateUrl: './search-detail.component.html',
  styleUrl: './search-detail.component.css'
})
export class SearchDetailComponent implements OnInit {
  dataType: 'List' | 'Company' | 'User' | 'locale' | 'event'= 'User';
  item: any = {};
  isLoading:boolean = true
  searchService = inject(SearchService)
  route = inject(ActivatedRoute)
  router = inject(Router)
  constructor(){}
ngOnInit(): void {
  console.log(this.dataType)
  this.route.params.subscribe(params => {
    const id = params['id'];
    if(id){
   this.getItemDetails(id!)
   
    }
})
}
getItemDetails(id: string) {
  this.searchService.getItemDetails(id).subscribe({
    next: item => {
      console.log('Fetched Item:', item);
      console.log(this.dataType)
      this.item = item;
      if (item?.time) this.dataType = 'event';
      else if (item?.PI) this.dataType = 'Company';
      else if (item?.capacity) this.dataType = 'locale';
      else if (item?.role) this.dataType = 'User';
      else {
        this.dataType = 'List';
        this.router.navigate([`/guest-list/${id}`]);
      }
      console.log('Updated DataType:', this.dataType);
      this.isLoading = false;
    },
    error: err => {
      console.error('Error fetching item:', err);
      this.isLoading = false;
    },
  });
}
}