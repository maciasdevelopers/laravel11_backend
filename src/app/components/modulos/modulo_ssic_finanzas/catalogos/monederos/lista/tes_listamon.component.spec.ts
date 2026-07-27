import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMonederoTesoreriaComponent } from './tes_listamon.component';

describe('ListaMonederoTesoreriaComponent', () => {
  let component: ListaMonederoTesoreriaComponent;
  let fixture: ComponentFixture<ListaMonederoTesoreriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaMonederoTesoreriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaMonederoTesoreriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
