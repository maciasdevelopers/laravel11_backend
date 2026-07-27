import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TECIListaDeviceComponent } from './teci_listadevices.component';

describe('TECIListaDeviceComponent', () => {
  let component: TECIListaDeviceComponent;
  let fixture: ComponentFixture<TECIListaDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TECIListaDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TECIListaDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
