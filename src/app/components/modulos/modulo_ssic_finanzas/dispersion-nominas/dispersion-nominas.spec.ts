import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispersionNominasComponent } from './dispersion-nominas';

describe('DispersionNominasComponent', () => {
  let component: DispersionNominasComponent;
  let fixture: ComponentFixture<DispersionNominasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DispersionNominasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispersionNominasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
