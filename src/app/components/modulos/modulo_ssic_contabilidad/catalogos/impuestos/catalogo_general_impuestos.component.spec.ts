import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoGeneralImpuestosComponent } from './catalogo_general_impuestos.component';

describe('CatalogoGeneralImpuestosComponent', () => {
  let component: CatalogoGeneralImpuestosComponent;
  let fixture: ComponentFixture<CatalogoGeneralImpuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoGeneralImpuestosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoGeneralImpuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
