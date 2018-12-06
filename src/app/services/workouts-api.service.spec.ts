import { TestBed, inject } from '@angular/core/testing';

import { WorkoutsApiService } from './workouts-api.service';

describe('WorkoutsApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkoutsApiService]
    });
  });

  it('should be created', inject([WorkoutsApiService], (service: WorkoutsApiService) => {
    expect(service).toBeTruthy();
  }));
});
