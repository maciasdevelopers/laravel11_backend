import { TestBed } from '@angular/core/testing';

import { AssocGuardService } from './auth-assoc.service';

describe('AssocGuardService', () => {
  let service: AssocGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssocGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
