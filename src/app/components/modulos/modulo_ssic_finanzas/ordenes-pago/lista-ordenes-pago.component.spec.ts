import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaOrdenesPagoComponent } from './lista-ordenes-pago.component';

describe('ListaOrdenesPagoComponent', () => {
  let component: ListaOrdenesPagoComponent;
  let fixture: ComponentFixture<ListaOrdenesPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaOrdenesPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaOrdenesPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
