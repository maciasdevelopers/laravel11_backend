import { TestBed } from '@angular/core/testing';

import { LoadInterceptorInterceptor } from './load-interceptor.interceptor';

describe('LoadInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LoadInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: LoadInterceptorInterceptor = TestBed.inject(LoadInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
