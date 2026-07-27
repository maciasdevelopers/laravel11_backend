import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsnCatalogoComponent } from './imp_sobre_nomi_catalogo.component';

describe('IsnCatalogoComponent', () => {
  let component: IsnCatalogoComponent;
  let fixture: ComponentFixture<IsnCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsnCatalogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsnCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
