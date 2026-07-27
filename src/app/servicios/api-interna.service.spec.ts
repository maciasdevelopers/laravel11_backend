import { TestBed } from '@angular/core/testing';

import { ApiInternaService } from './api-interna.service';

describe('ApiInternaService', () => {
  let service: ApiInternaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiInternaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
