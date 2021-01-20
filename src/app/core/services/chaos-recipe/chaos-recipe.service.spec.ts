import { TestBed } from '@angular/core/testing';

import { ChaosRecipeService } from './chaos-recipe.service';

describe('ChaosRecipeService', () => {
  let service: ChaosRecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChaosRecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
