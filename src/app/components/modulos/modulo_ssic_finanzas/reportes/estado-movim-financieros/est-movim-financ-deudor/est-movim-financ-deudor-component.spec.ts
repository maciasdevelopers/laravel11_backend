import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoMovimientosFinancierosDeudorComponent } from './est-movim-financ-deudor-component';

describe('EstadoMovimientosFinancierosDeudorComponent', () => {
  let component: EstadoMovimientosFinancierosDeudorComponent;
  let fixture: ComponentFixture<EstadoMovimientosFinancierosDeudorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstadoMovimientosFinancierosDeudorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoMovimientosFinancierosDeudorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
