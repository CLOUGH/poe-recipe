import { TestBed } from '@angular/core/testing';

import { ExaltShardRecipeService } from './exalt-shard-recipe.service';

describe('ExaltShardRecipeService', () => {
  let service: ExaltShardRecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExaltShardRecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
