import { TestBed } from '@angular/core/testing';

import { SolicitudFacturaService } from './solicitud-factura.service';

describe('SolicitudFacturaService', () => {
  let service: SolicitudFacturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudFacturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
