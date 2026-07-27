import { TestBed } from '@angular/core/testing';

import { OrdenesRecepcionService } from './ordenes-recepcion-service';

describe('OrdenesRecepcionService', () => {
  let service: OrdenesRecepcionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenesRecepcionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
