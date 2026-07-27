import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticaRegistraLlegadaFechaComponent } from './logistica-registra-llegada-fecha-component';

describe('LogisticaRegistraLlegadaFechaComponent', () => {
  let component: LogisticaRegistraLlegadaFechaComponent;
  let fixture: ComponentFixture<LogisticaRegistraLlegadaFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogisticaRegistraLlegadaFechaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogisticaRegistraLlegadaFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
