import { TestBed } from '@angular/core/testing';

import { AppReleaseService } from './app-release.service';

describe('AppReleaseService', () => {
  let service: AppReleaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppReleaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
