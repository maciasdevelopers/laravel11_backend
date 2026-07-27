import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpDeudoresComponent } from './op-deudores.component';

describe('OpDeudoresComponent', () => {
  let component: OpDeudoresComponent;
  let fixture: ComponentFixture<OpDeudoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpDeudoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpDeudoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
