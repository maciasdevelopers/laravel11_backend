import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoVentasMostradorComponent } from './catalogoventamostrador.component';

describe('CatalogoVentasMostradorComponent', () => {
  let component: CatalogoVentasMostradorComponent;
  let fixture: ComponentFixture<CatalogoVentasMostradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoVentasMostradorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoVentasMostradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
