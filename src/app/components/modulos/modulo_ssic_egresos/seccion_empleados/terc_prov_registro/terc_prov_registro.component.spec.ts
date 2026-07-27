import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TercProvRegistroComponent } from './terc_prov_registro.component';

describe('TercProvRegistroComponent', () => {
  let component: TercProvRegistroComponent;
  let fixture: ComponentFixture<TercProvRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TercProvRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TercProvRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
