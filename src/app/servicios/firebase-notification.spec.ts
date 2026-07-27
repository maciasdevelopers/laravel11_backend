import { TestBed } from '@angular/core/testing';

import { FirebaseNotification } from './firebase-notification';

describe('FirebaseNotification', () => {
  let service: FirebaseNotification;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseNotification);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
