import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatSoliFactComponent } from './cat-soli-fact.component';

describe('CatSoliFactComponent', () => {
  let component: CatSoliFactComponent;
  let fixture: ComponentFixture<CatSoliFactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatSoliFactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatSoliFactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
