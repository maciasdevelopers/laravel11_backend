import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerMejorasListaComponent } from './dermejoras_lista.component';

describe('CatalogosComponent', () => {
  let component: DerMejorasListaComponent;
  let fixture: ComponentFixture<DerMejorasListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DerMejorasListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DerMejorasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
