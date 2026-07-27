import { TestBed } from '@angular/core/testing';

import { UniMedServService } from './uni-med-serv.service';

describe('UniMedServService', () => {
  let service: UniMedServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniMedServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
