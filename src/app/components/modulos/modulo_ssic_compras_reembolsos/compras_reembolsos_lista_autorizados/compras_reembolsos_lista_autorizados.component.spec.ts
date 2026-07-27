import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgresosReembolsosAutorizadosComponent } from './compras_reembolsos_lista_autorizados.component';

describe('EgresosReembolsosAutorizadosComponent', () => {
  let component: EgresosReembolsosAutorizadosComponent;
  let fixture: ComponentFixture<EgresosReembolsosAutorizadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EgresosReembolsosAutorizadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EgresosReembolsosAutorizadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
