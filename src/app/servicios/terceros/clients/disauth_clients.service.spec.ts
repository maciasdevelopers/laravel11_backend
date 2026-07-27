import { TestBed } from '@angular/core/testing';

import { ClientsDisGuardService } from './disauth_clients.service';

describe('ClientsDisGuardService', () => {
  let service: ClientsDisGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientsDisGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
