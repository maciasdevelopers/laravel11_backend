import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesListaComponent } from './publicaciones_lista.component';

describe('PublicacionesListaComponent', () => {
  let component: PublicacionesListaComponent;
  let fixture: ComponentFixture<PublicacionesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicacionesListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicacionesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
