import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoMovimientosFinancierosMonedElectComponent } from './est-movim-financ-moned-elect-component';

describe('EstadoMovimientosFinancierosMonedElectComponent', () => {
  let component: EstadoMovimientosFinancierosMonedElectComponent;
  let fixture: ComponentFixture<EstadoMovimientosFinancierosMonedElectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstadoMovimientosFinancierosMonedElectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoMovimientosFinancierosMonedElectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
