import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VHCentrosTrabajoAltaComponent } from './alta_centros_de_trabajo.component';

describe('VHCentrosTrabajoAltaComponent', () => {
  let component: VHCentrosTrabajoAltaComponent;
  let fixture: ComponentFixture<VHCentrosTrabajoAltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VHCentrosTrabajoAltaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VHCentrosTrabajoAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
