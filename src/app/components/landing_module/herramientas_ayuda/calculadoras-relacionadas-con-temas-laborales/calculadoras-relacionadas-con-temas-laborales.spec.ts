import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculadorasRelacionadasConTemasLaborales } from './calculadoras-relacionadas-con-temas-laborales';

describe('CalculadorasRelacionadasConTemasLaborales', () => {
  let component: CalculadorasRelacionadasConTemasLaborales;
  let fixture: ComponentFixture<CalculadorasRelacionadasConTemasLaborales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculadorasRelacionadasConTemasLaborales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculadorasRelacionadasConTemasLaborales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
