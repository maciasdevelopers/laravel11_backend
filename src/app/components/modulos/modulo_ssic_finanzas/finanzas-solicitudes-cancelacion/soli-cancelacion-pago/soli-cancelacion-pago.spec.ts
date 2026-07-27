import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoliCancelacionPago } from './soli-cancelacion-pago';

describe('SoliCancelacionPago', () => {
  let component: SoliCancelacionPago;
  let fixture: ComponentFixture<SoliCancelacionPago>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoliCancelacionPago]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoliCancelacionPago);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
