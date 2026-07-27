import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosInventariosRegistroComponent } from './productos-inventarios-registro.component';

describe('ProductosInventariosRegistroComponent', () => {
  let component: ProductosInventariosRegistroComponent;
  let fixture: ComponentFixture<ProductosInventariosRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductosInventariosRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosInventariosRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
