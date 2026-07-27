import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoOrdenForCompraComponent } from './pago_orden_for_compra.component';

describe('PagoOrdenForCompraComponent', () => {
  let component: PagoOrdenForCompraComponent;
  let fixture: ComponentFixture<PagoOrdenForCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoOrdenForCompraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoOrdenForCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
