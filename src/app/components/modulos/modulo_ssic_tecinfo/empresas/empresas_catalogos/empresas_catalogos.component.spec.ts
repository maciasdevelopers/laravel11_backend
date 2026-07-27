import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeciEmpresasCatalogosComponent } from './empresas_catalogos.component';

describe('TeciEmpresasCatalogosComponent', () => {
  let component: TeciEmpresasCatalogosComponent;
  let fixture: ComponentFixture<TeciEmpresasCatalogosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeciEmpresasCatalogosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeciEmpresasCatalogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
