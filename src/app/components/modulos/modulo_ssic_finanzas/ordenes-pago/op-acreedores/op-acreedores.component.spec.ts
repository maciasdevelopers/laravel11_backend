import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpAcreedoresComponent } from './op-acreedores.component';

describe('OpAcreedoresComponent', () => {
  let component: OpAcreedoresComponent;
  let fixture: ComponentFixture<OpAcreedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpAcreedoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpAcreedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
