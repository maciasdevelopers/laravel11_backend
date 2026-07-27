import { TestBed } from '@angular/core/testing';

import { ServNavSuperiorService } from './serv-nav-superior.service';

describe('ServNavSuperiorService', () => {
  let service: ServNavSuperiorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServNavSuperiorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
