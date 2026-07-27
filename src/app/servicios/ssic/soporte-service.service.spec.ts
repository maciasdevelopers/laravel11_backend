import { TestBed } from '@angular/core/testing';

import { SoporteServiceService } from './soporte-service.service';

describe('SoporteServiceService', () => {
  let service: SoporteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoporteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
