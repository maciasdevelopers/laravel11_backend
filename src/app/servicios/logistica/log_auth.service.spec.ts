import { TestBed } from '@angular/core/testing';

import { LogGuardService } from './log_auth.service';

describe('LogGuardService', () => {
  let service: LogGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
