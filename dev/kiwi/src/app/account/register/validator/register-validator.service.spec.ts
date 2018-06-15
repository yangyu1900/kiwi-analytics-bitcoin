import { TestBed, inject } from '@angular/core/testing';

import { RegisterValidatorService } from './register-validator.service';

describe('RegisterValidatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterValidatorService]
    });
  });

  it('should be created', inject([RegisterValidatorService], (service: RegisterValidatorService) => {
    expect(service).toBeTruthy();
  }));
});
