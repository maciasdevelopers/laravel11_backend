import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgresosSolicitudesDeCancelacion } from './egresos-solicitudes-de-cancelacion';

describe('EgresosSolicitudesDeCancelacion', () => {
  let component: EgresosSolicitudesDeCancelacion;
  let fixture: ComponentFixture<EgresosSolicitudesDeCancelacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EgresosSolicitudesDeCancelacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgresosSolicitudesDeCancelacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
