import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoMovimientosFinancierosCajasComponent } from './est-movim-financ-cajas-component';

describe('EstadoMovimientosFinancierosCajasComponent', () => {
  let component: EstadoMovimientosFinancierosCajasComponent;
  let fixture: ComponentFixture<EstadoMovimientosFinancierosCajasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstadoMovimientosFinancierosCajasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoMovimientosFinancierosCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
