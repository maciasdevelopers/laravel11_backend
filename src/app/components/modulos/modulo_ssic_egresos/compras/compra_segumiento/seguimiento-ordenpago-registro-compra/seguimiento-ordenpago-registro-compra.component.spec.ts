import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoOrdenpagoRegistroCompraComponent } from './seguimiento-ordenpago-registro-compra.component';

describe('SeguimientoOrdenpagoRegistroCompraComponent', () => {
  let component: SeguimientoOrdenpagoRegistroCompraComponent;
  let fixture: ComponentFixture<SeguimientoOrdenpagoRegistroCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeguimientoOrdenpagoRegistroCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeguimientoOrdenpagoRegistroCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
