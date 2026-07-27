import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicacionRegistro } from './comunicacion-registro';

describe('ComunicacionRegistro', () => {
  let component: ComunicacionRegistro;
  let fixture: ComponentFixture<ComunicacionRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComunicacionRegistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComunicacionRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
