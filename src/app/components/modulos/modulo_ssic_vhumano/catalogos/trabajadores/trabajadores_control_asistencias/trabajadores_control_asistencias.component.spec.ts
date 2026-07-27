import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VHTrabajadoresControlAsistenciasComponent } from './trabajadores_control_asistencias.component';

describe('VHTrabajadoresControlAsistenciasComponent', () => {
  let component: VHTrabajadoresControlAsistenciasComponent;
  let fixture: ComponentFixture<VHTrabajadoresControlAsistenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VHTrabajadoresControlAsistenciasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VHTrabajadoresControlAsistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
