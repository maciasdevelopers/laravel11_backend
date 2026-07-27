import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoOrdenrecepcionRegistroCompraComponent } from './seguimiento-ordenrecepcion-registro-compra.component';

describe('SeguimientoOrdenrecepcionRegistroCompraComponent', () => {
  let component: SeguimientoOrdenrecepcionRegistroCompraComponent;
  let fixture: ComponentFixture<SeguimientoOrdenrecepcionRegistroCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeguimientoOrdenrecepcionRegistroCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoOrdenrecepcionRegistroCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
