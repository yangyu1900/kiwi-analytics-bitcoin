import { TestBed, inject } from '@angular/core/testing';

import { ThemeSpinner } from './theme-spinner.service';

describe('ThemeSpinnerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeSpinner]
    });
  });

  it('should be created', inject([ThemeSpinner], (service: ThemeSpinner) => {
    expect(service).toBeTruthy();
  }));
});
