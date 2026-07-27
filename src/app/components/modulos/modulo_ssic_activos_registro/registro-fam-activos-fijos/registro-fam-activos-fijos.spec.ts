import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroFamActivosFijosComponent } from './registro-fam-activos-fijos';

describe('RegistroFamActivosFijosComponent', () => {
  let component: RegistroFamActivosFijosComponent;
  let fixture: ComponentFixture<RegistroFamActivosFijosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroFamActivosFijosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroFamActivosFijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
