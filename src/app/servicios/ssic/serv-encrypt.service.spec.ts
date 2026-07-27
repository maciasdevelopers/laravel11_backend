import { TestBed } from '@angular/core/testing';

import { ServEncryptService } from './serv-encrypt.service';

describe('ServEncryptService', () => {
  let service: ServEncryptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServEncryptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
