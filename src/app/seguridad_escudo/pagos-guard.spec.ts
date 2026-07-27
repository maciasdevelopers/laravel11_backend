import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { pagosGuard } from './pagos-guard';

describe('pagosGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => pagosGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
