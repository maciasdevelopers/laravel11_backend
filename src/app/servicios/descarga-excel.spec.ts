import { TestBed } from '@angular/core/testing';

import { DescargaExcel } from './descarga-excel';

describe('DescargaExcel', () => {
  let service: DescargaExcel;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescargaExcel);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
