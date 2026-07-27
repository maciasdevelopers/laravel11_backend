import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttProyectosComponent } from './gantt-proyectos.component';

describe('GanttProyectosComponent', () => {
  let component: GanttProyectosComponent;
  let fixture: ComponentFixture<GanttProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GanttProyectosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GanttProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
