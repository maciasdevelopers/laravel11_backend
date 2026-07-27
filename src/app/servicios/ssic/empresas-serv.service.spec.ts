import { TestBed } from '@angular/core/testing';

import { EmpresasServService } from './empresas-serv.service';

describe('EmpresasServService', () => {
  let service: EmpresasServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpresasServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
