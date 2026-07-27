import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoliCancelacionReembolsos } from './soli-cancelacion-reembolsos';

describe('SoliCancelacionReembolsos', () => {
  let component: SoliCancelacionReembolsos;
  let fixture: ComponentFixture<SoliCancelacionReembolsos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoliCancelacionReembolsos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoliCancelacionReembolsos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
