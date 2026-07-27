import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgresosAltaProvReembolsosComponent } from './egresos_alta_prov_reembolsos.component';

describe('EgresosAltaProvReembolsosComponent', () => {
  let component: EgresosAltaProvReembolsosComponent;
  let fixture: ComponentFixture<EgresosAltaProvReembolsosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EgresosAltaProvReembolsosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EgresosAltaProvReembolsosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
