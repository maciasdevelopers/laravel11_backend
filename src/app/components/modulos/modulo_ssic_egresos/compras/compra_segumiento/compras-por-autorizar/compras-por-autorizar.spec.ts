import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasPorAutorizar } from './compras-por-autorizar';

describe('ComprasPorAutorizar', () => {
  let component: ComprasPorAutorizar;
  let fixture: ComponentFixture<ComprasPorAutorizar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComprasPorAutorizar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasPorAutorizar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
