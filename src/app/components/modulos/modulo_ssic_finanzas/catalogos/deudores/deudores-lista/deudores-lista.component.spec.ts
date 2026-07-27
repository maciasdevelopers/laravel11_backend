import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeudoresListaComponent } from './deudores-lista.component';

describe('DeudoresListaComponent', () => {
  let component: DeudoresListaComponent;
  let fixture: ComponentFixture<DeudoresListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeudoresListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeudoresListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
