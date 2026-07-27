import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventServiciosMainComponent } from './servicios-main.component';

describe('InventServiciosMainComponent', () => {
  let component: InventServiciosMainComponent;
  let fixture: ComponentFixture<InventServiciosMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventServiciosMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventServiciosMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
