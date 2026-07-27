import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoliCancelacionAnticipos } from './soli-cancelacion-anticipos';

describe('SoliCancelacionAnticipos', () => {
  let component: SoliCancelacionAnticipos;
  let fixture: ComponentFixture<SoliCancelacionAnticipos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoliCancelacionAnticipos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoliCancelacionAnticipos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
