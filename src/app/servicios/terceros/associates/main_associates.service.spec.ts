import { TestBed } from '@angular/core/testing';

import { MainTerAssociatesService } from './main_associates.service';

describe('MainTerAssociatesService', () => {
  let service: MainTerAssociatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainTerAssociatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
