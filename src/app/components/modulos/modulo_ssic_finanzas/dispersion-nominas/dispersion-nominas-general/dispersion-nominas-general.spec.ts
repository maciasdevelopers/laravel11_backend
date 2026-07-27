import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispersionNominasGeneral } from './dispersion-nominas-general';

describe('DispersionNominasGeneral', () => {
  let component: DispersionNominasGeneral;
  let fixture: ComponentFixture<DispersionNominasGeneral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DispersionNominasGeneral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispersionNominasGeneral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
