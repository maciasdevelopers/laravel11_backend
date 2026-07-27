import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciliacionCFDIComponent } from './conciliacion-cfdi.component';

describe('ConciliacionCFDIComponent', () => {
  let component: ConciliacionCFDIComponent;
  let fixture: ComponentFixture<ConciliacionCFDIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConciliacionCFDIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConciliacionCFDIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
