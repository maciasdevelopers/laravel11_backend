import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AportacionesAltaComponent } from './aportaciones_alta.component';

describe('CatalogosComponent', () => {
  let component: AportacionesAltaComponent;
  let fixture: ComponentFixture<AportacionesAltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AportacionesAltaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AportacionesAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
