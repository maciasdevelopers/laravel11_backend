import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaComisionesReaperturaComponent } from './comisiones_reapertura.component';

describe('GerenciaComisionesReaperturaComponent', () => {
  let component: GerenciaComisionesReaperturaComponent;
  let fixture: ComponentFixture<GerenciaComisionesReaperturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GerenciaComisionesReaperturaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciaComisionesReaperturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
