import { TestBed } from '@angular/core/testing';

import { DeclaracionesService } from './declaraciones-service';

describe('DeclaracionesService', () => {
  let service: DeclaracionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeclaracionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
