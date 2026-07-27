import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionProvEgresosComponent } from './validacionprovegresos.component';

describe('ValidacionProvEgresosComponent', () => {
  let component: ValidacionProvEgresosComponent;
  let fixture: ComponentFixture<ValidacionProvEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidacionProvEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidacionProvEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
