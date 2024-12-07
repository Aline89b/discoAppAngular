import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { locale } from '../../../models/locale';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css'
})
export class AutocompleteComponent implements OnInit {
  @Input() control!: FormControl
  @Input() fetchSuggestions!: (query: string) => Observable<any[]>; 
  @Input() placeholder: string = ''; 
  @Input() displayField: string = 'display_name'; 

  @Output() optionSelected = new EventEmitter<any>(); 

  filteredOptions$: Observable<any[]> = of([]);
  isVisible: boolean = false;
 
  
  ngOnInit() {
   
    if (!this.control || !this.fetchSuggestions) {
      console.error('AutocompleteComponent: Missing required inputs!');
      return;
    }

    this.filteredOptions$ = this.control.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) =>
        value?.length >= 3 ? this.fetchSuggestions(value) : of([])
      
      )
    );
 
  }
  
 
  onInput(event: Event): void {
   
    const inputElement = event.target as HTMLInputElement;
    console.log('Input value:', inputElement.value);
    if (!this.fetchSuggestions) {
      console.error('fetchSuggestions function is not provided');
      return;
    }
    this.fetchSuggestions(inputElement.value).subscribe({
      next: (results) => {
        const options = results.map((result: any) => ({
          name: result.name,
          address: result.address,
        }));
        console.log('Transformed results:',options);
      },
      error: (err) => {
        console.error('Error fetching suggestions:', err);
      },
    });
  }
  handleBlur(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as HTMLElement;
  
   
    if (
      relatedTarget &&
      relatedTarget.closest('.dropdown-content') 
    ) {
      return;
    }
  
    this.isVisible = false; 
  }
  
  selectOption(option:any) {
  
    console.log('Option selected:', option);
    this.optionSelected.emit(option);
    this.isVisible = false; 
  }
  
  

  toggleDropdown() {
    this.isVisible = !this.isVisible; // Toggle dropdown visibility
  }
  trackByFn(index: number, item: any): any {
    
    return item.id || item.name || index; // Ensure a unique property is returned
  }
  

}
