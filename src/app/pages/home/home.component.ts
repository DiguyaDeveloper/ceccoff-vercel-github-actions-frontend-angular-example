import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EnvironmentService } from '../../core/environment.service';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <h1 class="title">Ceccoff</h1>
      <p class="subtitle">
        Admin Dashboard — versão <strong>{{ env.version() }}</strong>
        conectado em <code>{{ env.apiUrl() }}</code>
      </p>

      <div class="actions">
        <a routerLink="/dashboard" class="btn-primary">Abrir Dashboard</a>
      </div>
    </section>

    <section class="info-grid">
      <div class="card">
        <span class="card-icon">🚀</span>
        <h3>Pipeline CI/CD</h3>
        <p>Deploy automatizado com aprovação em DEV → HML → PRD via GitHub Actions.</p>
      </div>
      <div class="card">
        <span class="card-icon">🔐</span>
        <h3>Ambientes Isolados</h3>
        <p>Variáveis injetadas em build-time por ambiente. Nenhum secret no código.</p>
      </div>
      <div class="card">
        <span class="card-icon">↩️</span>
        <h3>Rollback Automático</h3>
        <p>Detecta a versão anterior via GitHub Deployments API e reverte em 1 clique.</p>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      text-align: center;
      padding: 5rem 1rem 3rem;
    }

    .title {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800;
      color: var(--color-primary);
      margin-bottom: 1rem;
    }

    .subtitle {
      color: var(--color-muted);
      font-size: 1.1rem;
      margin-bottom: 2rem;

      strong { color: var(--color-text); }
      code   { font-size: 0.9em; background: var(--color-surface); padding: 0.1em 0.4em; border-radius: 4px; }
    }

    .actions { display: flex; justify-content: center; gap: 1rem; }

    .btn-primary {
      background: var(--color-primary);
      color: #fff;
      padding: 0.65rem 1.5rem;
      border-radius: var(--radius);
      font-weight: 600;
      font-size: 0.95rem;
      transition: background 0.15s;
      text-decoration: none;

      &:hover { background: var(--color-primary-hv); text-decoration: none; }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-top: 3rem;
    }

    .card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: 1.5rem;

      .card-icon { font-size: 1.75rem; display: block; margin-bottom: 0.75rem; }
      h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
      p  { font-size: 0.875rem; color: var(--color-muted); line-height: 1.6; }
    }
  `],
})
export class HomeComponent {
  env = inject(EnvironmentService);
}
