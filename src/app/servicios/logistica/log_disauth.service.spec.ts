import { TestBed } from '@angular/core/testing';

import { LogDisGuardService } from './log_disauth.service';

describe('LogDisGuardService', () => {
  let service: LogDisGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogDisGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
