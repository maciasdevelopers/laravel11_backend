import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesgloseRegistroCompraComponent } from './desglose-registro-compra.component';

describe('DesgloseRegistroCompraComponent', () => {
  let component: DesgloseRegistroCompraComponent;
  let fixture: ComponentFixture<DesgloseRegistroCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesgloseRegistroCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesgloseRegistroCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
