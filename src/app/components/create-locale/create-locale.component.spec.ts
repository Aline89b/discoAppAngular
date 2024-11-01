import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLocaleComponent } from './create-locale.component';

describe('CreateLocaleComponent', () => {
  let component: CreateLocaleComponent;
  let fixture: ComponentFixture<CreateLocaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLocaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLocaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
