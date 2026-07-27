import { TestBed } from '@angular/core/testing';

import { MovimientosFinancierosService } from './movimientos-financieros-service';

describe('MovimientosFinancierosService', () => {
  let service: MovimientosFinancierosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientosFinancierosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
