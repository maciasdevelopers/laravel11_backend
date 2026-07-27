import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculadoraRetencionIsrIva } from './calculadora-retencion-isr-iva';

describe('CalculadoraRetencionIsrIva', () => {
  let component: CalculadoraRetencionIsrIva;
  let fixture: ComponentFixture<CalculadoraRetencionIsrIva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculadoraRetencionIsrIva]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculadoraRetencionIsrIva);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
