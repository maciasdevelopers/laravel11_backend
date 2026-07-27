import { TestBed } from '@angular/core/testing';

import { VentasServService } from './ventas-serv.service';

describe('VentasServService', () => {
  let service: VentasServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VentasServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
