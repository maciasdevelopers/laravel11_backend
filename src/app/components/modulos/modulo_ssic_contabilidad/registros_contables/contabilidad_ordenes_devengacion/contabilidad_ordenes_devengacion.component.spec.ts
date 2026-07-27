import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabilidadOrdenesDevengacionComponent } from './contabilidad_ordenes_devengacion.component';

describe('ContabilidadOrdenesDevengacionComponent', () => {
  let component: ContabilidadOrdenesDevengacionComponent;
  let fixture: ComponentFixture<ContabilidadOrdenesDevengacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContabilidadOrdenesDevengacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContabilidadOrdenesDevengacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});