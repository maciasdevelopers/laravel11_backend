import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCompraInstruccionComponent } from './registro_por_instruccion.component';

describe('RegistroCompraInstruccionComponent', () => {
  let component: RegistroCompraInstruccionComponent;
  let fixture: ComponentFixture<RegistroCompraInstruccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroCompraInstruccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCompraInstruccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
