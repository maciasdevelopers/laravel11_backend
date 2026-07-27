import { TestBed } from '@angular/core/testing';

import { ImpuestosServService } from './impuestos-serv.service';

describe('ImpuestosServService', () => {
  let service: ImpuestosServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpuestosServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
