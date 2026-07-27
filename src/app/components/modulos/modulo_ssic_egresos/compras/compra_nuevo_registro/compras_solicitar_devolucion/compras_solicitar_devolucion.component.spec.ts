import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraDevolucionSolicitarComponent } from './compras_solicitar_devolucion.component';

describe('CompraDevolucionSolicitarComponent', () => {
  let component: CompraDevolucionSolicitarComponent;
  let fixture: ComponentFixture<CompraDevolucionSolicitarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompraDevolucionSolicitarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraDevolucionSolicitarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
