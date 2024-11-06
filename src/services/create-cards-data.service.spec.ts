import { TestBed } from '@angular/core/testing';

import { CreateCardsDataService } from './create-cards-data.service';

describe('CreateCardsDataService', () => {
  let service: CreateCardsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateCardsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
