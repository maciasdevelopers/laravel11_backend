import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventServVentasRegistroComponent } from './invent-serv-ventas-registro.component';

describe('InventServVentasRegistroComponent', () => {
  let component: InventServVentasRegistroComponent;
  let fixture: ComponentFixture<InventServVentasRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventServVentasRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventServVentasRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
