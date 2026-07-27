import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VHCentrosTrabajoListaComponent } from './lista_centros_de_trabajo.component';

describe('VHCentrosTrabajoListaComponent', () => {
  let component: VHCentrosTrabajoListaComponent;
  let fixture: ComponentFixture<VHCentrosTrabajoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VHCentrosTrabajoListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VHCentrosTrabajoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
