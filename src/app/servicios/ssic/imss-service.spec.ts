import { TestBed } from '@angular/core/testing';

import { ImssService } from './imss-service';

describe('ImssService', () => {
  let service: ImssService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImssService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
