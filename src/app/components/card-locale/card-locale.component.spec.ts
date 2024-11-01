import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardLocaleComponent } from './card-locale.component';

describe('CardLocaleComponent', () => {
  let component: CardLocaleComponent;
  let fixture: ComponentFixture<CardLocaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardLocaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardLocaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
