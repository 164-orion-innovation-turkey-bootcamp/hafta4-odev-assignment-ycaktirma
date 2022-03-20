import { TestBed } from '@angular/core/testing';

import { BaseLoggerService } from './base-logger.service';

describe('BaseLoggerService', () => {
  let service: BaseLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
