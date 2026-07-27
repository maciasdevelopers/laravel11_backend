import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosVmostradorCatalogoComponent } from './productos-vmostrador-catalogo.component';

describe('ProductosVmostradorCatalogoComponent', () => {
  let component: ProductosVmostradorCatalogoComponent;
  let fixture: ComponentFixture<ProductosVmostradorCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductosVmostradorCatalogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosVmostradorCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
