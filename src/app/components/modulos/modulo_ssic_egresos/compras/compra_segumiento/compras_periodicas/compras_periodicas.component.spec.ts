import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraPeriodicaComponent } from './compras_periodicas.component';

describe('CompraPeriodicaComponent', () => {
  let component: CompraPeriodicaComponent;
  let fixture: ComponentFixture<CompraPeriodicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompraPeriodicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraPeriodicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
