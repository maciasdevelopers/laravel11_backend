import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaMonederoTesoreriaComponent } from './tes_altamon.component';

describe('AltaMonederoTesoreriaComponent', () => {
  let component: AltaMonederoTesoreriaComponent;
  let fixture: ComponentFixture<AltaMonederoTesoreriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaMonederoTesoreriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaMonederoTesoreriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
