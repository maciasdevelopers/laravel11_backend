import { TestBed } from '@angular/core/testing';

import { LoaderServService } from './loader-serv.service';

describe('LoaderServService', () => {
  let service: LoaderServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
