import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasListaProrrateanComponent } from './compras_lista_prorratean.component';

describe('ComprasListaProrrateanComponent', () => {
  let component: ComprasListaProrrateanComponent;
  let fixture: ComponentFixture<ComprasListaProrrateanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComprasListaProrrateanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasListaProrrateanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
