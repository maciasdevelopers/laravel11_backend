import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EEGRComisionesAvisosComponent } from './comisiones-avisos.component';

describe('EEGRComisionesAvisosComponent', () => {
  let component: EEGRComisionesAvisosComponent;
  let fixture: ComponentFixture<EEGRComisionesAvisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EEGRComisionesAvisosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EEGRComisionesAvisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
