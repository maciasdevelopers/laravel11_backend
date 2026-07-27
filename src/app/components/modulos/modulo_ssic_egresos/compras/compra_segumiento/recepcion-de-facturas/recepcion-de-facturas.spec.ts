import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionDeFacturas } from './recepcion-de-facturas';

describe('RecepcionDeFacturas', () => {
  let component: RecepcionDeFacturas;
  let fixture: ComponentFixture<RecepcionDeFacturas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecepcionDeFacturas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecepcionDeFacturas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
