import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaGastoEgresosComponent } from './altagastoegresos.component';

describe('AltaGastoEgresosComponent', () => {
  let component: AltaGastoEgresosComponent;
  let fixture: ComponentFixture<AltaGastoEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaGastoEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaGastoEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
