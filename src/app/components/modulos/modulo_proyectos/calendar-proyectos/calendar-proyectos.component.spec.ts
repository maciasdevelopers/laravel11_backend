import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarProyectosComponent } from './calendar-proyectos.component';

describe('CalendarProyectosComponent', () => {
  let component: CalendarProyectosComponent;
  let fixture: ComponentFixture<CalendarProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarProyectosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
