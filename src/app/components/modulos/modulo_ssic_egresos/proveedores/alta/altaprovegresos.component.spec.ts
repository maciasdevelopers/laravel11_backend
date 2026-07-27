import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaProvEgresosComponent } from './altaprovegresos.component';

describe('AltaProvEgresosComponent', () => {
  let component: AltaProvEgresosComponent;
  let fixture: ComponentFixture<AltaProvEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaProvEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaProvEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
