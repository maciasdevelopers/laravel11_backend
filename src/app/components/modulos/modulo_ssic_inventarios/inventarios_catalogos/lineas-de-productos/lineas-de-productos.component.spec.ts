import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineasDeProductosComponent } from './lineas-de-productos.component';

describe('LineasDeProductosComponent', () => {
  let component: LineasDeProductosComponent;
  let fixture: ComponentFixture<LineasDeProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineasDeProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineasDeProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
