import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCajasTesoreriaComponent } from './tes_listacajas.component';

describe('ListaCajasTesoreriaComponent', () => {
  let component: ListaCajasTesoreriaComponent;
  let fixture: ComponentFixture<ListaCajasTesoreriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaCajasTesoreriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCajasTesoreriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
