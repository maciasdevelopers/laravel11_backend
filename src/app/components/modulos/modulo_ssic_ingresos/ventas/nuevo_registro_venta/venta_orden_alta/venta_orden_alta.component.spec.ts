import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaVentasIngresosComponent } from './venta_orden_alta.component';

describe('AltaVentasIngresosComponent', () => {
  let component: AltaVentasIngresosComponent;
  let fixture: ComponentFixture<AltaVentasIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaVentasIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaVentasIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
