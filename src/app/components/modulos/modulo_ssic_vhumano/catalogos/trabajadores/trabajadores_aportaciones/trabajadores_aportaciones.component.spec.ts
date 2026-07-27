import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VHTrabajadoresAportacionesComponent } from './trabajadores_aportaciones.component';

describe('VHTrabajadoresAportacionesComponent', () => {
  let component: VHTrabajadoresAportacionesComponent;
  let fixture: ComponentFixture<VHTrabajadoresAportacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VHTrabajadoresAportacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VHTrabajadoresAportacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
