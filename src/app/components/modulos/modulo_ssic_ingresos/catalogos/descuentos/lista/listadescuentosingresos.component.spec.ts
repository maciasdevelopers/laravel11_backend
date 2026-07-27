import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDescuentosIngresosComponent } from './listadescuentosingresos.component';

describe('CatalogosComponent', () => {
  let component: ListaDescuentosIngresosComponent;
  let fixture: ComponentFixture<ListaDescuentosIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaDescuentosIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaDescuentosIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
