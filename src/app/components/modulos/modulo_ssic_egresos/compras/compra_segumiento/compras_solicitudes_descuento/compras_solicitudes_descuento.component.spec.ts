import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasSolicitudesDeDescuentoComponent } from './compras_solicitudes_descuento.component';

describe('ComprasSolicitudesDeDescuentoComponent', () => {
  let component: ComprasSolicitudesDeDescuentoComponent;
  let fixture: ComponentFixture<ComprasSolicitudesDeDescuentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComprasSolicitudesDeDescuentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasSolicitudesDeDescuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
