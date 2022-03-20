import { TestBed } from '@angular/core/testing';

import { JsonServerLoggerService } from './json-server-logger.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('JsonServerLoggerService', () => {
  let service: JsonServerLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(JsonServerLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
