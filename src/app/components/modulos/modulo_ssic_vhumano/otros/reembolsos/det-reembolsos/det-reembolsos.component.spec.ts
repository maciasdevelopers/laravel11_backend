import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VHumReemDetComponent } from './det-reembolsos.component';

describe('VHumReemDetComponent', () => {
  let component: VHumReemDetComponent;
  let fixture: ComponentFixture<VHumReemDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VHumReemDetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VHumReemDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
