import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleVincActfijoComponent } from './detalle-vinc-actfijo.component';

describe('DetalleVincActfijoComponent', () => {
  let component: DetalleVincActfijoComponent;
  let fixture: ComponentFixture<DetalleVincActfijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleVincActfijoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleVincActfijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
