import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoMovimientosFinancierosCuentasBankComponent } from './est-movim-financ-cuenta-bank-component';

describe('EstadoMovimientosFinancierosCuentasBankComponent', () => {
  let component: EstadoMovimientosFinancierosCuentasBankComponent;
  let fixture: ComponentFixture<EstadoMovimientosFinancierosCuentasBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstadoMovimientosFinancierosCuentasBankComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoMovimientosFinancierosCuentasBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
