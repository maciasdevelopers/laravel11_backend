import { TestBed } from '@angular/core/testing';

import { MonederoElectService } from './monedero-elect.service';

describe('MonederoElectService', () => {
  let service: MonederoElectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonederoElectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
