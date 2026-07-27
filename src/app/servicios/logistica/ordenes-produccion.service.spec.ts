import { TestBed } from '@angular/core/testing';

import { OrdenesProduccionService } from './ordenes-produccion.service';

describe('OrdenesProduccionService', () => {
  let service: OrdenesProduccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenesProduccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
