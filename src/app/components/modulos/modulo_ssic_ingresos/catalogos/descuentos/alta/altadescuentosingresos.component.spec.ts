import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaDescuentosIngresosComponent } from './altadescuentosingresos.component';

describe('CatalogosComponent', () => {
  let component: AltaDescuentosIngresosComponent;
  let fixture: ComponentFixture<AltaDescuentosIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaDescuentosIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaDescuentosIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
