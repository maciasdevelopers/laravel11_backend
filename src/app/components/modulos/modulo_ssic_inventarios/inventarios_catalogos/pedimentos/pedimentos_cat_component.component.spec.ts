import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPedimentoEgresosComponent } from './pedimentos_cat_component.component';

describe('ListaPedimentoEgresosComponent', () => {
  let component: ListaPedimentoEgresosComponent;
  let fixture: ComponentFixture<ListaPedimentoEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaPedimentoEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPedimentoEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
