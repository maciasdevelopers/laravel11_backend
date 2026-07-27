import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasAutorizadas } from './compras-autorizadas';

describe('ComprasAutorizadas', () => {
  let component: ComprasAutorizadas;
  let fixture: ComponentFixture<ComprasAutorizadas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComprasAutorizadas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasAutorizadas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
