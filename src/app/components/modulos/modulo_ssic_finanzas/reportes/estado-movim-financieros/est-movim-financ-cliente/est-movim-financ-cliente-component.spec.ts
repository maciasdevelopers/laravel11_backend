import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoMovimientosFinancierosClienteComponent } from './est-movim-financ-cliente-component';

describe('EstadoMovimientosFinancierosClienteComponent', () => {
  let component: EstadoMovimientosFinancierosClienteComponent;
  let fixture: ComponentFixture<EstadoMovimientosFinancierosClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstadoMovimientosFinancierosClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoMovimientosFinancierosClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
