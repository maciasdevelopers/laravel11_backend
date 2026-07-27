import { TestBed } from '@angular/core/testing';

import { PuntoVentaService } from './punto-venta.service';

describe('PuntoVentaService', () => {
  let service: PuntoVentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuntoVentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
