import { TestBed } from '@angular/core/testing';
import { DescargablesService } from './descargables-serv.service';

describe('DescargablesService', () => {
  let service: DescargablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescargablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
