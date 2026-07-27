import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPedidosIngresosComponent } from './listapedidosingresos.component';

describe('ListaPedidosIngresosComponent', () => {
  let component: ListaPedidosIngresosComponent;
  let fixture: ComponentFixture<ListaPedidosIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaPedidosIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPedidosIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
