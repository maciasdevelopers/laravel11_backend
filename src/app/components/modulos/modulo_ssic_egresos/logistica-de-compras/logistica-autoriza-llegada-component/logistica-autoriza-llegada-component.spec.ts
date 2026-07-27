import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticaAutorizaLlegadaComponent } from './logistica-autoriza-llegada-component';

describe('LogisticaAutorizaLlegadaComponent', () => {
  let component: LogisticaAutorizaLlegadaComponent;
  let fixture: ComponentFixture<LogisticaAutorizaLlegadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogisticaAutorizaLlegadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogisticaAutorizaLlegadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
