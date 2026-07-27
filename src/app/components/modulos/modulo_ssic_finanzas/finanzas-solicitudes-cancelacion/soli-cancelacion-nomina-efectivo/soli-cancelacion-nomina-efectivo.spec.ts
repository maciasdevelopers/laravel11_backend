import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoliCancelacionNominaEfectivo } from './soli-cancelacion-nomina-efectivo';

describe('SoliCancelacionNominaEfectivo', () => {
  let component: SoliCancelacionNominaEfectivo;
  let fixture: ComponentFixture<SoliCancelacionNominaEfectivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoliCancelacionNominaEfectivo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoliCancelacionNominaEfectivo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
