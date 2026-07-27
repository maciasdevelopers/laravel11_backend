import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabPoliticComiComponent } from './politicas_comisiones.component';

describe('CatalogosComponent', () => {
  let component: ContabPoliticComiComponent;
  let fixture: ComponentFixture<ContabPoliticComiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContabPoliticComiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabPoliticComiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
