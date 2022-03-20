import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { UserSession } from 'src/app/models/user-session';

import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
