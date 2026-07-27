import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoOrdenGeneralComponent } from './pago-orden-general-component';

describe('PagoOrdenGeneralComponent', () => {
  let component: PagoOrdenGeneralComponent;
  let fixture: ComponentFixture<PagoOrdenGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagoOrdenGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoOrdenGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
