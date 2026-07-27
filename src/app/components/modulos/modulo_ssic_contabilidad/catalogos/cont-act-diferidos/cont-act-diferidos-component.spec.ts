import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContActDiferidosComponent } from './cont-act-diferidos-component';

describe('ContActDiferidosComponent', () => {
  let component: ContActDiferidosComponent;
  let fixture: ComponentFixture<ContActDiferidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContActDiferidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContActDiferidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
