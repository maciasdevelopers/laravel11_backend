import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablecimientosInventariosComponent } from './listaestablecimiento.component';

describe('EstablecimientosInventariosComponent', () => {
  let component: EstablecimientosInventariosComponent;
  let fixture: ComponentFixture<EstablecimientosInventariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstablecimientosInventariosComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablecimientosInventariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
