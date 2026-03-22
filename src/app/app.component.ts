import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

import { EnvBadgeComponent } from './shared/env-badge/env-badge.component';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, EnvBadgeComponent],
  template: `
    <header class="header">
      <a routerLink="/" class="logo">Ceccoff</a>

      <nav class="nav">
        <a routerLink="/">Home</a>
        <a routerLink="/dashboard">Dashboard</a>
        <a routerLink="/about">Sobre o Template</a>
      </nav>

      <app-env-badge />
    </header>

    <main class="main">
      <router-outlet />
    </main>
  `,
  styles: [`
    .header {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 0 1.5rem;
      height: 60px;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .logo {
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--color-primary);
      text-decoration: none;
      flex: 0 0 auto;
    }

    .nav {
      display: flex;
      gap: 1.25rem;
      flex: 1;

      a {
        color: var(--color-muted);
        font-size: 0.875rem;
        transition: color 0.15s;

        &:hover { color: var(--color-text); text-decoration: none; }
      }
    }

    .main {
      min-height: calc(100vh - 60px);
      padding: 2rem 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }
  `],
})
export class AppComponent {}
