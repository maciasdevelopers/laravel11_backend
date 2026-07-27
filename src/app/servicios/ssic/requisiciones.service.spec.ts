import { TestBed } from '@angular/core/testing';

import { RequisicionesService } from './requisiciones.service';

describe('RequisicionesService', () => {
  let service: RequisicionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequisicionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
