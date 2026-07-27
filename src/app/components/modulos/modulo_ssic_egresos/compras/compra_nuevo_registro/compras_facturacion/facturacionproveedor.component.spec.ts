import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionproveedorComponent } from './facturacionproveedor.component';

describe('FacturacionproveedorComponent', () => {
  let component: FacturacionproveedorComponent;
  let fixture: ComponentFixture<FacturacionproveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacturacionproveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturacionproveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
