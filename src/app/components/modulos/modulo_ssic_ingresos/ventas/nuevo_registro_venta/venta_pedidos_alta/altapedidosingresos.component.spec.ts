import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaPedidosIngresosComponent } from './altapedidosingresos.component';

describe('AltaPedidosIngresosComponent', () => {
  let component: AltaPedidosIngresosComponent;
  let fixture: ComponentFixture<AltaPedidosIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaPedidosIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaPedidosIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
