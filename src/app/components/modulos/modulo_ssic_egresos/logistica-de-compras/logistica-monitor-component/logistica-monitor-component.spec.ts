import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticaMonitorComponent } from './logistica-monitor-component';

describe('LogisticaMonitorComponent', () => {
  let component: LogisticaMonitorComponent;
  let fixture: ComponentFixture<LogisticaMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogisticaMonitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogisticaMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
