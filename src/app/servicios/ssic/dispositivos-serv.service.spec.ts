import { TestBed } from '@angular/core/testing';

import { DispositivosServService } from './dispositivos-serv.service';

describe('DispositivosServService', () => {
  let service: DispositivosServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispositivosServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
