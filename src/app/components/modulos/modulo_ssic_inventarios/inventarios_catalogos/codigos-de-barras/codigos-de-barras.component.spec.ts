import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigosDeBarrasComponent } from './codigos-de-barras.component';

describe('CodigosDeBarrasComponent', () => {
  let component: CodigosDeBarrasComponent;
  let fixture: ComponentFixture<CodigosDeBarrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CodigosDeBarrasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodigosDeBarrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
