import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TercReemRegistrarComponent } from './terc_reem_new.component';

describe('TercReemRegistrarComponent', () => {
  let component: TercReemRegistrarComponent;
  let fixture: ComponentFixture<TercReemRegistrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TercReemRegistrarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TercReemRegistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
