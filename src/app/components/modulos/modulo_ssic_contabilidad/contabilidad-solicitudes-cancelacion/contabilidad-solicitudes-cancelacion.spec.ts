import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabilidadSolicitudesCancelacion } from './contabilidad-solicitudes-cancelacion';

describe('ContabilidadSolicitudesCancelacion', () => {
  let component: ContabilidadSolicitudesCancelacion;
  let fixture: ComponentFixture<ContabilidadSolicitudesCancelacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContabilidadSolicitudesCancelacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContabilidadSolicitudesCancelacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
