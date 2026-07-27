import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventServComprasAltaComponent } from './invent-serv-compras-alta.component';

describe('InventServComprasAltaComponent', () => {
  let component: InventServComprasAltaComponent;
  let fixture: ComponentFixture<InventServComprasAltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventServComprasAltaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventServComprasAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
