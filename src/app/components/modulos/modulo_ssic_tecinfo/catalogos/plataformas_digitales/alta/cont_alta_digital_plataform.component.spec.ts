import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContAltaDigitalPlataformComponent } from './cont_alta_digital_plataform.component';

describe('ContAltaDigitalPlataformComponent', () => {
  let component: ContAltaDigitalPlataformComponent;
  let fixture: ComponentFixture<ContAltaDigitalPlataformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContAltaDigitalPlataformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContAltaDigitalPlataformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
