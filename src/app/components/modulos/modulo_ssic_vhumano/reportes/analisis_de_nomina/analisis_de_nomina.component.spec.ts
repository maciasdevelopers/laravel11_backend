import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VHReportesNominaAnalisisComponent } from './analisis_de_nomina.component';

describe('VHReportesNominaAnalisisComponent', () => {
  let component: VHReportesNominaAnalisisComponent;
  let fixture: ComponentFixture<VHReportesNominaAnalisisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VHReportesNominaAnalisisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VHReportesNominaAnalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
