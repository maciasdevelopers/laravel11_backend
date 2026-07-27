import { TestBed } from '@angular/core/testing';

import { BancosServService } from './bancos-serv.service';

describe('BancosServService', () => {
  let service: BancosServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BancosServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
