import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBancariaComponent } from './info-bancaria.component';

describe('InfoBancariaComponent', () => {
  let component: InfoBancariaComponent;
  let fixture: ComponentFixture<InfoBancariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoBancariaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBancariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
