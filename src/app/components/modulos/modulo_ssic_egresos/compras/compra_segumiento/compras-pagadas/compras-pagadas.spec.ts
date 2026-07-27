import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasPagadas } from './compras-pagadas';

describe('ComprasPagadas', () => {
  let component: ComprasPagadas;
  let fixture: ComponentFixture<ComprasPagadas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComprasPagadas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasPagadas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
