import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariosOrdenesRecepcionComponent } from './inventarios_ordenes_recepcion.component';

describe('InventariosOrdenesRecepcionComponent', () => {
  let component: InventariosOrdenesRecepcionComponent;
  let fixture: ComponentFixture<InventariosOrdenesRecepcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventariosOrdenesRecepcionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventariosOrdenesRecepcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
