import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoMovimientosFinancierosComponent } from './estado-movimientos-financieros.component';

describe('EstadoMovimientosFinancierosComponent', () => {
  let component: EstadoMovimientosFinancierosComponent;
  let fixture: ComponentFixture<EstadoMovimientosFinancierosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstadoMovimientosFinancierosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoMovimientosFinancierosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
