import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteRegistroComponent } from './complete-registro.component';

describe('CompleteRegistroComponent', () => {
  let component: CompleteRegistroComponent;
  let fixture: ComponentFixture<CompleteRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
