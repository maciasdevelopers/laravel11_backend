import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerMejorasAltaComponent } from './dermejoras_alta.component';

describe('CatalogosComponent', () => {
  let component: DerMejorasAltaComponent;
  let fixture: ComponentFixture<DerMejorasAltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DerMejorasAltaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DerMejorasAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
