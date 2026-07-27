import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasCreditoProvAltaComponent } from './compras_notascreditoprvalta.component';

describe('NotasCreditoProvAltaComponent', () => {
  let component: NotasCreditoProvAltaComponent;
  let fixture: ComponentFixture<NotasCreditoProvAltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotasCreditoProvAltaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasCreditoProvAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
