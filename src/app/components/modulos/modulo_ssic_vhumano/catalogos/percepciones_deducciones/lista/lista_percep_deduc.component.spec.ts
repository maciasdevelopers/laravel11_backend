import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VhumanoPercepDeduccionesListaComponent } from './lista_percep_deduc.component';

describe('VhumanoPercepDeduccionesListaComponent', () => {
  let component: VhumanoPercepDeduccionesListaComponent;
  let fixture: ComponentFixture<VhumanoPercepDeduccionesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VhumanoPercepDeduccionesListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VhumanoPercepDeduccionesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
