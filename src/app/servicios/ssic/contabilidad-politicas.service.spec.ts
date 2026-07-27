import { TestBed } from '@angular/core/testing';

import { ContabilidadPoliticasService } from './contabilidad-politicas.service';

describe('ContabilidadPoliticasService', () => {
  let service: ContabilidadPoliticasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContabilidadPoliticasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
