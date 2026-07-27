import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasDebitoProvAltaComponent } from './compras_notasdebitoprvalta.component';

describe('NotasDebitoProvAltaComponent', () => {
  let component: NotasDebitoProvAltaComponent;
  let fixture: ComponentFixture<NotasDebitoProvAltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotasDebitoProvAltaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasDebitoProvAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
