import { TestBed } from '@angular/core/testing';

import { SuppliersGuardService } from './auth_suppliers.service';

describe('SuppliersGuardService', () => {
  let service: SuppliersGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuppliersGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
