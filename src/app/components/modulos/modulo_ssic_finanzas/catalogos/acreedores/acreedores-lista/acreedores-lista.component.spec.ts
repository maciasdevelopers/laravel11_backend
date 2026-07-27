import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcreedoresListaComponent } from './acreedores-lista.component';

describe('AcreedoresListaComponent', () => {
  let component: AcreedoresListaComponent;
  let fixture: ComponentFixture<AcreedoresListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcreedoresListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcreedoresListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
