import { TestBed } from '@angular/core/testing';

import { AsimiladosService } from './asimilados-service';

describe('AsimiladosService', () => {
  let service: AsimiladosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsimiladosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
