import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosVmostradorRegistroComponent } from './productos-vmostrador-registro.component';

describe('ProductosVmostradorRegistroComponent', () => {
  let component: ProductosVmostradorRegistroComponent;
  let fixture: ComponentFixture<ProductosVmostradorRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductosVmostradorRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosVmostradorRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
