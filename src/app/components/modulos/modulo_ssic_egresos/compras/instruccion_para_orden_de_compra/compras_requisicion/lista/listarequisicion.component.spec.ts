import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRequisicionComponent } from './listarequisicion.component';

describe('ListaRequisicionComponent', () => {
  let component: ListaRequisicionComponent;
  let fixture: ComponentFixture<ListaRequisicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaRequisicionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaRequisicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
