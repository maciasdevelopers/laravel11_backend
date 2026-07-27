import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContActFijosComponent } from './cont-act-fijos-component';

describe('ContActFijosComponent', () => {
  let component: ContActFijosComponent;
  let fixture: ComponentFixture<ContActFijosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContActFijosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContActFijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
