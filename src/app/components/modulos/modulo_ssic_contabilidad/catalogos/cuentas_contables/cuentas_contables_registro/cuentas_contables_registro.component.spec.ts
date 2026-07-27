import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasContablesRegistroComponent } from './cuentas_contables_registro.component';

describe('CuentasContablesRegistroComponent', () => {
  let component: CuentasContablesRegistroComponent;
  let fixture: ComponentFixture<CuentasContablesRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentasContablesRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasContablesRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
