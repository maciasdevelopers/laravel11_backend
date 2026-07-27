import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FederacionEstadosMunicipios } from './federacion-estados-municipios';

describe('FederacionEstadosMunicipios', () => {
  let component: FederacionEstadosMunicipios;
  let fixture: ComponentFixture<FederacionEstadosMunicipios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FederacionEstadosMunicipios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FederacionEstadosMunicipios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
