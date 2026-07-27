import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoReporteAsimilados } from './nuevo-reporte-asimilados';

describe('NuevoReporteAsimilados', () => {
  let component: NuevoReporteAsimilados;
  let fixture: ComponentFixture<NuevoReporteAsimilados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevoReporteAsimilados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoReporteAsimilados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
