import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstruccionCompraComponent } from './instruccion-compra.component';

describe('InstruccionCompraComponent', () => {
  let component: InstruccionCompraComponent;
  let fixture: ComponentFixture<InstruccionCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstruccionCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstruccionCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
