import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaRequisicionComponent } from './altarequisicion.component';

describe('AltaRequisicionComponent', () => {
  let component: AltaRequisicionComponent;
  let fixture: ComponentFixture<AltaRequisicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaRequisicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaRequisicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
