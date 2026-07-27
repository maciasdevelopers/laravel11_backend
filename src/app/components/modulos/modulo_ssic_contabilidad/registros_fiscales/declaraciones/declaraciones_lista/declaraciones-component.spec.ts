import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclaracionesListaComponent } from './declaraciones-component';

describe('DeclaracionesListaComponent', () => {
  let component: DeclaracionesListaComponent;
  let fixture: ComponentFixture<DeclaracionesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeclaracionesListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclaracionesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
