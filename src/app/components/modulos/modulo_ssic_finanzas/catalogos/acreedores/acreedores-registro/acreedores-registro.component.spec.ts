import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcreedoresRegistroComponent } from './acreedores-registro.component';

describe('AcreedoresRegistroComponent', () => {
  let component: AcreedoresRegistroComponent;
  let fixture: ComponentFixture<AcreedoresRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcreedoresRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcreedoresRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
