import { TestBed } from '@angular/core/testing';

import { DisAuthGuardService } from './disauth-guard.service';

describe('DisAuthGuardService', () => {
  let service: DisAuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisAuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
