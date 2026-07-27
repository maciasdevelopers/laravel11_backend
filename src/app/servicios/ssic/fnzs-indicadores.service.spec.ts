import { TestBed } from '@angular/core/testing';

import { FnzsIndicadoresService } from './fnzs-indicadores.service';

describe('FnzsIndicadoresService', () => {
  let service: FnzsIndicadoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FnzsIndicadoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
