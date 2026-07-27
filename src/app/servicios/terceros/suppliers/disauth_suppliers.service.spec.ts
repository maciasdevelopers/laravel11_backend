import { TestBed } from '@angular/core/testing';

import { SuppliersgDisGuardService } from './disauth_suppliers.service';

describe('SuppliersgDisGuardService', () => {
  let service: SuppliersgDisGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuppliersgDisGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
