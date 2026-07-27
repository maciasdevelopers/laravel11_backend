import { TestBed } from '@angular/core/testing';

import { CatSatServService } from './cat-sat-serv.service';

describe('CatSatServService', () => {
  let service: CatSatServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatSatServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
