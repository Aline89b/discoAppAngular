import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsByPlaceComponent } from './events-by-place.component';

describe('EventsByPlaceComponent', () => {
  let component: EventsByPlaceComponent;
  let fixture: ComponentFixture<EventsByPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsByPlaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsByPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
