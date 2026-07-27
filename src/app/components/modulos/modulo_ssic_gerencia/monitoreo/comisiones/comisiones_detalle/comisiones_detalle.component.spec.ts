import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaComisionesDetalleComponent } from './comisiones_detalle.component';

describe('GerenciaComisionesDetalleComponent', () => {
  let component: GerenciaComisionesDetalleComponent;
  let fixture: ComponentFixture<GerenciaComisionesDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GerenciaComisionesDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciaComisionesDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
