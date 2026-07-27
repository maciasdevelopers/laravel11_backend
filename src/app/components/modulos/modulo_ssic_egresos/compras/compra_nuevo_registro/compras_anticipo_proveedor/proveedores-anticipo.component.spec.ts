import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoresAnticipoComponent } from './proveedores-anticipo.component';

describe('ProveedoresAnticipoComponent', () => {
  let component: ProveedoresAnticipoComponent;
  let fixture: ComponentFixture<ProveedoresAnticipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProveedoresAnticipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProveedoresAnticipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
