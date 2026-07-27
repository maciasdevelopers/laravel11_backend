import { TestBed } from '@angular/core/testing';

import { SsicComisionesService } from './ssic-comisiones.service';

describe('SsicComisionesService', () => {
  let service: SsicComisionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SsicComisionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
