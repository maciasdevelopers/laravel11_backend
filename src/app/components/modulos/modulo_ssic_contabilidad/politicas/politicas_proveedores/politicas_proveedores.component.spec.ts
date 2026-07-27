import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabPoliticProvComponent } from './politicas_proveedores.component';

describe('CatalogosComponent', () => {
  let component: ContabPoliticProvComponent;
  let fixture: ComponentFixture<ContabPoliticProvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContabPoliticProvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabPoliticProvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
