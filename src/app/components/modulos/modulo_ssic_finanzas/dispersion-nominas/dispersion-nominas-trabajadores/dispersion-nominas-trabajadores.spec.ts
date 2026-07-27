import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispersionNominasTrabajadores } from './dispersion-nominas-trabajadores';

describe('DispersionNominasTrabajadores', () => {
  let component: DispersionNominasTrabajadores;
  let fixture: ComponentFixture<DispersionNominasTrabajadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DispersionNominasTrabajadores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispersionNominasTrabajadores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
