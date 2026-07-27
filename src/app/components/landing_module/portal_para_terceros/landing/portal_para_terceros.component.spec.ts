import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortalParaTercerosComponent } from './portal_para_terceros.component';

describe('PortalParaTercerosComponent', () => {
  let component: PortalParaTercerosComponent;
  let fixture: ComponentFixture<PortalParaTercerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortalParaTercerosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalParaTercerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
