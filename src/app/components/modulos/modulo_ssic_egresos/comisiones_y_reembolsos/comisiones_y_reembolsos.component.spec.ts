import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionesYReembolsosComponent } from './comisiones_y_reembolsos.component';

describe('ComisionesYReembolsosComponent', () => {
  let component: ComisionesYReembolsosComponent;
  let fixture: ComponentFixture<ComisionesYReembolsosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComisionesYReembolsosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionesYReembolsosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
