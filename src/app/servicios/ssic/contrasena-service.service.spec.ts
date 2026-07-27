import { TestBed } from '@angular/core/testing';

import { ContrasenaServiceService } from './contrasena-service.service';

describe('ContrasenaServiceService', () => {
  let service: ContrasenaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContrasenaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
