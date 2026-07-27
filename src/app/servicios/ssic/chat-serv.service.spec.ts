import { TestBed } from '@angular/core/testing';

import { ChatServService } from './chat-serv.service';

describe('ChatServService', () => {
  let service: ChatServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
