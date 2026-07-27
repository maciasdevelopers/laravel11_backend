import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaCfdisTraslado } from './carga-cfdis-traslado';

describe('CargaCfdisTraslado', () => {
  let component: CargaCfdisTraslado;
  let fixture: ComponentFixture<CargaCfdisTraslado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CargaCfdisTraslado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargaCfdisTraslado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
