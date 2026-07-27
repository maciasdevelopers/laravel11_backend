import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaActivoFijoEgresosComponent } from './lista_activos_fijos.component';

describe('ListaActivoFijoEgresosComponent', () => {
  let component: ListaActivoFijoEgresosComponent;
  let fixture: ComponentFixture<ListaActivoFijoEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaActivoFijoEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaActivoFijoEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
