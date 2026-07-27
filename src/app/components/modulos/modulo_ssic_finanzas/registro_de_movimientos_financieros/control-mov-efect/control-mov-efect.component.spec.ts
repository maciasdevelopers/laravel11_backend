import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlMovEfectComponent } from './control-mov-efect.component';

describe('ControlMovEfectComponent', () => {
  let component: ControlMovEfectComponent;
  let fixture: ComponentFixture<ControlMovEfectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlMovEfectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlMovEfectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
