import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasContablesListaComponent } from './cuentas_contables_lista.component';

describe('CuentasContablesListaComponent', () => {
  let component: CuentasContablesListaComponent;
  let fixture: ComponentFixture<CuentasContablesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentasContablesListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasContablesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
