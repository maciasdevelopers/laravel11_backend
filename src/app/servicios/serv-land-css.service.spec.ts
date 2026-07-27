import { TestBed } from '@angular/core/testing';

import { ServLandCSSService } from './serv-land-css.service';

describe('ServLandCSSService', () => {
  let service: ServLandCSSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServLandCSSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
