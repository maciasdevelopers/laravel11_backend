import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabPoliticDetalleComponent } from './politicas_detalle.component';

describe('CatalogosComponent', () => {
  let component: ContabPoliticDetalleComponent;
  let fixture: ComponentFixture<ContabPoliticDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContabPoliticDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabPoliticDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
