import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AportacionesListaComponent } from './aportaciones_lista.component';

describe('CatalogosComponent', () => {
  let component: AportacionesListaComponent;
  let fixture: ComponentFixture<AportacionesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AportacionesListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AportacionesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
