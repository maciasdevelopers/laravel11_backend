import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaComisionesListaComponent } from './comisiones_lista.component';

describe('GerenciaComisionesListaComponent', () => {
  let component: GerenciaComisionesListaComponent;
  let fixture: ComponentFixture<GerenciaComisionesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GerenciaComisionesListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciaComisionesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
