import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoReporteNomina } from './nuevo-reporte-nomina';

describe('NuevoReporteNomina', () => {
  let component: NuevoReporteNomina;
  let fixture: ComponentFixture<NuevoReporteNomina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevoReporteNomina]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoReporteNomina);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
