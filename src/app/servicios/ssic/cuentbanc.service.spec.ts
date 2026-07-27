import { TestBed } from '@angular/core/testing';
import { CuentbancService } from './cuentbanc.service';

describe('CuentbancService', () => {
  let service: CuentbancService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuentbancService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
