import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalsListComponent } from './locals-list.component';

describe('LocalsListComponent', () => {
  let component: LocalsListComponent;
  let fixture: ComponentFixture<LocalsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
