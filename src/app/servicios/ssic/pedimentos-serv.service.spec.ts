import { TestBed } from '@angular/core/testing';

import { PedimentosService } from './pedimentos-serv.service';

describe('PedimentosService', () => {
  let service: PedimentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedimentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
