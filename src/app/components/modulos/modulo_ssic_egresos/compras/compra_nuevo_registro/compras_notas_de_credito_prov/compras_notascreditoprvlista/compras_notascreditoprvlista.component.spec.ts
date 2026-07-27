import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasCreditoProvListaComponent } from './compras_notascreditoprvlista.component';

describe('NotasCreditoProvListaComponent', () => {
  let component: NotasCreditoProvListaComponent;
  let fixture: ComponentFixture<NotasCreditoProvListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotasCreditoProvListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasCreditoProvListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
