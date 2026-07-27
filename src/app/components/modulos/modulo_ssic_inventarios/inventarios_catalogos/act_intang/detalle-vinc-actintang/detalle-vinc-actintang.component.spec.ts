import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleVincActintangComponent } from './detalle-vinc-actintang.component';

describe('DetalleVincActintangComponent', () => {
  let component: DetalleVincActintangComponent;
  let fixture: ComponentFixture<DetalleVincActintangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleVincActintangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleVincActintangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
