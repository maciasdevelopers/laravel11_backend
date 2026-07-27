import { TestBed } from '@angular/core/testing';

import { SentinelArkManager } from './sentinel-ark-manager';

describe('SentinelArkManager', () => {
  let service: SentinelArkManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SentinelArkManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
