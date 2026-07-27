import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoliCancelacionNominaEspecie } from './soli-cancelacion-nomina-especie';

describe('SoliCancelacionNominaEspecie', () => {
  let component: SoliCancelacionNominaEspecie;
  let fixture: ComponentFixture<SoliCancelacionNominaEspecie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoliCancelacionNominaEspecie]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoliCancelacionNominaEspecie);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
