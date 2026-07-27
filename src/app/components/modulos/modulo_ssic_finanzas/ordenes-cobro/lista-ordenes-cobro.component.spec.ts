import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaOrdenesCobroComponent } from './lista-ordenes-cobro.component';

describe('ListaOrdenesCobroComponent', () => {
  let component: ListaOrdenesCobroComponent;
  let fixture: ComponentFixture<ListaOrdenesCobroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaOrdenesCobroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaOrdenesCobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
