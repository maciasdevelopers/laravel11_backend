import { TestBed } from '@angular/core/testing';

import { FedEstMunService } from './fed-est-mun-service';

describe('FedEstMunService', () => {
  let service: FedEstMunService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FedEstMunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
