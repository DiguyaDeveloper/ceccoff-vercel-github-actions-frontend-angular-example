import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Action {
  name: string;
  icon: string;
  category: 'quality' | 'deploy' | 'infra' | 'release';
  description: string;
}

interface Workflow {
  file: string;
  title: string;
  trigger: string;
  description: string;
  steps: string[];
  color: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- HERO -->
    <section class="hero">
      <div class="hero-eyebrow">
        <span class="badge">Open Template</span>
        <span class="badge badge-ci">Angular 21 · Vercel · GitHub Actions</span>
      </div>
      <h1 class="hero-title">
        <span class="accent">CI/CD</span> Enterprise<br/>
        <span class="dim">Frontend Template</span>
      </h1>
      <p class="hero-desc">
        Um template de referência para projetos frontend com pipeline de integração e entrega
        contínua de nível enterprise — incluindo qualidade de código, múltiplos ambientes,
        análise de segurança, automação de release e rollback.
      </p>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-num">7</span>
          <span class="stat-label">Workflows</span>
        </div>
        <div class="stat-sep">·</div>
        <div class="stat">
          <span class="stat-num">13</span>
          <span class="stat-label">Composite Actions</span>
        </div>
        <div class="stat-sep">·</div>
        <div class="stat">
          <span class="stat-num">3</span>
          <span class="stat-label">Ambientes</span>
        </div>
        <div class="stat-sep">·</div>
        <div class="stat">
          <span class="stat-num">0</span>
          <span class="stat-label">Downtime</span>
        </div>
      </div>
    </section>

    <!-- PIPELINE DIAGRAM -->
    <section class="section">
      <h2 class="section-title">
        <span class="title-line"></span>
        Pipeline Principal
        <span class="section-file">pipeline.yml</span>
      </h2>
      <p class="section-desc">
        Fluxo de trunk-based development com tags semânticas. Cada merge na main
        pode gerar uma tag que dispara este pipeline.
      </p>

      <div class="diagram">
        <!-- Row 1: trigger -->
        <div class="diagram-row">
          <div class="node node-trigger">
            <span class="node-icon">🏷️</span>
            <span class="node-label">Tag push<br/><small>vX.Y.Z</small></span>
          </div>
          <div class="arrow">→</div>
          <div class="node node-trigger">
            <span class="node-icon">🖱️</span>
            <span class="node-label">Manual<br/><small>workflow_dispatch</small></span>
          </div>
        </div>

        <div class="diagram-v-arrow">↓</div>

        <!-- Row 2: setup -->
        <div class="diagram-row center">
          <div class="node node-setup">
            <span class="node-icon">⚙️</span>
            <span class="node-label">Setup<br/><small>versão · SHA</small></span>
          </div>
        </div>

        <div class="diagram-v-arrow">↓</div>

        <!-- Row 3: quality gate (parallel) -->
        <div class="diagram-label">paralelo</div>
        <div class="diagram-row parallel">
          <div class="node node-quality">
            <span class="node-icon">🔍</span>
            <span class="node-label">ci-lint<br/><small>ESLint · tsc</small></span>
          </div>
          <div class="node node-quality">
            <span class="node-icon">🧪</span>
            <span class="node-label">ci-test<br/><small>Node 20 · 22</small></span>
          </div>
          <div class="node node-quality">
            <span class="node-icon">🔒</span>
            <span class="node-label">ci-security<br/><small>npm audit</small></span>
          </div>
        </div>

        <div class="diagram-v-arrow">↓</div>

        <!-- Row 4: quality gate aggregator -->
        <div class="diagram-row center">
          <div class="node node-gate">
            <span class="node-icon">✅</span>
            <span class="node-label">quality-gate<br/><small>agrega resultados</small></span>
          </div>
        </div>

        <div class="diagram-v-arrow">↓</div>

        <!-- Row 5: deploy DEV + HML (parallel) -->
        <div class="diagram-label">paralelo</div>
        <div class="diagram-row parallel">
          <div class="node node-deploy">
            <span class="node-icon">🛠️</span>
            <span class="node-label">deploy-dev<br/><small>DEV environment</small></span>
          </div>
          <div class="node node-deploy">
            <span class="node-icon">🧩</span>
            <span class="node-label">deploy-hml<br/><small>HML environment</small></span>
          </div>
        </div>

        <div class="diagram-v-arrow">↓</div>

        <!-- Row 6: PRD approval -->
        <div class="diagram-row center">
          <div class="node node-approval">
            <span class="node-icon">👤</span>
            <span class="node-label">deploy-prd<br/><small>aprovação humana</small></span>
          </div>
        </div>

        <div class="diagram-v-arrow">↓</div>

        <!-- Row 7: release -->
        <div class="diagram-row center">
          <div class="node node-release">
            <span class="node-icon">🚀</span>
            <span class="node-label">release<br/><small>GitHub Release + changelog</small></span>
          </div>
        </div>
      </div>
    </section>

    <!-- WORKFLOWS -->
    <section class="section">
      <h2 class="section-title">
        <span class="title-line"></span>
        Todos os Workflows
      </h2>

      <div class="workflows-grid">
        @for (wf of workflows; track wf.file) {
          <div class="wf-card" [attr.data-color]="wf.color">
            <div class="wf-header">
              <span class="wf-title">{{ wf.title }}</span>
              <code class="wf-file">{{ wf.file }}</code>
            </div>
            <div class="wf-trigger">
              <span class="trigger-label">Trigger</span>
              <span class="trigger-value">{{ wf.trigger }}</span>
            </div>
            <p class="wf-desc">{{ wf.description }}</p>
            <ol class="wf-steps">
              @for (step of wf.steps; track step) {
                <li>{{ step }}</li>
              }
            </ol>
          </div>
        }
      </div>
    </section>

    <!-- COMPOSITE ACTIONS -->
    <section class="section">
      <h2 class="section-title">
        <span class="title-line"></span>
        Composite Actions
        <span class="section-sub">13 ações reutilizáveis</span>
      </h2>
      <p class="section-desc">
        Cada action encapsula uma responsabilidade específica e é reutilizada
        entre workflows, garantindo consistência e evitando duplicação.
      </p>

      <div class="actions-categories">
        @for (cat of actionCategories; track cat.key) {
          <div class="actions-category">
            <h3 class="cat-title">
              <span class="cat-dot" [attr.data-cat]="cat.key"></span>
              {{ cat.label }}
            </h3>
            <div class="actions-list">
              @for (action of getActionsByCategory(cat.key); track action.name) {
                <div class="action-card">
                  <div class="action-header">
                    <span class="action-icon">{{ action.icon }}</span>
                    <code class="action-name">{{ action.name }}</code>
                  </div>
                  <p class="action-desc">{{ action.description }}</p>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </section>

    <!-- REUSABLE WORKFLOW -->
    <section class="section">
      <h2 class="section-title">
        <span class="title-line"></span>
        Reusable Workflow
      </h2>

      <div class="reusable-card">
        <div class="reusable-header">
          <span class="reusable-icon">🔄</span>
          <div>
            <div class="reusable-title">reusable-deploy.yml</div>
            <div class="reusable-sub">workflow_call — usado por pipeline.yml e hotfix.yml</div>
          </div>
        </div>
        <p class="reusable-desc">
          Encapsula o ciclo completo de deploy em qualquer ambiente. Por ser um reusable workflow
          (e não uma composite action), pode declarar <code>environment:</code> para aprovação humana
          e <code>permissions:</code> próprias para registro de deployments.
        </p>
        <div class="reusable-flow">
          @for (step of reusableSteps; track step; let last = $last) {
            <div class="rf-step">{{ step }}</div>
            @if (!last) { <div class="rf-arrow">→</div> }
          }
        </div>
      </div>
    </section>

    <!-- TECH STACK -->
    <section class="section">
      <h2 class="section-title">
        <span class="title-line"></span>
        Stack & Decisões
      </h2>

      <div class="decisions-grid">
        @for (d of decisions; track d.title) {
          <div class="decision-card">
            <div class="decision-icon">{{ d.icon }}</div>
            <div class="decision-title">{{ d.title }}</div>
            <div class="decision-text">{{ d.text }}</div>
          </div>
        }
      </div>
    </section>

    <!-- FOOTER CTA -->
    <section class="footer-cta">
      <div class="cta-inner">
        <div class="cta-text">
          <span class="cta-label">Template público</span>
          <p>Use como ponto de partida para seu próximo projeto Angular + Vercel.</p>
        </div>
        <div class="cta-tags">
          @for (tag of tags; track tag) {
            <span class="tag">{{ tag }}</span>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ─── TOKENS ─── */
    :host {
      --accent: #3b82f6;
      --accent-dim: rgba(59,130,246,0.15);
      --green: #22c55e;
      --amber: #f59e0b;
      --red: #ef4444;
      --purple: #a855f7;
      --mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
      display: block;
    }

    /* ─── HERO ─── */
    .hero {
      padding: 3rem 0 4rem;
      border-bottom: 1px solid var(--color-border);
      margin-bottom: 3.5rem;
    }

    .hero-eyebrow {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .badge {
      font-family: var(--mono);
      font-size: 0.7rem;
      padding: 0.25rem 0.6rem;
      border: 1px solid var(--color-border);
      border-radius: 3px;
      color: var(--color-muted);
      letter-spacing: 0.05em;
    }

    .badge-ci {
      border-color: var(--accent);
      color: var(--accent);
      background: var(--accent-dim);
    }

    .hero-title {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.03em;
      margin-bottom: 1.25rem;
    }

    .accent { color: var(--accent); }
    .dim { color: var(--color-muted); }

    .hero-desc {
      font-size: 1.05rem;
      color: var(--color-muted);
      max-width: 640px;
      line-height: 1.7;
      margin-bottom: 2rem;
    }

    .hero-stats {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .stat { display: flex; flex-direction: column; align-items: center; }
    .stat-num {
      font-family: var(--mono);
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-text);
      line-height: 1;
    }
    .stat-label { font-size: 0.7rem; color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 0.2rem; }
    .stat-sep { color: var(--color-border); font-size: 1.5rem; }

    /* ─── SECTION ─── */
    .section {
      margin-bottom: 4rem;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }

    .title-line {
      width: 24px;
      height: 2px;
      background: var(--accent);
      flex-shrink: 0;
    }

    .section-file {
      font-family: var(--mono);
      font-size: 0.7rem;
      color: var(--accent);
      background: var(--accent-dim);
      border: 1px solid var(--accent);
      padding: 0.15rem 0.45rem;
      border-radius: 3px;
    }

    .section-sub {
      font-size: 0.8rem;
      font-weight: 400;
      color: var(--color-muted);
    }

    .section-desc {
      color: var(--color-muted);
      font-size: 0.9rem;
      line-height: 1.6;
      max-width: 600px;
      margin-bottom: 2rem;
    }

    /* ─── PIPELINE DIAGRAM ─── */
    .diagram {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
    }

    .diagram-row {
      display: flex;
      gap: 1rem;
      align-items: center;
      justify-content: center;
    }

    .diagram-row.parallel {
      gap: 0.75rem;
    }

    .diagram-row.center { justify-content: center; }

    .diagram-v-arrow {
      font-size: 1.25rem;
      color: var(--color-muted);
      margin: 0.4rem 0;
      line-height: 1;
    }

    .diagram-label {
      font-family: var(--mono);
      font-size: 0.65rem;
      color: var(--color-muted);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 0.25rem;
    }

    .node {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: 1px solid var(--color-border);
      min-width: 110px;
      text-align: center;
      transition: transform 0.15s, border-color 0.15s;

      &:hover { transform: translateY(-2px); }
    }

    .node-icon { font-size: 1.25rem; line-height: 1; }
    .node-label {
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1.3;
      small { font-family: var(--mono); font-size: 0.65rem; color: var(--color-muted); font-weight: 400; }
    }

    .node-trigger  { border-color: var(--color-border); background: var(--color-surface); }
    .node-setup    { border-color: var(--color-muted); background: var(--color-surface); }
    .node-quality  { border-color: var(--accent); background: var(--accent-dim); &:hover { border-color: var(--accent); } }
    .node-gate     { border-color: var(--green); background: rgba(34,197,94,0.12); }
    .node-deploy   { border-color: var(--amber); background: rgba(245,158,11,0.12); }
    .node-approval { border-color: var(--purple); background: rgba(168,85,247,0.12); }
    .node-release  { border-color: var(--green); background: rgba(34,197,94,0.15); }

    .arrow { color: var(--color-muted); font-size: 1rem; }

    /* ─── WORKFLOWS GRID ─── */
    .workflows-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .wf-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: 1.25rem;
      border-left-width: 3px;
      transition: transform 0.15s;

      &:hover { transform: translateY(-2px); }

      &[data-color="blue"]   { border-left-color: var(--accent); }
      &[data-color="green"]  { border-left-color: var(--green); }
      &[data-color="amber"]  { border-left-color: var(--amber); }
      &[data-color="red"]    { border-left-color: var(--red); }
      &[data-color="purple"] { border-left-color: var(--purple); }
    }

    .wf-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .wf-title { font-weight: 700; font-size: 0.95rem; }
    .wf-file  { font-family: var(--mono); font-size: 0.65rem; color: var(--color-muted); background: var(--color-border); padding: 0.15rem 0.4rem; border-radius: 3px; }

    .wf-trigger {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .trigger-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-muted); }
    .trigger-value { font-family: var(--mono); font-size: 0.7rem; color: var(--accent); }

    .wf-desc { font-size: 0.8rem; color: var(--color-muted); line-height: 1.5; margin-bottom: 0.75rem; }

    .wf-steps {
      padding-left: 1.1rem;
      margin: 0;
      li {
        font-family: var(--mono);
        font-size: 0.7rem;
        color: var(--color-muted);
        line-height: 1.8;
        counter-increment: none;
      }
    }

    /* ─── ACTIONS ─── */
    .actions-categories { display: flex; flex-direction: column; gap: 2rem; }

    .actions-category {}

    .cat-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-muted);
      margin-bottom: 0.75rem;
    }

    .cat-dot {
      width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
      &[data-cat="quality"] { background: var(--accent); }
      &[data-cat="deploy"]  { background: var(--amber); }
      &[data-cat="infra"]   { background: var(--purple); }
      &[data-cat="release"] { background: var(--green); }
    }

    .actions-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 0.75rem;
    }

    .action-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: 1rem;
      transition: border-color 0.15s;

      &:hover { border-color: var(--accent); }
    }

    .action-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; }
    .action-icon { font-size: 1rem; }
    .action-name { font-family: var(--mono); font-size: 0.75rem; font-weight: 600; color: var(--accent); }
    .action-desc { font-size: 0.78rem; color: var(--color-muted); line-height: 1.5; margin: 0; }

    /* ─── REUSABLE ─── */
    .reusable-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-left: 3px solid var(--accent);
      border-radius: var(--radius);
      padding: 1.5rem;
    }

    .reusable-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; }
    .reusable-icon { font-size: 1.75rem; }
    .reusable-title { font-weight: 700; font-size: 1rem; }
    .reusable-sub { font-family: var(--mono); font-size: 0.7rem; color: var(--color-muted); margin-top: 0.15rem; }

    .reusable-desc {
      color: var(--color-muted);
      font-size: 0.85rem;
      line-height: 1.6;
      margin-bottom: 1.25rem;
      code { font-family: var(--mono); font-size: 0.8rem; color: var(--accent); background: var(--accent-dim); padding: 0.1rem 0.3rem; border-radius: 3px; }
    }

    .reusable-flow {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.35rem;
    }

    .rf-step {
      font-family: var(--mono);
      font-size: 0.7rem;
      padding: 0.3rem 0.6rem;
      background: var(--accent-dim);
      border: 1px solid var(--accent);
      border-radius: 4px;
      color: var(--accent);
    }

    .rf-arrow { color: var(--color-muted); font-size: 0.8rem; }

    /* ─── DECISIONS ─── */
    .decisions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1rem;
    }

    .decision-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      padding: 1.25rem;
      transition: transform 0.15s;
      &:hover { transform: translateY(-2px); }
    }

    .decision-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .decision-title { font-weight: 700; font-size: 0.85rem; margin-bottom: 0.35rem; }
    .decision-text { font-size: 0.78rem; color: var(--color-muted); line-height: 1.5; }

    /* ─── FOOTER CTA ─── */
    .footer-cta {
      border-top: 1px solid var(--color-border);
      padding-top: 2.5rem;
      padding-bottom: 1rem;
    }

    .cta-inner {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      align-items: flex-start;
      justify-content: space-between;
    }

    .cta-label {
      font-family: var(--mono);
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--green);
      display: block;
      margin-bottom: 0.35rem;
    }

    .cta-text p { color: var(--color-muted); font-size: 0.9rem; margin: 0; }

    .cta-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      font-family: var(--mono);
      font-size: 0.7rem;
      padding: 0.25rem 0.6rem;
      border: 1px solid var(--color-border);
      border-radius: 3px;
      color: var(--color-muted);
    }
  `],
})
export class AboutComponent {
  readonly workflows: Workflow[] = [
    {
      file: 'pipeline.yml',
      title: '🚀 CI/CD Principal',
      trigger: 'Tag vX.Y.Z · workflow_dispatch',
      color: 'blue',
      description: 'Pipeline completo de integração e entrega contínua. Trunk-based development com tags semânticas.',
      steps: [
        'setup → detecta versão e SHA',
        'lint + test + security (paralelo)',
        'quality-gate → agrega resultados',
        'deploy-dev + deploy-hml (paralelo)',
        'deploy-prd → aprovação humana',
        'release → GitHub Release + changelog',
      ],
    },
    {
      file: 'pr-checks.yml',
      title: '🔍 PR Checks',
      trigger: 'pull_request → main',
      color: 'amber',
      description: 'Validação obrigatória em todo PR. Todos os jobs são required checks para merge.',
      steps: [
        'pr-title → Conventional Commits',
        'lint → ESLint + tsc',
        'test → Node 22, coverage + comentário',
        'security → npm audit HIGH+CRITICAL',
      ],
    },
    {
      file: 'release-automation.yml',
      title: '🔖 Release Automation',
      trigger: 'push → main (merge de PR)',
      color: 'green',
      description: 'Semantic Release automatizado. Analisa commits e determina próxima versão.',
      steps: [
        'Analisa commits (Conventional)',
        'feat → minor · fix → patch · BREAKING → major',
        'Atualiza package.json',
        'Commita bump + cria tag vX.Y.Z',
        'Tag push dispara pipeline.yml',
      ],
    },
    {
      file: 'hotfix.yml',
      title: '🔥 Hotfix',
      trigger: 'Tag v*-hotfix.* · workflow_dispatch',
      color: 'red',
      description: 'Pipeline expedito para correções críticas. Bypassa HML e CodeQL/Semgrep para velocidade máxima.',
      steps: [
        'quality → lint + test + security',
        'deploy-dev (sem HML)',
        'aprovação emergencial',
        'deploy-prd',
        'release marcado como pre-release',
      ],
    },
    {
      file: 'rollback.yml',
      title: '↩️ Rollback',
      trigger: 'workflow_dispatch (manual)',
      color: 'amber',
      description: 'Detecta automaticamente a versão anterior via GitHub Deployments API e faz redeploy.',
      steps: [
        'detect-version → GitHub API',
        'approve-rollback → gate humano',
        'reusable-deploy (ambiente selecionado)',
      ],
    },
    {
      file: 'sast.yml',
      title: '🔬 SAST',
      trigger: 'pull_request · schedule semanal',
      color: 'purple',
      description: 'Análise estática de segurança separada do pipeline. Não bloqueia deploys em produção.',
      steps: [
        'codeql → SAST nativo GitHub',
        'semgrep → TypeScript + OWASP rules',
        'resultados em Security → Code scanning',
      ],
    },
    {
      file: 'reusable-deploy.yml',
      title: '🔄 Reusable Deploy',
      trigger: 'workflow_call',
      color: 'blue',
      description: 'Workflow reutilizável que encapsula o ciclo completo de deploy. Usado por pipeline.yml e hotfix.yml.',
      steps: [
        'setup-deps → instala dependências',
        'generate-env-file → injeta secrets',
        'angular-build → build Angular',
        'vercel-build-output → prepara artifacts',
        'vercel-deploy → publica no Vercel',
        'register-deployment → GitHub API',
        'health-check → valida URL',
        'deploy-summary → resume no Actions',
      ],
    },
  ];

  readonly actionCategories = [
    { key: 'quality' as const, label: 'Qualidade de Código' },
    { key: 'infra' as const, label: 'Infraestrutura & Build' },
    { key: 'deploy' as const, label: 'Deploy & Vercel' },
    { key: 'release' as const, label: 'Release & Rastreabilidade' },
  ];

  readonly actions: Action[] = [
    // quality
    { name: 'ci-lint',        icon: '🔍', category: 'quality', description: 'Executa ESLint e TypeScript compiler check. Garante código limpo e tipado antes do merge.' },
    { name: 'ci-test',        icon: '🧪', category: 'quality', description: 'Roda testes unitários com cobertura. Suporta matrix de versões Node (20 e 22).' },
    { name: 'ci-security',    icon: '🔒', category: 'quality', description: 'Auditoria de dependências via npm audit. Bloqueia em HIGH e CRITICAL.' },
    // infra
    { name: 'setup-deps',     icon: '📦', category: 'infra',   description: 'Configura Node.js e instala dependências com cache inteligente via npm ci.' },
    { name: 'generate-env-file', icon: '⚙️', category: 'infra', description: 'Gera o arquivo environment.<env>.ts com os secrets do GitHub para o build Angular.' },
    { name: 'angular-build',  icon: '🏗️', category: 'infra',   description: 'Executa ng build com a configuração correta por ambiente.' },
    // deploy
    { name: 'vercel-build-output', icon: '📦', category: 'deploy', description: 'Prepara os artifacts no formato esperado pelo Vercel CLI (.vercel/output).' },
    { name: 'vercel-deploy',  icon: '🚀', category: 'deploy',  description: 'Publica no Vercel via CLI. Retorna a URL do preview/production deploy.' },
    { name: 'health-check',   icon: '🏥', category: 'deploy',  description: 'Valida que a URL do deploy retorna HTTP 200 após a publicação.' },
    { name: 'deploy-summary', icon: '📋', category: 'deploy',  description: 'Gera resumo visual do deploy (URL, versão, ambiente) como comentário no Actions.' },
    // release
    { name: 'register-deployment', icon: '📝', category: 'release', description: 'Registra o deploy na GitHub Deployments API para rastreabilidade e rollback.' },
    { name: 'snapshot-prev-version', icon: '📸', category: 'release', description: 'Captura a versão anterior via GitHub API para uso no rollback automático.' },
    { name: 'create-release', icon: '🔖', category: 'release', description: 'Cria GitHub Release com changelog gerado automaticamente a partir dos commits.' },
  ];

  readonly reusableSteps = [
    'setup-deps',
    'generate-env-file',
    'angular-build',
    'vercel-build-output',
    'vercel-deploy',
    'register-deployment',
    'health-check',
    'deploy-summary',
  ];

  readonly decisions = [
    { icon: '🌳', title: 'Trunk-Based Development', text: 'PRs vivem horas, não dias. Branch única (main) com feature flags para isolamento.' },
    { icon: '🏷️', title: 'Tags Semânticas', text: 'Tags vX.Y.Z disparam o pipeline. Semantic-release automatiza o bumping baseado em Conventional Commits.' },
    { icon: '🔄', title: 'Reusable Workflows', text: 'Deploy encapsulado em workflow_call para ter environment: e permissions: próprias.' },
    { icon: '⚡', title: 'Jobs Paralelos', text: 'lint + test + security rodam em paralelo. deploy-dev + deploy-hml também. Mais rápido.' },
    { icon: '👤', title: 'Aprovação Humana', text: 'GitHub Environments com required reviewers para deploy em PRD. Nunca deploy acidental.' },
    { icon: '🔥', title: 'Hotfix Path', text: 'Pipeline separado sem HML e sem SAST pesado para emergências — sem sacrificar qualidade básica.' },
    { icon: '🔬', title: 'SAST Separado', text: 'CodeQL e Semgrep em workflow próprio. Tags já representam código validado — SAST em tags é redundante.' },
    { icon: '↩️', title: 'Rollback Automático', text: 'Detecta versão anterior via GitHub Deployments API e reutiliza reusable-deploy.yml para redeploy.' },
  ];

  readonly tags = [
    'Angular 21', 'Vercel', 'GitHub Actions', 'Conventional Commits',
    'Semantic Release', 'SAST', 'Trunk-Based', 'TypeScript',
  ];

  getActionsByCategory(category: Action['category']): Action[] {
    return this.actions.filter(a => a.category === category);
  }
}
