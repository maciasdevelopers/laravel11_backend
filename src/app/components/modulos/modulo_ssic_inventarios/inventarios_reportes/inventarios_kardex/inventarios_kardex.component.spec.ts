import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventKardexComponent } from './inventarios_kardex.component';

describe('InventKardexComponent', () => {
  let component: InventKardexComponent;
  let fixture: ComponentFixture<InventKardexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventKardexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventKardexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
