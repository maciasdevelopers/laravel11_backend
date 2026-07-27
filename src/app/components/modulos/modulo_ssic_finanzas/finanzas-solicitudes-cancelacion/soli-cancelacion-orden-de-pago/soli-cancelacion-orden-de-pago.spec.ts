import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoliCancelacionOrdenDePago } from './soli-cancelacion-orden-de-pago';

describe('SoliCancelacionOrdenDePago', () => {
  let component: SoliCancelacionOrdenDePago;
  let fixture: ComponentFixture<SoliCancelacionOrdenDePago>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoliCancelacionOrdenDePago]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoliCancelacionOrdenDePago);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
