import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaClientesIngresosComponent } from './listaclientesingresos.component';

describe('CatalogosComponent', () => {
  let component: ListaClientesIngresosComponent;
  let fixture: ComponentFixture<ListaClientesIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaClientesIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaClientesIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
