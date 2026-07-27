import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoliCancelacionMovCpropias } from './soli-cancelacion-mov-cpropias';

describe('SoliCancelacionMovCpropias', () => {
  let component: SoliCancelacionMovCpropias;
  let fixture: ComponentFixture<SoliCancelacionMovCpropias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoliCancelacionMovCpropias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoliCancelacionMovCpropias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
