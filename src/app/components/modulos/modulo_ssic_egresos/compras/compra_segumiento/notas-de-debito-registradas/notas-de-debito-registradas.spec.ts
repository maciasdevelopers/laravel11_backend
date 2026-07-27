import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasDeDebitoRegistradas } from './notas-de-debito-registradas';

describe('NotasDeDebitoRegistradas', () => {
  let component: NotasDeDebitoRegistradas;
  let fixture: ComponentFixture<NotasDeDebitoRegistradas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotasDeDebitoRegistradas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasDeDebitoRegistradas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
