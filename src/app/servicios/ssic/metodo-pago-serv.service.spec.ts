import { TestBed } from '@angular/core/testing';

import { MetodoPagoServService } from './metodo-pago-serv.service';

describe('MetodoPagoServService', () => {
  let service: MetodoPagoServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetodoPagoServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
