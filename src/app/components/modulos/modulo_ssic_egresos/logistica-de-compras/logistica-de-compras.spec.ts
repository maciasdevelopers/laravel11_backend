import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgresosLogisticaDeCompras } from './logistica-de-compras';

describe('EgresosLogisticaDeCompras', () => {
  let component: EgresosLogisticaDeCompras;
  let fixture: ComponentFixture<EgresosLogisticaDeCompras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EgresosLogisticaDeCompras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EgresosLogisticaDeCompras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
