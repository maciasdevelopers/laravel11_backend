import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesIngresosComponent } from './reportes.component';

describe('ReportesIngresosComponent', () => {
  let component: ReportesIngresosComponent;
  let fixture: ComponentFixture<ReportesIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
