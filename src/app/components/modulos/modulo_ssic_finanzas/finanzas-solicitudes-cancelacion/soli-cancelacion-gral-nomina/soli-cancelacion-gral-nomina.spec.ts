import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoliCancelacionGralNomina } from './soli-cancelacion-gral-nomina';

describe('SoliCancelacionGralNomina', () => {
  let component: SoliCancelacionGralNomina;
  let fixture: ComponentFixture<SoliCancelacionGralNomina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoliCancelacionGralNomina]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoliCancelacionGralNomina);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
