import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosCuentasPropiasComponent } from './movimientos-cuentas-propias.component';

describe('MovimientosCuentasPropiasComponent', () => {
  let component: MovimientosCuentasPropiasComponent;
  let fixture: ComponentFixture<MovimientosCuentasPropiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovimientosCuentasPropiasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientosCuentasPropiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
