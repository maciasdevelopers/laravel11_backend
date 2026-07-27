import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDevicesTesoreriaComponent } from './tes_listadevices.component';

describe('ListaDevicesTesoreriaComponent', () => {
  let component: ListaDevicesTesoreriaComponent;
  let fixture: ComponentFixture<ListaDevicesTesoreriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaDevicesTesoreriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaDevicesTesoreriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
