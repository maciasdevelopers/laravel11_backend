import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaizComponent } from './index_component.component';

describe('RaizComponent', () => {
  let component: RaizComponent;
  let fixture: ComponentFixture<RaizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
