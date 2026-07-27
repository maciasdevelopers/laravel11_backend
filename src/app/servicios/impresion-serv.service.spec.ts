import { TestBed } from '@angular/core/testing';

import { ImpresionServService } from './impresion-serv.service';

describe('ImpresionServService', () => {
  let service: ImpresionServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpresionServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
