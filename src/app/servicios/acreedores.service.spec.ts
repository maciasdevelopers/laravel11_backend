import { TestBed } from '@angular/core/testing';

import { AcreedoresService } from './acreedores.service';

describe('AcreedoresService', () => {
  let service: AcreedoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcreedoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
