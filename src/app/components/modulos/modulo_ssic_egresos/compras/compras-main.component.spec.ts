import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasMainComponent } from './compras-main.component';

describe('ComprasMainComponent', () => {
  let component: ComprasMainComponent;
  let fixture: ComponentFixture<ComprasMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComprasMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
