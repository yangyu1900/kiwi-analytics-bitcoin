import { TestBed, inject } from '@angular/core/testing';
import { AntiSigninGuardService } from './anti-signin-guard.service';

describe('AntiSigninGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AntiSigninGuardService]
    });
  });

  it('should be created', inject([AntiSigninGuardService], (service: AntiSigninGuardService) => {
    expect(service).toBeTruthy();
  }));
});
