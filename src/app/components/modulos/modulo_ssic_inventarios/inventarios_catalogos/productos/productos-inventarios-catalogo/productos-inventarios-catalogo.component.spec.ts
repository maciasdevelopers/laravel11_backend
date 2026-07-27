import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosInventariosCatalogoComponent } from './productos-inventarios-catalogo.component';

describe('ProductosInventariosCatalogoComponent', () => {
  let component: ProductosInventariosCatalogoComponent;
  let fixture: ComponentFixture<ProductosInventariosCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductosInventariosCatalogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosInventariosCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
