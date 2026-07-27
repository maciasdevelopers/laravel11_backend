import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionesProveedoresListadoComponent } from './cotizaciones_proveedores_listado.component';

describe('CotizacionesProveedoresListadoComponent', () => {
  let component: CotizacionesProveedoresListadoComponent;
  let fixture: ComponentFixture<CotizacionesProveedoresListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CotizacionesProveedoresListadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CotizacionesProveedoresListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
