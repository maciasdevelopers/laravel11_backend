import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpDetalleFacturaInformative } from './op-detalle-factura-informative';

describe('OpDetalleFacturaInformative', () => {
  let component: OpDetalleFacturaInformative;
  let fixture: ComponentFixture<OpDetalleFacturaInformative>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpDetalleFacturaInformative]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpDetalleFacturaInformative);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
