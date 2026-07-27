import { TestBed } from '@angular/core/testing';

import { SessionContextService } from './session-context';

describe('SessionContextService', () => {
  let service: SessionContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
