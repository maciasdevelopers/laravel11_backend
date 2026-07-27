import { TestBed } from '@angular/core/testing';

import { CargaPaginaService } from './carga-pagina.service';

describe('CargaPaginaService', () => {
  let service: CargaPaginaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargaPaginaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
