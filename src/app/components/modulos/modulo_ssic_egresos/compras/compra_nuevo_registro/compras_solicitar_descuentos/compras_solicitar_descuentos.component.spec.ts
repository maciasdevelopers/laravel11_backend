import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasSolicitarDescuentosComponent } from './compras_solicitar_descuentos.component';

describe('ComprasSolicitarDescuentosComponent', () => {
  let component: ComprasSolicitarDescuentosComponent;
  let fixture: ComponentFixture<ComprasSolicitarDescuentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComprasSolicitarDescuentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasSolicitarDescuentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
