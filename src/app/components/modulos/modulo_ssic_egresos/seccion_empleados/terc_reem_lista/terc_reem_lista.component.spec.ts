import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TercReemListasComponent } from './terc_reem_lista.component';

describe('TercReemListasComponent', () => {
  let component: TercReemListasComponent;
  let fixture: ComponentFixture<TercReemListasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TercReemListasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TercReemListasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
