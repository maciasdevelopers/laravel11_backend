import { TestBed } from '@angular/core/testing';

import { ComprasServService } from './compras-serv.service';

describe('ComprasServService', () => {
  let service: ComprasServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprasServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
