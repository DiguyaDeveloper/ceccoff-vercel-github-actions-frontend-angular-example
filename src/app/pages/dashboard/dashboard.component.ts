import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { EnvironmentService } from '../../core/environment.service';

interface Metric {
  id: number;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  delta: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-header">
      <h2>Dashboard</h2>
      <p class="subtitle">Ambiente: <strong>{{ env.name() }}</strong> · v{{ env.version() }}</p>
    </div>

    <div class="metrics-grid">
      @for (metric of metrics(); track metric.id) {
        <div class="metric-card" [class]="metric.trend">
          <span class="metric-label">{{ metric.label }}</span>
          <span class="metric-value">{{ metric.value }}</span>
          <span class="metric-delta">
            {{ metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→' }}
            {{ metric.delta }}
          </span>
        </div>
      }
    </div>

    <div class="status-card">
      <h3>Status da Pipeline</h3>
      <div class="status-row">
        <span class="dot success"></span>
        <span>CI — Lint &amp; Testes</span>
        <span class="tag success">Passou</span>
      </div>
      <div class="status-row">
        <span class="dot success"></span>
        <span>Deploy {{ env.label() }}</span>
        <span class="tag success">Online</span>
      </div>
      <div class="status-row">
        <span class="dot neutral"></span>
        <span>Health Check</span>
        <span class="tag neutral">HTTP 200</span>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 2rem;
      h2 { font-size: 1.75rem; font-weight: 700; }
      .subtitle { color: var(--color-muted); margin-top: 0.25rem;
        strong { color: var(--color-text); } }
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;

      &.up    { border-top: 3px solid var(--color-success); }
      &.down  { border-top: 3px solid var(--color-danger); }
      &.stable{ border-top: 3px solid var(--color-primary); }
    }

    .metric-label { font-size: 0.8rem; color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .metric-value { font-size: 1.75rem; font-weight: 700; }
    .metric-delta { font-size: 0.8rem; color: var(--color-muted); }

    .status-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: 1.5rem;
      max-width: 480px;

      h3 { font-size: 1rem; font-weight: 600; margin-bottom: 1rem; }
    }

    .status-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0;
      border-bottom: 1px solid var(--color-border);
      font-size: 0.875rem;
      &:last-child { border-bottom: none; }
    }

    .dot {
      width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
      &.success { background: var(--color-success); box-shadow: 0 0 6px var(--color-success); }
      &.neutral { background: var(--color-muted); }
    }

    .tag {
      margin-left: auto;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      &.success { background: #14532d44; color: var(--color-success); }
      &.neutral { background: var(--color-border); color: var(--color-muted); }
    }
  `],
})
export class DashboardComponent {
  env = inject(EnvironmentService);

  metrics = signal<Metric[]>([
    { id: 1, label: 'Deploys hoje',   value: '3',   trend: 'up',    delta: '+2 vs ontem' },
    { id: 2, label: 'Uptime',         value: '99.9%', trend: 'stable', delta: '30 dias' },
    { id: 3, label: 'Rollbacks',      value: '0',   trend: 'stable', delta: 'últimos 7d' },
    { id: 4, label: 'Aprovações',     value: '12',  trend: 'up',    delta: '+4 semana' },
  ]);

  total = computed(() => this.metrics().length);
}
