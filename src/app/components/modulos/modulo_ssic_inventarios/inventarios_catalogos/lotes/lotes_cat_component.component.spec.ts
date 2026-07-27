import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoLoteInventComponent } from './lotes_cat_component.component';

describe('CatalogoLoteInventComponent', () => {
  let component: CatalogoLoteInventComponent;
  let fixture: ComponentFixture<CatalogoLoteInventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoLoteInventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoLoteInventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
