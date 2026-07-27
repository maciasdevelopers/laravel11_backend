import { TestBed } from '@angular/core/testing';

import { ActFijosService } from './act-fijos.service';

describe('ActFijosService', () => {
  let service: ActFijosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActFijosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
