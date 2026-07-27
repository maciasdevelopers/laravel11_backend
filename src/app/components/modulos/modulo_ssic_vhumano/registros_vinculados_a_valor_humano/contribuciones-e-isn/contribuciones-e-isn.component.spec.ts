import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContribucionesEIsnComponent } from './contribuciones-e-isn.component';

describe('ContribucionesEIsnComponent', () => {
  let component: ContribucionesEIsnComponent;
  let fixture: ComponentFixture<ContribucionesEIsnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContribucionesEIsnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContribucionesEIsnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
