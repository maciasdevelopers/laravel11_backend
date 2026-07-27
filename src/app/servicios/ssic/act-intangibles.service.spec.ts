import { TestBed } from '@angular/core/testing';

import { ActIntangiblesService } from './act-intangibles.service';

describe('ActIntangiblesService', () => {
  let service: ActIntangiblesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActIntangiblesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
