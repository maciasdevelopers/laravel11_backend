import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaProvEgresosComponent } from './listaprovegresos.component';

describe('ListaProvEgresosComponent', () => {
  let component: ListaProvEgresosComponent;
  let fixture: ComponentFixture<ListaProvEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaProvEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaProvEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
