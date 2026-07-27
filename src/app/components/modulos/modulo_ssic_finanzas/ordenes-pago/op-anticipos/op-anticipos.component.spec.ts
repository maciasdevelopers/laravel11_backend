import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpAnticiposComponent } from './op-anticipos.component';

describe('OpAnticiposComponent', () => {
  let component: OpAnticiposComponent;
  let fixture: ComponentFixture<OpAnticiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpAnticiposComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpAnticiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
