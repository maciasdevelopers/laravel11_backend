import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrosParaAutorizarComponent } from './registros_para_autorizar.component';

describe('RegistrosParaAutorizarComponent', () => {
  let component: RegistrosParaAutorizarComponent;
  let fixture: ComponentFixture<RegistrosParaAutorizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrosParaAutorizarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrosParaAutorizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
