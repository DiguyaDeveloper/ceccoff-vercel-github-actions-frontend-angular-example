import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="container">
      <span class="code">404</span>
      <h2>Página não encontrada</h2>
      <p>A rota que você acessou não existe.</p>
      <a routerLink="/" class="btn">← Voltar para home</a>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      gap: 0.75rem;
    }
    .code  { font-size: 5rem; font-weight: 800; color: var(--color-border); }
    h2     { font-size: 1.5rem; }
    p      { color: var(--color-muted); }
    .btn   {
      margin-top: 0.5rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      color: var(--color-text);
      padding: 0.6rem 1.25rem;
      border-radius: var(--radius);
      font-size: 0.875rem;
      transition: border-color 0.15s;
      text-decoration: none;
      &:hover { border-color: var(--color-primary); text-decoration: none; }
    }
  `],
})
export class NotFoundComponent {}
