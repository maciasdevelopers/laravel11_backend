import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgresosComisionesRegistrarComponent } from './compras_comi_registro.component';

describe('EgresosComisionesRegistrarComponent', () => {
  let component: EgresosComisionesRegistrarComponent;
  let fixture: ComponentFixture<EgresosComisionesRegistrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EgresosComisionesRegistrarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EgresosComisionesRegistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
