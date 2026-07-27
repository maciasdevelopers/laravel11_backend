import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HerramientasAyudaComponent } from './herramientas_ayuda.component';

describe('HerramientasAyudaComponent', () => {
  let component: HerramientasAyudaComponent;
  let fixture: ComponentFixture<HerramientasAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HerramientasAyudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HerramientasAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
