import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsientosContablesListaComponent } from './asientos_contables_lista.component';

describe('AsientosContablesListaComponent', () => {
  let component: AsientosContablesListaComponent;
  let fixture: ComponentFixture<AsientosContablesListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsientosContablesListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsientosContablesListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});