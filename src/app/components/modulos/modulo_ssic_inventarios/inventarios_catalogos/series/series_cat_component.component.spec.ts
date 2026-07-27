import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesCatalogoComponent } from './series_cat_component.component';

describe('SeriesCatalogoComponent', () => {
  let component: SeriesCatalogoComponent;
  let fixture: ComponentFixture<SeriesCatalogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeriesCatalogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
