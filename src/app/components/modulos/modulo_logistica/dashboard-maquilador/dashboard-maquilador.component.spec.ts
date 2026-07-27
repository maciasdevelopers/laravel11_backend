import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMaquiladorComponent } from './dashboard-maquilador.component';

describe('DashboardMaquiladorComponent', () => {
  let component: DashboardMaquiladorComponent;
  let fixture: ComponentFixture<DashboardMaquiladorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardMaquiladorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMaquiladorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
