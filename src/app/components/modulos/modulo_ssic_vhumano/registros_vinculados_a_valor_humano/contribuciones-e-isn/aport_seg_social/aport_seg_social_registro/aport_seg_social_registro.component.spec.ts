import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AportacionesSeguridadSocialRegistroComponent } from './aport_seg_social_registro.component';

describe('AportacionesSeguridadSocialRegistroComponent', () => {
  let component: AportacionesSeguridadSocialRegistroComponent;
  let fixture: ComponentFixture<AportacionesSeguridadSocialRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AportacionesSeguridadSocialRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AportacionesSeguridadSocialRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
