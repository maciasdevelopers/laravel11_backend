import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorDeCfdi } from './visor-de-cfdi';

describe('VisorDeCfdi', () => {
  let component: VisorDeCfdi;
  let fixture: ComponentFixture<VisorDeCfdi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisorDeCfdi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorDeCfdi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
