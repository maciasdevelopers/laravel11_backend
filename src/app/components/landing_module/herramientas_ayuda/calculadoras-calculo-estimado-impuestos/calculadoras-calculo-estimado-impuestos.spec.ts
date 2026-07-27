import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculadorasCalculoEstimadoImpuestos } from './calculadoras-calculo-estimado-impuestos';

describe('CalculadorasCalculoEstimadoImpuestos', () => {
  let component: CalculadorasCalculoEstimadoImpuestos;
  let fixture: ComponentFixture<CalculadorasCalculoEstimadoImpuestos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculadorasCalculoEstimadoImpuestos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculadorasCalculoEstimadoImpuestos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
