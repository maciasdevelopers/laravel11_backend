import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCompraCFDIComponent } from './registro_por_cfdi.component';

describe('RegistroCompraCFDIComponent', () => {
  let component: RegistroCompraCFDIComponent;
  let fixture: ComponentFixture<RegistroCompraCFDIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroCompraCFDIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCompraCFDIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
