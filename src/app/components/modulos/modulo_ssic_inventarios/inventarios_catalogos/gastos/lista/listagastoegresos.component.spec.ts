import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaGastoEgresosComponent } from './listagastoegresos.component';

describe('ListaGastoEgresosComponent', () => {
  let component: ListaGastoEgresosComponent;
  let fixture: ComponentFixture<ListaGastoEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaGastoEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaGastoEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
