import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CruceXmlinternosVsXmlsat } from './cruce-xmlinternos-vs-xmlsat';

describe('CruceXmlinternosVsXmlsat', () => {
  let component: CruceXmlinternosVsXmlsat;
  let fixture: ComponentFixture<CruceXmlinternosVsXmlsat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CruceXmlinternosVsXmlsat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CruceXmlinternosVsXmlsat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
