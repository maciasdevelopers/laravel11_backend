import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsnRegistroComponent } from './imp_sobre_nomi_registro.component';

describe('IsnRegistroComponent', () => {
  let component: IsnRegistroComponent;
  let fixture: ComponentFixture<IsnRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsnRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsnRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
