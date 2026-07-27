import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsientosContablesRegistroComponent } from './asientos_contables_registro.component';

describe('AsientosContablesRegistroComponent', () => {
  let component: AsientosContablesRegistroComponent;
  let fixture: ComponentFixture<AsientosContablesRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsientosContablesRegistroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsientosContablesRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});