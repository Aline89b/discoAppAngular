import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { DataService } from '../../../services/cards-data.service';
import { baseUrl } from '../../../url';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-detail',
  standalone: true,
  imports: [CardComponent,CommonModule],
  templateUrl: './search-detail.component.html',
  styleUrl: './search-detail.component.css'
})
export class SearchDetailComponent {
  data: any = null; 
  dataType: 'Company' | 'User' | 'locale' | 'event' = 'locale'; 
dataService = inject(DataService)
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
   
    this.route.paramMap
      .pipe(
        switchMap((params) => {
               const id = params.get('id');
console.log(id)
      if (!id) {
        return of(null); 
      }

      const endpointBase = `${baseUrl}/api`;

          if (this.dataType === 'locale') {
        return this.dataService.getPlaceById(`${endpointBase}/locali`, id);
      } else if (this.dataType === 'Company') {
        return this.dataService.getCompanyById(`${endpointBase}/companies`, id);
      } else if (this.dataType === 'event') {
        return this.dataService.getEventById(`${endpointBase}/events`, id);
      } else if (this.dataType === 'User') {
        return this.dataService.getUserById(`${endpointBase}/users`,id);
      } else {
        return of(null); 
      }
    }),
    catchError((error) => {
      console.error('Error fetching data:', error);
      return of(null); 
    })

      )
      .subscribe((data) => {
        this.data = data;
      });
    
  }
}
