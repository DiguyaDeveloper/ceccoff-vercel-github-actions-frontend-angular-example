import { TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render 4 metric cards', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.metric-card');
    expect(cards.length).toBe(4);
  });

  it('should compute total metrics correctly', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    expect(fixture.componentInstance.total()).toBe(4);
  });
});
