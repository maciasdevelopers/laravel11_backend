import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaCuentasTesoreriaComponent } from './tes_altacuentas.component';

describe('AltaCuentasTesoreriaComponent', () => {
  let component: AltaCuentasTesoreriaComponent;
  let fixture: ComponentFixture<AltaCuentasTesoreriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaCuentasTesoreriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaCuentasTesoreriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
