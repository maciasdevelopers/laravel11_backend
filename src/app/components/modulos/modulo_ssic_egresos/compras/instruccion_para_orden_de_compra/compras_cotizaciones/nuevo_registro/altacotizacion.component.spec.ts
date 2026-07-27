import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaCotizacionComponent } from './altacotizacion.component';

describe('AltaCotizacionComponent', () => {
  let component: AltaCotizacionComponent;
  let fixture: ComponentFixture<AltaCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaCotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
