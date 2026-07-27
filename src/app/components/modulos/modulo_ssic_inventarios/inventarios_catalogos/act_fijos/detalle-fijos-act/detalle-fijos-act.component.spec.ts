import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFijosActComponent } from './detalle-fijos-act.component';

describe('DetalleFijosActComponent', () => {
  let component: DetalleFijosActComponent;
  let fixture: ComponentFixture<DetalleFijosActComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleFijosActComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleFijosActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
