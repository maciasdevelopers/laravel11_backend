import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabilidadPoliticasHomeComponent } from './politicas_home.component';

describe('CatalogosComponent', () => {
  let component: ContabilidadPoliticasHomeComponent;
  let fixture: ComponentFixture<ContabilidadPoliticasHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContabilidadPoliticasHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabilidadPoliticasHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
