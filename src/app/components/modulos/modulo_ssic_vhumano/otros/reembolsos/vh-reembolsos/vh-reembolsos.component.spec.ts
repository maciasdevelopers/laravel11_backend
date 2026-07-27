import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VHumReembolsosComponent } from './vh-reembolsos.component';

describe('VHumReembolsosComponent', () => {
  let component: VHumReembolsosComponent;
  let fixture: ComponentFixture<VHumReembolsosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VHumReembolsosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VHumReembolsosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
