import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresosSolicitudesCancelacion } from './ingresos-solicitudes-cancelacion';

describe('IngresosSolicitudesCancelacion', () => {
  let component: IngresosSolicitudesCancelacion;
  let fixture: ComponentFixture<IngresosSolicitudesCancelacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IngresosSolicitudesCancelacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresosSolicitudesCancelacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
