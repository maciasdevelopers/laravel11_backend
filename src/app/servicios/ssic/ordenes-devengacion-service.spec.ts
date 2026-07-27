import { TestBed } from '@angular/core/testing';

import { OrdenesDevengacionService } from './ordenes-devengacion-service';

describe('OrdenesDevengacionService', () => {
  let service: OrdenesDevengacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenesDevengacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
