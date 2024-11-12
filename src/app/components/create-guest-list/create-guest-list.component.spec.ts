import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGuestListComponent } from './create-guest-list.component';

describe('CreateGuestListComponent', () => {
  let component: CreateGuestListComponent;
  let fixture: ComponentFixture<CreateGuestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGuestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGuestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
