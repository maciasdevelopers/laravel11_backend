import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TECIAltaDeviceComponent } from './teci_altadevices.component';

describe('TECIAltaDeviceComponent', () => {
  let component: TECIAltaDeviceComponent;
  let fixture: ComponentFixture<TECIAltaDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TECIAltaDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TECIAltaDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
