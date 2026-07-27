import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPromocionesIngresosComponent } from './listapromocionesingresos.component';

describe('CatalogosComponent', () => {
  let component: ListaPromocionesIngresosComponent;
  let fixture: ComponentFixture<ListaPromocionesIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaPromocionesIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPromocionesIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
