import { TestBed } from '@angular/core/testing';

import { EgresosCancelacionesService } from './egresos-cancelaciones-service';

describe('EgresosCancelacionesService', () => {
  let service: EgresosCancelacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EgresosCancelacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
