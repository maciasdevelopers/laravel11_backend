import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalAsociadosComponent } from './portal_asociados.component';

describe('PortalAsociadosComponent', () => {
  let component: PortalAsociadosComponent;
  let fixture: ComponentFixture<PortalAsociadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortalAsociadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalAsociadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
