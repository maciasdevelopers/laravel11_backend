import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaComisionesMonitoreoComponent } from './comisiones_monitoreo.component';

describe('GerenciaComisionesMonitoreoComponent', () => {
  let component: GerenciaComisionesMonitoreoComponent;
  let fixture: ComponentFixture<GerenciaComisionesMonitoreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GerenciaComisionesMonitoreoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciaComisionesMonitoreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
