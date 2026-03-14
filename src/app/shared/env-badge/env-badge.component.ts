import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { EnvironmentService } from '../../core/environment.service';

@Component({
  selector: 'app-env-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="badge" [class]="env.name()">
      {{ env.label() }}
    </span>
  `,
  styles: [`
    .badge {
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;

      &.development { background: #1a3a1a; color: #22c55e; border: 1px solid #22c55e44; }
      &.staging     { background: #3a2a0a; color: #f59e0b; border: 1px solid #f59e0b44; }
      &.production  { background: #3a0a0a; color: #ef4444; border: 1px solid #ef444444; }
    }
  `],
})
export class EnvBadgeComponent {
  env = inject(EnvironmentService);
}
