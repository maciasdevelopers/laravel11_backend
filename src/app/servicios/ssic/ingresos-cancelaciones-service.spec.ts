import { TestBed } from '@angular/core/testing';

import { IngresosCancelacionesService } from './ingresos-cancelaciones-service';

describe('IngresosCancelacionesService', () => {
  let service: IngresosCancelacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngresosCancelacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
