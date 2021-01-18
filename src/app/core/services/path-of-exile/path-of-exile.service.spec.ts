import { TestBed } from '@angular/core/testing';

import { PathOfExileService } from './path-of-exile.service';

describe('PathOfExileService', () => {
  let service: PathOfExileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PathOfExileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
