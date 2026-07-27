import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaCajasTesoreriaComponent } from './tes_altacajas.component';

describe('AltaCajasTesoreriaComponent', () => {
  let component: AltaCajasTesoreriaComponent;
  let fixture: ComponentFixture<AltaCajasTesoreriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaCajasTesoreriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaCajasTesoreriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
