import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaDevicesTesoreriaComponent } from './tes_altadevices.component';

describe('AltaDevicesTesoreriaComponent', () => {
  let component: AltaDevicesTesoreriaComponent;
  let fixture: ComponentFixture<AltaDevicesTesoreriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaDevicesTesoreriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaDevicesTesoreriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
