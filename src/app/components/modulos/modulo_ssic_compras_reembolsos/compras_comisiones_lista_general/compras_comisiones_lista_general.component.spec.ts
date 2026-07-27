import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgresosComisionesListaGeneralComponent } from './compras_comisiones_lista_general.component';

describe('EgresosComisionesListaGeneralComponent', () => {
  let component: EgresosComisionesListaGeneralComponent;
  let fixture: ComponentFixture<EgresosComisionesListaGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EgresosComisionesListaGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EgresosComisionesListaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
