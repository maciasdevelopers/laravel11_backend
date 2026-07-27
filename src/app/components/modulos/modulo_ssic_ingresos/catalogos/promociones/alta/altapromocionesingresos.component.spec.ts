import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaPromocionesIngresosComponent } from './altapromocionesingresos.component';

describe('CatalogosComponent', () => {
  let component: AltaPromocionesIngresosComponent;
  let fixture: ComponentFixture<AltaPromocionesIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaPromocionesIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaPromocionesIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
