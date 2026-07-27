import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgresosComisionesListasDeletedComponent } from './compras_comisiones_lista_deleted.component';

describe('EgresosComisionesListasDeletedComponent', () => {
  let component: EgresosComisionesListasDeletedComponent;
  let fixture: ComponentFixture<EgresosComisionesListasDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EgresosComisionesListasDeletedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EgresosComisionesListasDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
