import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntoVentaListaComponent } from './puntoventassoclista.component';

describe('PuntoVentaListaComponent', () => {
  let component: PuntoVentaListaComponent;
  let fixture: ComponentFixture<PuntoVentaListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuntoVentaListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuntoVentaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
