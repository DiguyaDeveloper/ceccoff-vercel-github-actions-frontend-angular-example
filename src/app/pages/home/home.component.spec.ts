import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './home.component';
import { EnvironmentService } from '../../core/environment.service';

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the app title', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.title')?.textContent).toContain('Ceccoff');
  });

  it('should display the api url from EnvironmentService', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const env = TestBed.inject(EnvironmentService);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.subtitle')?.textContent).toContain(env.apiUrl());
  });
});
