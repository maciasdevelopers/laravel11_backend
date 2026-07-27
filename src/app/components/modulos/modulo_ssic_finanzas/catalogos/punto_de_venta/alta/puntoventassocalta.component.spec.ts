import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntoVentaAltaComponent } from './puntoventassocalta.component';

describe('PuntoVentaAltaComponent', () => {
  let component: PuntoVentaAltaComponent;
  let fixture: ComponentFixture<PuntoVentaAltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuntoVentaAltaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuntoVentaAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
