import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpGraficaGeneral } from './op-grafica-general';

describe('OpGraficaGeneral', () => {
  let component: OpGraficaGeneral;
  let fixture: ComponentFixture<OpGraficaGeneral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpGraficaGeneral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpGraficaGeneral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
