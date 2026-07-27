import { TestBed } from '@angular/core/testing';

import { CatalogoActividadesRiesgoIMSS } from './catalogo-actividades-riesgo-imss';

describe('CatalogoActividadesRiesgoIMSS', () => {
  let service: CatalogoActividadesRiesgoIMSS;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogoActividadesRiesgoIMSS);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
