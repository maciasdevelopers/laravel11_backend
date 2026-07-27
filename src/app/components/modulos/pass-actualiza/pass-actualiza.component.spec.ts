import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassActualizaComponent } from './pass-actualiza.component';

describe('PassActualizaComponent', () => {
  let component: PassActualizaComponent;
  let fixture: ComponentFixture<PassActualizaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassActualizaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassActualizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
