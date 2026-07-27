import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrateSsicComponent } from './registrate_ssic.component';
describe('RegistrateSsicComponent', () => {
  let component: RegistrateSsicComponent;
  let fixture: ComponentFixture<RegistrateSsicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrateSsicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrateSsicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
