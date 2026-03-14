# Git Conventions - Commits, Branches & Pull Requests

## 🎯 Objetivo

Definir padrões claros de Git para permitir que a IA (Claude Code) trabalhe de forma autônoma e profissional no repositório.

---

## 📝 Conventional Commits

### Formato Obrigatório

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types (Obrigatório)

| Type | Descrição | Quando Usar |
|------|-----------|-------------|
| `feat` | Nova funcionalidade | Adicionar nova feature |
| `fix` | Correção de bug | Corrigir bug existente |
| `docs` | Documentação | Apenas mudanças em docs |
| `style` | Formatação | Mudanças que não afetam código (espaços, vírgulas) |
| `refactor` | Refatoração | Mudança de código sem adicionar feature ou fix |
| `perf` | Performance | Melhorias de performance |
| `test` | Testes | Adicionar ou corrigir testes |
| `build` | Build/Dependencies | Mudanças no sistema de build ou deps |
| `ci` | CI/CD | Mudanças em arquivos de CI |
| `chore` | Manutenção | Outras mudanças que não modificam src ou test |
| `revert` | Reverter | Reverte commit anterior |

### Scopes (Opcional mas Recomendado)

| Scope | Descrição |
|-------|-----------|
| `auth` | Autenticação/Autorização |
| `user` | Módulo de usuários |
| `post` | Módulo de posts |
| `database` | Migrations, schema |
| `api` | Endpoints, controllers |
| `core` | Domain/Use cases |
| `infra` | Infrastructure |
| `config` | Configurações |
| `deps` | Dependências |

### Subject (Obrigatório)

**Regras:**
- ✅ Máximo 72 caracteres
- ✅ Iniciar com minúscula
- ✅ Não terminar com ponto
- ✅ Usar imperativo ("add" não "added" ou "adds")
- ✅ Ser específico e descritivo

**Exemplos:**
```bash
# ✅ BOM
feat(auth): add JWT refresh token functionality
fix(user): resolve email validation error
docs(api): update swagger documentation for users endpoint

# ❌ RUIM
feat: add stuff
fix: fixed bug
Update docs
```

### Body (Opcional mas Recomendado para mudanças complexas)

**Quando incluir:**
- Explicar o "porquê" da mudança
- Descrever o que estava acontecendo antes
- Detalhar a solução implementada

**Formato:**
- Quebrar linha em 72 caracteres
- Separar do subject com linha em branco
- Usar bullet points quando apropriado

**Exemplo:**
```
feat(auth): add JWT refresh token functionality

- Implement refresh token generation
- Add refresh token endpoint
- Store refresh tokens in database with expiration
- Validate refresh tokens on use

This allows users to stay authenticated without re-logging
when their access token expires.
```

### Footer (Opcional)

**Breaking Changes:**
```
feat(api)!: change user endpoint response format

BREAKING CHANGE: user endpoint now returns nested object
instead of flat structure. Update clients accordingly.
```

**Issue References:**
```
fix(auth): resolve login timeout issue

Fixes #123
Closes #456
Related to #789
```

---

## 🌿 Branch Naming

### Formato

```
<type>/<scope>-<short-description>
```

### Exemplos

```bash
# Features
feat/auth-jwt-refresh
feat/user-profile-upload
feat/post-comments

# Fixes
fix/auth-token-expiration
fix/user-email-validation
fix/database-migration-error

# Chores
chore/update-dependencies
chore/setup-docker
chore/configure-eslint

# Docs
docs/api-documentation
docs/setup-guide
```

### Regras

- ✅ Usar kebab-case (hífens)
- ✅ Ser descritivo mas conciso
- ✅ Incluir número da issue quando aplicável: `feat/123-add-user-profile`
- ❌ Não usar `_` underscores
- ❌ Não usar espaços

---

## 🔀 Workflow Git

### 1. Criar Branch

```bash
# Partir sempre de main atualizado
git checkout main
git pull origin main

# Criar nova branch
git checkout -b feat/user-authentication
```

### 2. Fazer Mudanças e Commits

```bash
# Fazer mudanças no código

# Staged específico (preferir ao git add .)
git add src/modules/auth/auth.service.ts
git add src/modules/auth/auth.controller.ts

# Commit seguindo Conventional Commits
git commit -m "feat(auth): add JWT authentication service

- Implement JwtService with sign/verify methods
- Add authentication guard
- Configure JWT module with secret and expiration
- Add unit tests for auth service

Resolves #45"
```

### 3. Push e Pull Request

```bash
# Push branch
git push origin feat/user-authentication

# Criar PR (via GitHub CLI ou interface)
gh pr create --title "feat(auth): add JWT authentication" \
             --body "$(cat .github/PR_BODY.md)"
```

---

## 📋 Pull Request Template

### Estrutura Obrigatória

```markdown
## 📝 Descrição

[Descreva as mudanças de forma clara e concisa]

## 🎯 Tipo de Mudança

- [ ] 🐛 Bug fix (mudança que corrige um issue)
- [ ] ✨ Nova feature (mudança que adiciona funcionalidade)
- [ ] 💥 Breaking change (fix ou feature que quebra funcionalidade existente)
- [ ] 📝 Documentação (mudanças apenas em documentação)
- [ ] 🎨 Style (formatação, missing semi colons, etc; sem mudança de código)
- [ ] ♻️ Refactor (refatoração de código sem adicionar feature ou fix)
- [ ] ⚡ Performance (mudanças que melhoram performance)
- [ ] ✅ Test (adicionar ou corrigir testes)
- [ ] 🔧 Chore (mudanças no build, CI, deps, etc.)

## 🔗 Issue Relacionada

Closes #[número]
Fixes #[número]
Related to #[número]

## 🧪 Como Testar

1. Checkout desta branch: `git checkout feat/user-authentication`
2. Instalar dependências: `npm install`
3. Rodar testes: `npm test`
4. [Passos específicos para testar a funcionalidade]

## 📸 Screenshots (se aplicável)

[Adicionar screenshots ou GIFs demonstrando a mudança]

## ✅ Checklist

### Código
- [ ] Código segue as convenções do projeto
- [ ] Realizei self-review do meu código
- [ ] Comentei código em áreas complexas
- [ ] Minhas mudanças não geram novos warnings
- [ ] Adicionei testes que provam que meu fix funciona ou feature está correta
- [ ] Testes unitários passam localmente: `npm test`
- [ ] Testes E2E passam localmente: `npm run test:e2e`

### Documentação
- [ ] Atualizei a documentação relevante
- [ ] Atualizei Swagger/OpenAPI docs (se mudou API)
- [ ] Atualizei CHANGELOG.md

### Segurança
- [ ] Sem secrets commitados (API keys, passwords, etc.)
- [ ] Inputs de usuário validados
- [ ] Queries parametrizadas (sem SQL injection)
- [ ] Autenticação/Autorização implementada quando necessário

### Performance
- [ ] Queries de banco otimizadas
- [ ] Sem N+1 queries
- [ ] Índices adicionados quando necessário
- [ ] Caching implementado onde faz sentido

### Database
- [ ] Migrations criadas (se aplicável)
- [ ] Migrations testadas localmente (up e down)
- [ ] Seed data atualizado (se necessário)

## 🚀 Deploy

- [ ] Pronto para deploy em staging
- [ ] Pronto para deploy em produção
- [ ] Requer migração de banco de dados
- [ ] Requer atualização de variáveis de ambiente
- [ ] Requer atualização de documentação externa

## 💡 Notas Adicionais

[Qualquer informação adicional que revisores devem saber]

## 👥 Revisores Sugeridos

@[username]

---

**Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>**
```

---

## 🤖 Skills para Git

### `/commit` - Criar Commit Automaticamente

**Uso:**
```bash
/commit "descrição opcional"
```

**O que faz:**
1. Analisa mudanças com `git diff` e `git status`
2. Identifica tipo de mudança (feat, fix, etc.)
3. Identifica scope (auth, user, etc.)
4. Gera mensagem seguindo Conventional Commits
5. Cria commit com Co-Authored-By

### `/create-pr` - Criar Pull Request

**Uso:**
```bash
/create-pr
```

**O que faz:**
1. Analisa commits da branch
2. Analisa mudanças no código
3. Gera título seguindo Conventional Commits
4. Preenche template de PR automaticamente
5. Identifica issues relacionadas
6. Lista passos de teste
7. Preenche checklist baseado nas mudanças
8. Cria PR via `gh` CLI

---

## 📊 Exemplos Completos

### Exemplo 1: Feature Nova

**Branch:**
```bash
git checkout -b feat/user-profile-upload
```

**Commits:**
```bash
git commit -m "feat(user): add profile image upload endpoint

- Create POST /users/:id/avatar endpoint
- Implement file validation (type, size)
- Store files in S3 bucket
- Add avatar URL to user entity
- Add tests for upload functionality

Implements #123"

git commit -m "docs(api): add avatar upload to swagger docs"

git commit -m "test(user): add E2E tests for avatar upload"
```

**PR Title:**
```
feat(user): add profile image upload functionality
```

---

### Exemplo 2: Bug Fix

**Branch:**
```bash
git checkout -b fix/auth-token-expiration
```

**Commit:**
```bash
git commit -m "fix(auth): correct JWT token expiration validation

The token expiration was not being validated correctly,
allowing expired tokens to pass authentication.

- Fix expiration check in JwtStrategy
- Add unit tests for expired token scenario
- Update auth guard to handle expired tokens properly

Fixes #456"
```

**PR Title:**
```
fix(auth): correct JWT token expiration validation
```

---

### Exemplo 3: Breaking Change

**Branch:**
```bash
git checkout -b feat/api-v2-structure
```

**Commit:**
```bash
git commit -m "feat(api)!: restructure user response format

BREAKING CHANGE: User endpoint response changed from flat
structure to nested object with profile data separated.

Before:
{
  "id": "123",
  "name": "John",
  "bio": "Developer"
}

After:
{
  "id": "123",
  "name": "John",
  "profile": {
    "bio": "Developer"
  }
}

Clients must update to handle new response structure.

Closes #789"
```

---

## 🔍 Validação de Commits

### Git Hook (commit-msg)

```bash
# .git/hooks/commit-msg
#!/bin/bash

commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

# Conventional Commits regex
commit_regex='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .{1,72}'

if ! echo "$commit_msg" | grep -qE "$commit_regex"; then
    echo "❌ Commit message inválida!"
    echo ""
    echo "Formato correto:"
    echo "  <type>(<scope>): <subject>"
    echo ""
    echo "Exemplo:"
    echo "  feat(auth): add JWT authentication"
    echo ""
    echo "Types válidos:"
    echo "  feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert"
    exit 1
fi

echo "✅ Commit message válida"
```

---

## 📚 Recursos

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Git Best Practices](https://www.git-scm.com/book/en/v2)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

## ✅ Checklist de Commits

Antes de commitar:

- [ ] Mudanças testadas localmente
- [ ] Testes passando (`npm test`)
- [ ] Lint passando (`npm run lint`)
- [ ] Sem `console.log` ou debug code
- [ ] Sem secrets ou credenciais
- [ ] Commit message segue Conventional Commits
- [ ] Scope correto identificado
- [ ] Subject claro e descritivo

---

**Última atualização**: 2024-01-30
**Versão**: 1.0.0
**Seguindo**: Conventional Commits 1.0.0
