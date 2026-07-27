import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabPoliticReemComponent } from './politicas_reembolsos.component';

describe('CatalogosComponent', () => {
  let component: ContabPoliticReemComponent;
  let fixture: ComponentFixture<ContabPoliticReemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContabPoliticReemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabPoliticReemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
