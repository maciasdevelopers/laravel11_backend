import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgresosReembolsosGeneralComponent } from './compras_reembolsos_lista_general.component';

describe('EgresosReembolsosGeneralComponent', () => {
  let component: EgresosReembolsosGeneralComponent;
  let fixture: ComponentFixture<EgresosReembolsosGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EgresosReembolsosGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EgresosReembolsosGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
