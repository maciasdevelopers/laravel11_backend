import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroFamActivosDiferidosComponent } from './registro-fam-activos-diferidos.component';

describe('RegistroFamActivosDiferidosComponent', () => {
  let component: RegistroFamActivosDiferidosComponent;
  let fixture: ComponentFixture<RegistroFamActivosDiferidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroFamActivosDiferidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroFamActivosDiferidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
