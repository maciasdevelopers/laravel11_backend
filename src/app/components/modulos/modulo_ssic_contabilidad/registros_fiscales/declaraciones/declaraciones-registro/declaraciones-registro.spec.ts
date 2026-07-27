import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclaracionesRegistroComponent } from './declaraciones-registro';

describe('DeclaracionesRegistroComponent', () => {
  let component: DeclaracionesRegistroComponent;
  let fixture: ComponentFixture<DeclaracionesRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeclaracionesRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclaracionesRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
