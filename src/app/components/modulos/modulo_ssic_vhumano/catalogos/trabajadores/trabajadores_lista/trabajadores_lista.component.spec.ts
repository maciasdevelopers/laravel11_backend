import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VHTrabajadoresListaComponent } from './trabajadores_lista.component';

describe('VHTrabajadoresListaComponent', () => {
  let component: VHTrabajadoresListaComponent;
  let fixture: ComponentFixture<VHTrabajadoresListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VHTrabajadoresListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VHTrabajadoresListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
