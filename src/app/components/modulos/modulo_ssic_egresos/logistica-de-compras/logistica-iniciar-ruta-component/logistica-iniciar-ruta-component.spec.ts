import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticaIniciarRutaComponent } from './logistica-iniciar-ruta-component';

describe('LogisticaIniciarRutaComponent', () => {
  let component: LogisticaIniciarRutaComponent;
  let fixture: ComponentFixture<LogisticaIniciarRutaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogisticaIniciarRutaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogisticaIniciarRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
