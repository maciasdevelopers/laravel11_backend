import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuestrasSolucionesComponent } from './nuestras_soluciones.component';

describe('NuestrasSolucionesComponent', () => {
  let component: NuestrasSolucionesComponent;
  let fixture: ComponentFixture<NuestrasSolucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuestrasSolucionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuestrasSolucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
