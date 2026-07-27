import { TestBed } from '@angular/core/testing';

import { VhumanoCancelacionesService } from './vhumano-cancelaciones-service';

describe('VhumanoCancelacionesService', () => {
  let service: VhumanoCancelacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VhumanoCancelacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
