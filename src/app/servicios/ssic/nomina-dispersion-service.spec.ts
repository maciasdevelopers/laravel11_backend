import { TestBed } from '@angular/core/testing';

import { NominaDispersionService } from './nomina-dispersion-service';

describe('NominaDispersionService', () => {
  let service: NominaDispersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NominaDispersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
