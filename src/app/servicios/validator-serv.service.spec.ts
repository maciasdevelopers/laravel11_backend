import { TestBed } from '@angular/core/testing';

import { ValidatorServService } from './validator-serv.service';

describe('ValidatorServService', () => {
  let service: ValidatorServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidatorServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
