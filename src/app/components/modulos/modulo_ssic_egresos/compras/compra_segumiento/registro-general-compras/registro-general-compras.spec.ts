import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroGeneralCompras } from './registro-general-compras';

describe('RegistroGeneralCompras', () => {
  let component: RegistroGeneralCompras;
  let fixture: ComponentFixture<RegistroGeneralCompras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroGeneralCompras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroGeneralCompras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
