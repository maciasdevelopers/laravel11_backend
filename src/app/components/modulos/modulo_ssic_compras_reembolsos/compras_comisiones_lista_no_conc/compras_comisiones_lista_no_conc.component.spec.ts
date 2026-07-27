import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgresosComisionesListaNoConcluidasComponent } from './compras_comisiones_lista_no_conc.component';

describe('EgresosComisionesListaNoConcluidasComponent', () => {
  let component: EgresosComisionesListaNoConcluidasComponent;
  let fixture: ComponentFixture<EgresosComisionesListaNoConcluidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EgresosComisionesListaNoConcluidasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EgresosComisionesListaNoConcluidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
