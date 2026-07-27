import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCotizacionComponent } from './listacotizacion.component';

describe('ListaCotizacionComponent', () => {
  let component: ListaCotizacionComponent;
  let fixture: ComponentFixture<ListaCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaCotizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
