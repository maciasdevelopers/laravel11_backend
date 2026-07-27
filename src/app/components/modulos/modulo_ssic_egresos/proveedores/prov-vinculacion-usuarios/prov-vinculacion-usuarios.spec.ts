import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvVinculacionUsuarios } from './prov-vinculacion-usuarios';

describe('ProvVinculacionUsuarios', () => {
  let component: ProvVinculacionUsuarios;
  let fixture: ComponentFixture<ProvVinculacionUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProvVinculacionUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvVinculacionUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
