import { TestBed } from '@angular/core/testing';

import { ServLandJSService } from './serv-land-js.service';

describe('ServLandJSService', () => {
  let service: ServLandJSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServLandJSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
