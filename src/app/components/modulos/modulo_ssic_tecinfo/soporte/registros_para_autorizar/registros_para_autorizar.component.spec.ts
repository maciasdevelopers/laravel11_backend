import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoporteRegistrosParaAutorizarComponent } from './registros_para_autorizar.component';

describe('SoporteRegistrosParaAutorizarComponent', () => {
  let component: SoporteRegistrosParaAutorizarComponent;
  let fixture: ComponentFixture<SoporteRegistrosParaAutorizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoporteRegistrosParaAutorizarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoporteRegistrosParaAutorizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
