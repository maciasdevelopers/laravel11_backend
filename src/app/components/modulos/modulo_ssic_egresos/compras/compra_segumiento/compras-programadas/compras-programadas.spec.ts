import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasProgramadas } from './compras-programadas';

describe('ComprasProgramadas', () => {
  let component: ComprasProgramadas;
  let fixture: ComponentFixture<ComprasProgramadas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComprasProgramadas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasProgramadas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
