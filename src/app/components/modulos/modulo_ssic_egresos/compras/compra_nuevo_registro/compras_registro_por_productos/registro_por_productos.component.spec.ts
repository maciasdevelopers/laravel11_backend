import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCompraProductosComponent } from './registro_por_productos.component';

describe('RegistroCompraProductosComponent', () => {
  let component: RegistroCompraProductosComponent;
  let fixture: ComponentFixture<RegistroCompraProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroCompraProductosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCompraProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
