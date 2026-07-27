import { TestBed } from '@angular/core/testing';

import { ContabilidadCancelacionesService } from './contabilidad-cancelaciones-service';

describe('ContabilidadCancelacionesService', () => {
  let service: ContabilidadCancelacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContabilidadCancelacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
