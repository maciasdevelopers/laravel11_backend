import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaGeneralVentasIngresosComponent } from './venta_orden_lista_general.component';

describe('ListaGeneralVentasIngresosComponent', () => {
  let component: ListaGeneralVentasIngresosComponent;
  let fixture: ComponentFixture<ListaGeneralVentasIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaGeneralVentasIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaGeneralVentasIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
