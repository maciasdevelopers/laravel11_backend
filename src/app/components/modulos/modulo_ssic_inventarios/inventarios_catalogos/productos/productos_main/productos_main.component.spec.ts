import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosInventariosMainComponent } from './productos_main.component';

describe('ProductosInventariosMainComponent', () => {
  let component: ProductosInventariosMainComponent;
  let fixture: ComponentFixture<ProductosInventariosMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductosInventariosMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosInventariosMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
