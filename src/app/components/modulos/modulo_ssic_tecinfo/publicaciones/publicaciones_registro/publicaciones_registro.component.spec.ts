import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesRegistroComponent } from './publicaciones_registro.component';

describe('PublicacionesRegistroComponent', () => {
  let component: PublicacionesRegistroComponent;
  let fixture: ComponentFixture<PublicacionesRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicacionesRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicacionesRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
