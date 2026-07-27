import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCuentasTesoreriaComponent } from './tes_listacuentas.component';

describe('ListaCuentasTesoreriaComponent', () => {
  let component: ListaCuentasTesoreriaComponent;
  let fixture: ComponentFixture<ListaCuentasTesoreriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaCuentasTesoreriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCuentasTesoreriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
