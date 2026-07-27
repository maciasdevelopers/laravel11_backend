import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanzasSolicitudesDeCancelacion } from './cancelacion_lista_solicitudes';

describe('FinanzasSolicitudesDeCancelacion', () => {
  let component: FinanzasSolicitudesDeCancelacion;
  let fixture: ComponentFixture<FinanzasSolicitudesDeCancelacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinanzasSolicitudesDeCancelacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanzasSolicitudesDeCancelacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
