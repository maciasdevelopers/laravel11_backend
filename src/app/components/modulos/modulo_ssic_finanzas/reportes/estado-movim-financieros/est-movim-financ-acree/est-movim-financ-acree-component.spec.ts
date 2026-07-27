import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoMovimientosFinancierosAcreeComponent } from './est-movim-financ-acree-component';

describe('EstadoMovimientosFinancierosAcreeComponent', () => {
  let component: EstadoMovimientosFinancierosAcreeComponent;
  let fixture: ComponentFixture<EstadoMovimientosFinancierosAcreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstadoMovimientosFinancierosAcreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoMovimientosFinancierosAcreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
