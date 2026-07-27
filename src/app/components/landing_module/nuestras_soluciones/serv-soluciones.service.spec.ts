import { TestBed } from '@angular/core/testing';

import { ServSolucionesService } from './serv-soluciones.service';

describe('ServSolucionesService', () => {
  let service: ServSolucionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServSolucionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
