import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VHTrabajadoresRegistroComponent } from './trabajadores_registro.component';

describe('VHTrabajadoresRegistroComponent', () => {
  let component: VHTrabajadoresRegistroComponent;
  let fixture: ComponentFixture<VHTrabajadoresRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VHTrabajadoresRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VHTrabajadoresRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
