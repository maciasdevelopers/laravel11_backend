import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventServVentasListaComponent } from './inventservventas_lista.component';

describe('InventServVentasListaComponent', () => {
  let component: InventServVentasListaComponent;
  let fixture: ComponentFixture<InventServVentasListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventServVentasListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventServVentasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
