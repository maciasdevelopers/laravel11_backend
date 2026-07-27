import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VHumanoSolicitudesCancelacion } from './vhumano-solicitudes-cancelacion';

describe('VHumanoSolicitudesCancelacion', () => {
  let component: VHumanoSolicitudesCancelacion;
  let fixture: ComponentFixture<VHumanoSolicitudesCancelacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VHumanoSolicitudesCancelacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VHumanoSolicitudesCancelacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
