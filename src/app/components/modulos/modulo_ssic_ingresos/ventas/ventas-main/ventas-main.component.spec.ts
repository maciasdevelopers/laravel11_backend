import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasMainComponent } from './ventas-main.component';

describe('VentasMainComponent', () => {
  let component: VentasMainComponent;
  let fixture: ComponentFixture<VentasMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VentasMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
