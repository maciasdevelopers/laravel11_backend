import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFactComponent } from './new-fact.component';

describe('NewFactComponent', () => {
  let component: NewFactComponent;
  let fixture: ComponentFixture<NewFactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
