import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasProrrateosInfoComponent } from './compras_prorrateos_info.component';

describe('ComprasProrrateosInfoComponent', () => {
  let component: ComprasProrrateosInfoComponent;
  let fixture: ComponentFixture<ComprasProrrateosInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComprasProrrateosInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasProrrateosInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
