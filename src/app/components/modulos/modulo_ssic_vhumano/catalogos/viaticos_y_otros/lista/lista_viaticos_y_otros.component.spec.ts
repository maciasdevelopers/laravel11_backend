import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VhumanoViaticosYOtrosListaComponent } from './lista_viaticos_y_otros.component';

describe('VhumanoViaticosYOtrosListaComponent', () => {
  let component: VhumanoViaticosYOtrosListaComponent;
  let fixture: ComponentFixture<VhumanoViaticosYOtrosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VhumanoViaticosYOtrosListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VhumanoViaticosYOtrosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
