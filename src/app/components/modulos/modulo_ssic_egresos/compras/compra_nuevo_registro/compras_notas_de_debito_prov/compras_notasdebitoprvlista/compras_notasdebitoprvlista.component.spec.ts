import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasDebitoProvListaComponent } from './compras_notasdebitoprvlista.component';

describe('NotasDebitoProvListaComponent', () => {
  let component: NotasDebitoProvListaComponent;
  let fixture: ComponentFixture<NotasDebitoProvListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotasDebitoProvListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotasDebitoProvListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
