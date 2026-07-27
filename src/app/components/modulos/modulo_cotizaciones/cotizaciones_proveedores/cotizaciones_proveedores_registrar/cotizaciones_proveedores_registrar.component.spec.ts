import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionesProveedoresRegistrarComponent } from './cotizaciones_proveedores_registrar.component';

describe('CotizacionesProveedoresRegistrarComponent', () => {
  let component: CotizacionesProveedoresRegistrarComponent;
  let fixture: ComponentFixture<CotizacionesProveedoresRegistrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionesProveedoresRegistrarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionesProveedoresRegistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
