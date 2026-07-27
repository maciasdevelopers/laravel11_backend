import { TestBed } from '@angular/core/testing';

import { ListaPreciosServiceService } from './lista-precios-service.service';

describe('ListaPreciosServiceService', () => {
  let service: ListaPreciosServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListaPreciosServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
