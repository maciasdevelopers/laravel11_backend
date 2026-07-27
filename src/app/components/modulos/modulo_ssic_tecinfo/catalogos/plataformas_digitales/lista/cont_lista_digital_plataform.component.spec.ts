import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContListaDigitalPlataformComponent } from './cont_lista_digital_plataform.component';

describe('ContListaDigitalPlataformComponent', () => {
  let component: ContListaDigitalPlataformComponent;
  let fixture: ComponentFixture<ContListaDigitalPlataformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContListaDigitalPlataformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContListaDigitalPlataformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
