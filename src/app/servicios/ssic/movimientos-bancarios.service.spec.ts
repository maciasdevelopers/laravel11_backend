import { TestBed } from '@angular/core/testing';

import { MovimientosDineroService } from './movimientos-dinero.service';

describe('MovimientosDineroService', () => {
  let service: MovimientosDineroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientosDineroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
