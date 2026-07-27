import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleIntangActComponent } from './detalle-intang-act.component';

describe('DetalleIntangActComponent', () => {
  let component: DetalleIntangActComponent;
  let fixture: ComponentFixture<DetalleIntangActComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleIntangActComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleIntangActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
