import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaPlantillaComponent } from './nueva-plantilla.component';

describe('NuevaPlantillaComponent', () => {
  let component: NuevaPlantillaComponent;
  let fixture: ComponentFixture<NuevaPlantillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevaPlantillaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaPlantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
