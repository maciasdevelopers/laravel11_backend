import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AportacionesSeguridadSocialCatalogoComponent } from './aport_seg_social_catalogo.component';

describe('AportacionesSeguridadSocialCatalogoComponent', () => {
  let component: AportacionesSeguridadSocialCatalogoComponent;
  let fixture: ComponentFixture<AportacionesSeguridadSocialCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AportacionesSeguridadSocialCatalogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AportacionesSeguridadSocialCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
