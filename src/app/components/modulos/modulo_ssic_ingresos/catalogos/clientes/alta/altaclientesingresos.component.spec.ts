import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaClientesIngresosComponent } from './altaclientesingresos.component';

describe('CatalogosComponent', () => {
  let component: AltaClientesIngresosComponent;
  let fixture: ComponentFixture<AltaClientesIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaClientesIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaClientesIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
