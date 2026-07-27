import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoMovimientosFinancierosProveedorComponent } from './est-movim-financ-proveedor-component';

describe('EstadoMovimientosFinancierosProveedorComponent', () => {
  let component: EstadoMovimientosFinancierosProveedorComponent;
  let fixture: ComponentFixture<EstadoMovimientosFinancierosProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstadoMovimientosFinancierosProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoMovimientosFinancierosProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
