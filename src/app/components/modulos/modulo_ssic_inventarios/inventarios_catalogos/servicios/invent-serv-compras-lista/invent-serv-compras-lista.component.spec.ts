import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventServComprasListaComponent } from './invent-serv-compras-lista.component';

describe('InventServComprasListaComponent', () => {
  let component: InventServComprasListaComponent;
  let fixture: ComponentFixture<InventServComprasListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventServComprasListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventServComprasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
