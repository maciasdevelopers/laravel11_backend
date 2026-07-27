import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicacionLista } from './comunicacion-lista';

describe('ComunicacionLista', () => {
  let component: ComunicacionLista;
  let fixture: ComponentFixture<ComunicacionLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComunicacionLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComunicacionLista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
