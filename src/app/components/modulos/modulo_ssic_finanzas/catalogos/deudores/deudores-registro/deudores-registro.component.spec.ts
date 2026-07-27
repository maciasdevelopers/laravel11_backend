import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeudoresRegistroComponent } from './deudores-registro.component';

describe('DeudoresRegistroComponent', () => {
  let component: DeudoresRegistroComponent;
  let fixture: ComponentFixture<DeudoresRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeudoresRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeudoresRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
