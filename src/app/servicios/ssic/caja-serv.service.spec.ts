import { TestBed } from '@angular/core/testing';

import { CajaServService } from './caja-serv.service';

describe('CajaServService', () => {
  let service: CajaServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CajaServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
