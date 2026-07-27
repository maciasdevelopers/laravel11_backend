import { TestBed } from '@angular/core/testing';

import { AssocDisGuardService } from './disauth_assoc.service';

describe('AssocDisGuardService', () => {
  let service: AssocDisGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssocDisGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
