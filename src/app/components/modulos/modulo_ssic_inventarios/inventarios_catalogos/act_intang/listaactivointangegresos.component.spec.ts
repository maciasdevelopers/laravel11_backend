import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaActivoDiferidoInventariosComponent } from './listaactivointangegresos.component';

describe('ListaActivoDiferidoInventariosComponent', () => {
  let component: ListaActivoDiferidoInventariosComponent;
  let fixture: ComponentFixture<ListaActivoDiferidoInventariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaActivoDiferidoInventariosComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaActivoDiferidoInventariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
