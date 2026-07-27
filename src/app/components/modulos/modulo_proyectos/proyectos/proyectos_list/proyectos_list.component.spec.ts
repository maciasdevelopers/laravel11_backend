import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoProyectosComponent } from './proyectos_list.component';

describe('CatalogoProyectosComponent', () => {
  let component: CatalogoProyectosComponent;
  let fixture: ComponentFixture<CatalogoProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoProyectosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
