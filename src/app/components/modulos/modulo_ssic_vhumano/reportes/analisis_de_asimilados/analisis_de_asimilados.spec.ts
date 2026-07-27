import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VHReportesAsimiladosAnalisisComponent } from './analisis_de_asimilados';

describe('VHReportesAsimiladosAnalisisComponent', () => {
  let component: VHReportesAsimiladosAnalisisComponent;
  let fixture: ComponentFixture<VHReportesAsimiladosAnalisisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VHReportesAsimiladosAnalisisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VHReportesAsimiladosAnalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
