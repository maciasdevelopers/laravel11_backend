import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VhumanoPercepcionesYDeduccionesComponent } from './alta_percep_deduc.component';

describe('VhumanoPercepcionesYDeduccionesComponent', () => {
  let component: VhumanoPercepcionesYDeduccionesComponent;
  let fixture: ComponentFixture<VhumanoPercepcionesYDeduccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VhumanoPercepcionesYDeduccionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VhumanoPercepcionesYDeduccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
