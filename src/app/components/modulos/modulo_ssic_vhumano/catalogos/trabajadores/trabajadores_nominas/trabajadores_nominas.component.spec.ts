import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VHTrabajadoresNominasComponent } from './trabajadores_nominas.component';

describe('VHTrabajadoresNominasComponent', () => {
  let component: VHTrabajadoresNominasComponent;
  let fixture: ComponentFixture<VHTrabajadoresNominasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VHTrabajadoresNominasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VHTrabajadoresNominasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
