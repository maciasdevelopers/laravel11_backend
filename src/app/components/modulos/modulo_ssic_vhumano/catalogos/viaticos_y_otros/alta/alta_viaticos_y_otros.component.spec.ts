import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VhumanoViaticosYOtrosComponent } from './alta_viaticos_y_otros.component';

describe('VhumanoViaticosYOtrosComponent', () => {
  let component: VhumanoViaticosYOtrosComponent;
  let fixture: ComponentFixture<VhumanoViaticosYOtrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VhumanoViaticosYOtrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VhumanoViaticosYOtrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
