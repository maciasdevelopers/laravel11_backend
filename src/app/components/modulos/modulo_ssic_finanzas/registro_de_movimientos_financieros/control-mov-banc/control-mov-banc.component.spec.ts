import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlMovBancComponent } from './control-mov-banc.component';

describe('ControlMovBancComponent', () => {
  let component: ControlMovBancComponent;
  let fixture: ComponentFixture<ControlMovBancComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlMovBancComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlMovBancComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
