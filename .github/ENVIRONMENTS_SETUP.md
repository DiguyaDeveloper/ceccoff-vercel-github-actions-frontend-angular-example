# 🏗️ Configuração dos Environments — GitHub Actions

Guia completo para configurar os environments e secrets necessários para o pipeline CI/CD do Ceccoff Frontend.

---

## 📋 Environments Necessários

O pipeline usa **7 environments** no GitHub. Acesse em:
**Repository → Settings → Environments**

| Environment        | Tipo         | Uso                                            | Reviewers?  |
|--------------------|--------------|------------------------------------------------|-------------|
| `dev`              | Deployment   | Aprovar deploy em DEV                          | Sim (1+)    |
| `hml`              | Deployment   | Aprovar deploy em HML                          | Sim (1+)    |
| `hml-verify`       | Gate         | ✅ Finalizar HML / liberar PRD                 | Sim (1+)    |
| `prd`              | Deployment   | Aprovar deploy em PRD                          | Sim (2+)    |
| `prd-verify`       | Gate         | 🎯 Finalizar com Sucesso / Aprovar Rollback    | Sim (2+)    |
| `rollback-hml`     | Gate         | 🔐 Autorizar rollback em HML                  | Sim (1+)    |
| `rollback-prd`     | Gate         | 🔐 Autorizar rollback em PRD (crítico!)        | Sim (2+)    |

---

## ⚙️ Como Criar Cada Environment

### 1. Acessar configurações
```
GitHub → seu-repo → Settings → Environments → New environment
```

### 2. Configurações recomendadas por environment

#### `dev`
- **Required reviewers:** 1 (qualquer dev do time)
- **Wait timer:** Não necessário
- **Deployment branches:** `main` e `v*` tags

#### `hml`
- **Required reviewers:** 1 (dev ou QA)
- **Wait timer:** Não necessário
- **Deployment branches:** `main` e `v*` tags

#### `hml-verify` ← O botão "✅ Aprovar HML / Liberar PRD"
- **Required reviewers:** 1 (QA obrigatório)
- **Wait timer:** Não necessário
- **Deployment branches:** `main` e `v*` tags

> ⚠️ Este é o gate que libera o deploy em PRD.
> Ao **aprovar** aqui, o deploy em PRD é iniciado.
> Para **rollback**, rejeite e execute o workflow `↩️ Rollback` com ambiente `hml`.

#### `prd`
- **Required reviewers:** 2 (Tech Lead + outra pessoa)
- **Wait timer:** 5 minutos (segurança extra)
- **Deployment branches:** apenas `v*` tags

#### `prd-verify` ← O botão "🎯 Finalizar com Sucesso"
- **Required reviewers:** 1 (Tech Lead ou responsável pelo deploy)
- **Wait timer:** Não necessário
- **Deployment branches:** `main` e `v*` tags

> ⚠️ Este é o gate final do ciclo.
> Ao **aprovar** aqui = **FINALIZAR COM SUCESSO** ✅
> Para **rollback**, rejeite e execute o workflow `↩️ Rollback` com ambiente `prd`.

#### `rollback-hml`
- **Required reviewers:** 1 (Tech Lead ou QA)
- **Wait timer:** Não necessário
- **Deployment branches:** `main`

#### `rollback-prd` ← Gate crítico
- **Required reviewers:** 2 (Tech Lead obrigatório)
- **Wait timer:** Não necessário
- **Deployment branches:** `main`

---

## 🔑 Secrets Necessários

Configure em: **Repository → Settings → Secrets and variables → Actions**

| Secret               | Descrição                                | Como obter                            |
|----------------------|------------------------------------------|---------------------------------------|
| `VERCEL_TOKEN`       | Token de API do Vercel                   | Vercel → Settings → Tokens            |
| `VERCEL_ORG_ID`      | ID da organização no Vercel              | `vercel link` no terminal             |
| `VERCEL_PROJECT_ID`  | ID do projeto no Vercel                  | `vercel link` no terminal             |

### Como obter os IDs do Vercel

```bash
# Instalar Vercel CLI localmente
npm i -g vercel

# Fazer login
vercel login

# Linkar projeto (cria .vercel/project.json)
vercel link

# Os IDs estarão em:
cat .vercel/project.json
# { "orgId": "VERCEL_ORG_ID", "projectId": "VERCEL_PROJECT_ID" }
```

---

## 🌿 Estratégia de Branches (Trunk-Based)

```
main ──────────────────────────────────────────────► (produção)
  │
  ├── feat/xxx  →  PR  →  merge em main
  ├── fix/xxx   →  PR  →  merge em main
  │
  └── Tags semânticas:
        v1.0.0  →  dispara pipeline completo
        v1.0.1  →  hotfix
        v1.1.0  →  minor release
        v2.0.0  →  major release
```

### Criar uma release

```bash
# Commit final em main
git checkout main
git pull origin main

# Criar tag semântica
git tag -a v1.2.0 -m "release: v1.2.0 — adiciona feature X"

# Push da tag (dispara o pipeline)
git push origin v1.2.0
```

---

## 🔄 Fluxo Completo do Pipeline

```
Push de tag v1.x.x
       │
       ▼
  📦 BUILD
  (lint + tests + build + upload artefato)
       │
       ├─────────────────────────────────────────────────────┐
       │                                                     │
       ▼                                                     ▼
  🔵 DEPLOY DEV                                    🟡 DEPLOY HML
  (independente)                                   (independente de DEV)
  Requires: environment "dev"                      Requires: environment "hml"
  Skippable: skip_dev=true                         Skippable: skip_hml=true
       │                                                     │
       ▼                                                     ▼
  [DEV ao vivo]                              ✅ VERIFICAÇÃO HML
                                             Requires: environment "hml-verify"
                                             ✅ Aprovar → libera PRD
                                             ❌ Rejeitar → execute Rollback
                                                          │
                                                          ▼
                                                  🔴 DEPLOY PRD
                                                  Requires: environment "prd"
                                                  Depends on: verify-hml
                                                          │
                                                          ▼
                                                🎯 VERIFICAÇÃO PRD
                                                Requires: environment "prd-verify"
                                                ✅ Aprovar = FINALIZAR COM SUCESSO
                                                ❌ Rejeitar = execute Rollback PRD
```

---

## ↩️ Fluxo de Rollback

```
Problema detectado em HML ou PRD
       │
       ▼
  Aba Actions → ↩️ Rollback → Run workflow
       │
       ├── environment: hml ou prd
       ├── strategy: tag-anterior | tag-especifica | url-vercel
       ├── target_tag: v1.1.0 (se tag-especifica)
       ├── vercel_url: xxx.vercel.app (se url-vercel, só PRD)
       └── reason: "Motivo do rollback" (obrigatório)
       │
       ▼
  🔍 VALIDAÇÃO (automático)
       │
       ▼
  🔐 APROVAÇÃO
  Requires: environment "rollback-hml" ou "rollback-prd"
       │
       ▼
  ↩️ ROLLBACK (build + deploy versão anterior + health check)
```

### Estratégias de rollback disponíveis

| Estratégia       | Quando usar                                | Observação                   |
|------------------|--------------------------------------------|------------------------------|
| `tag-anterior`   | Rollback rápido para a versão imediatamente anterior | Detectado automaticamente |
| `tag-especifica` | Rollback para versão específica (ex: `v1.5.2`) | Informe `target_tag`      |
| `url-vercel`     | Promover deployment Vercel já existente (sem rebuild) | Só para PRD, mais rápido |

---

## 📊 Leitura dos Reports

Todos os jobs geram um **Job Summary** visível em:
**GitHub → Actions → [execução] → [job] → Summary**

Os reports incluem:
- 🏷️ Versão e SHA deployados
- 🔗 URL do ambiente
- 🏥 Status do health check
- 👤 Quem aprovou
- 📅 Timestamp

---

## ✅ Checklist de Setup

```
[ ] Environments criados (7 no total)
[ ] Reviewers configurados em cada environment
[ ] Secrets adicionados (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
[ ] Vercel project linkado aos environments corretos
[ ] Primeira tag criada e pipeline testado
[ ] Time informado sobre o fluxo de aprovações
```

---

## 🔧 Personalização

### Ajustar timeout de aprovação
Em cada environment, configure **"Wait timer"** (minutos) para expirar automaticamente se ninguém aprovar.

### Adicionar notificações (Slack/Teams)
Adicione um step ao final de cada job no `pipeline.yml`:

```yaml
- name: 📣 Notificação Slack
  if: always()
  uses: slackapi/slack-github-action@v2
  with:
    webhook: ${{ secrets.SLACK_WEBHOOK }}
    webhook-type: incoming-webhook
    payload: |
      {
        "text": "${{ job.status == 'success' && '✅' || '❌' }} Deploy ${{ inputs.environment }} — ${{ needs.build.outputs.version }}"
      }
```

### Adicionar variáveis de ambiente por ambiente
Em cada environment no GitHub, configure **"Environment variables"** além dos secrets.
