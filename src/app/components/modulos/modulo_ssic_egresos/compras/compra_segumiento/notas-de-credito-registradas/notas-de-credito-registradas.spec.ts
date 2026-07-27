import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasDeCreditoRegistradas } from './notas-de-credito-registradas';

describe('NotasDeCreditoRegistradas', () => {
  let component: NotasDeCreditoRegistradas;
  let fixture: ComponentFixture<NotasDeCreditoRegistradas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotasDeCreditoRegistradas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasDeCreditoRegistradas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
