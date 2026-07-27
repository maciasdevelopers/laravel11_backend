import { TestBed } from '@angular/core/testing';

import { SSICReembolsosService } from './ssic_reembolsos.service';

describe('SSICReembolsosService', () => {
  let service: SSICReembolsosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SSICReembolsosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
