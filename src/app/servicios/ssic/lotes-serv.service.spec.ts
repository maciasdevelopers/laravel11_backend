import { TestBed } from '@angular/core/testing';

import { LotesServService } from './lotes-serv.service';

describe('VentasServService', () => {
  let service: LotesServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LotesServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
