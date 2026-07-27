import { TestBed } from '@angular/core/testing';

import { CFDIService } from './cfdi.service';

describe('CFDIService', () => {
  let service: CFDIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CFDIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
