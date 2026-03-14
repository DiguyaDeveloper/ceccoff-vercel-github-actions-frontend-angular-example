import { TestBed } from '@angular/core/testing';

import { EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {
  let service: EnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose env name as signal', () => {
    const name = service.name();
    expect(['development', 'staging', 'production']).toContain(name);
  });

  it('should return DEV label for development env', () => {
    // In test environment, the base environment.ts is used (development)
    if (service.name() === 'development') {
      expect(service.label()).toBe('DEV');
    }
  });

  it('should expose a non-empty apiUrl', () => {
    expect(service.apiUrl().length).toBeGreaterThan(0);
  });
});
