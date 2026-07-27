import { TestBed } from '@angular/core/testing';

import { UbicacionServService } from './ubicacion-serv.service';

describe('UbicacionServService', () => {
  let service: UbicacionServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UbicacionServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
