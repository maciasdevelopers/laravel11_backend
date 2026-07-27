import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculadorasActualizacionesYRecargos } from './calculadoras-actualizaciones-y-recargos';

describe('CalculadorasActualizacionesYRecargos', () => {
  let component: CalculadorasActualizacionesYRecargos;
  let fixture: ComponentFixture<CalculadorasActualizacionesYRecargos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculadorasActualizacionesYRecargos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculadorasActualizacionesYRecargos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
