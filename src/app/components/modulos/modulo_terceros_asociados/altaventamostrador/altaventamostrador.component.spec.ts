import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaVentasMostradorComponent } from './altaventamostrador.component';

describe('AltaVentasMostradorComponent', () => {
  let component: AltaVentasMostradorComponent;
  let fixture: ComponentFixture<AltaVentasMostradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaVentasMostradorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaVentasMostradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
