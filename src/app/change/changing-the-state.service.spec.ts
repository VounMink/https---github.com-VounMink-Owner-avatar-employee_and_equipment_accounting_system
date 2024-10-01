import { TestBed } from '@angular/core/testing';

import { ChangingTheStateService } from './changing-the-state.service';

describe('ChangingTheStateService', () => {
  let service: ChangingTheStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangingTheStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
