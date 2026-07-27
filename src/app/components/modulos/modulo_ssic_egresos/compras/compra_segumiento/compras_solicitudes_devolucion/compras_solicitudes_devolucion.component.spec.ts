import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraDevolucionSolicitudComponent } from './compras_solicitudes_devolucion.component';

describe('CompraDevolucionSolicitudComponent', () => {
  let component: CompraDevolucionSolicitudComponent;
  let fixture: ComponentFixture<CompraDevolucionSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompraDevolucionSolicitudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraDevolucionSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
