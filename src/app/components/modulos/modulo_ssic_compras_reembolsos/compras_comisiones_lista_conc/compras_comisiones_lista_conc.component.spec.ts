import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgresosComisionesListaConcluidasComponent } from './compras_comisiones_lista_conc.component';

describe('EgresosComisionesListaConcluidasComponent', () => {
  let component: EgresosComisionesListaConcluidasComponent;
  let fixture: ComponentFixture<EgresosComisionesListaConcluidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EgresosComisionesListaConcluidasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EgresosComisionesListaConcluidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
