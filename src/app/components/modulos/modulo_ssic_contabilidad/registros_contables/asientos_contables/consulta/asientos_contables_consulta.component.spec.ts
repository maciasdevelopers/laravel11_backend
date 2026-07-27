import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsientosContablesConsultaComponent } from './asientos_contables_consulta.component';

describe('AsientosContablesConsultaComponent', () => {
  let component: AsientosContablesConsultaComponent;
  let fixture: ComponentFixture<AsientosContablesConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsientosContablesConsultaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsientosContablesConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});