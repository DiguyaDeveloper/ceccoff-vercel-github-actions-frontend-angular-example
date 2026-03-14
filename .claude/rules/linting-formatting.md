# Linting & Formatting - ESLint, Prettier, EditorConfig

## 🎯 Objetivo

Garantir que todo código siga padrões consistentes de formatação e qualidade através de ferramentas automatizadas.

---

## 🛠️ Ferramentas

### 1. Prettier - Formatação de Código

**Arquivo:** `.prettierrc`

**Responsabilidade:**
- Formatação automática de código
- Estilo consistente (indentação, quotes, semicolons)
- Suporte: TypeScript, JavaScript, JSON, Markdown, YAML

**Configurações Principais:**
```json
{
  "semi": true,                  // Sempre usar semicolons
  "trailingComma": "all",        // Trailing comma em objetos/arrays
  "singleQuote": true,           // Single quotes para strings
  "printWidth": 100,             // Máximo 100 caracteres por linha
  "tabWidth": 2,                 // 2 espaços de indentação
  "arrowParens": "always"        // Parênteses em arrow functions
}
```

**Comandos:**
```bash
# Verificar formatação
npm run format:check

# Formatar automaticamente
npm run format

# Formatar arquivos específicos
npx prettier --write "src/**/*.ts"
```

---

### 2. ESLint - Qualidade de Código

**Arquivo:** `.eslintrc.json`

**Responsabilidade:**
- Detectar problemas de código
- Enforçar boas práticas
- Type-safety adicional
- Organização de imports

**Regras Principais:**

#### TypeScript Strict
```json
{
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/explicit-function-return-type": "error",
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/strict-boolean-expressions": "error"
}
```

#### Naming Conventions
```json
{
  "@typescript-eslint/naming-convention": [
    "error",
    {
      "selector": "default",
      "format": ["camelCase"]
    },
    {
      "selector": "typeLike",
      "format": ["PascalCase"]
    },
    {
      "selector": "variable",
      "format": ["camelCase", "UPPER_CASE"]
    }
  ]
}
```

#### Import Order
```json
{
  "import/order": [
    "error",
    {
      "groups": ["builtin", "external", "internal"],
      "newlines-between": "always",
      "alphabetize": { "order": "asc" }
    }
  ]
}
```

**Comandos:**
```bash
# Verificar problemas
npm run lint

# Corrigir automaticamente
npm run lint:fix

# Verificar arquivo específico
npx eslint src/modules/auth/auth.service.ts
```

---

### 3. EditorConfig - Configuração de Editor

**Arquivo:** `.editorconfig`

**Responsabilidade:**
- Configuração consistente entre IDEs
- Indentação, line endings, charset

**Configurações:**
```ini
root = true

[*]
end_of_line = lf              # Unix-style line endings
insert_final_newline = true    # Newline no final do arquivo
charset = utf-8                # UTF-8 encoding

[*.{ts,js,json}]
indent_style = space           # Espaços (não tabs)
indent_size = 2                # 2 espaços
```

---

## 📋 Regras Detalhadas

### TypeScript - Qualidade

**Proibido `any`:**
```typescript
// ❌ ERRADO
function process(data: any): any {
  return data;
}

// ✅ CORRETO
function process<T>(data: T): T {
  return data;
}

// ✅ CORRETO (quando tipo desconhecido)
function process(data: unknown): unknown {
  return data;
}
```

**Retornos Explícitos:**
```typescript
// ❌ ERRADO
function getUser(id: string) {
  return userRepository.findById(id);
}

// ✅ CORRETO
function getUser(id: string): Promise<User | null> {
  return userRepository.findById(id);
}
```

**Promises Tratadas:**
```typescript
// ❌ ERRADO
async function example(): Promise<void> {
  doSomethingAsync(); // Floating promise!
}

// ✅ CORRETO
async function example(): Promise<void> {
  await doSomethingAsync();
}

// ✅ CORRETO (se intencionalmente fire-and-forget)
async function example(): Promise<void> {
  void doSomethingAsync();
}
```

**Boolean Expressions Stritas:**
```typescript
// ❌ ERRADO
if (user) {
  // ...
}

// ✅ CORRETO
if (user !== null && user !== undefined) {
  // ...
}

// ✅ CORRETO (com optional chaining)
if (user?.isActive === true) {
  // ...
}
```

---

### Naming Conventions

**Classes e Interfaces:**
```typescript
// ✅ CORRETO
class UserService {}
interface UserRepository {}
type UserRole = 'ADMIN' | 'USER';

// ❌ ERRADO
class userService {}
interface IUserRepository {}  // Sem prefixo I
```

**Variáveis e Funções:**
```typescript
// ✅ CORRETO
const userName = 'John';
function getUserById(id: string): User {}

// ❌ ERRADO
const UserName = 'John';
function GetUserById(id: string): User {}
```

**Constantes:**
```typescript
// ✅ CORRETO
const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const API_BASE_URL = 'https://api.example.com';

// ❌ ERRADO
const maxUploadSize = 10 * 1024 * 1024;
```

**Private Members:**
```typescript
// ✅ CORRETO
class UserService {
  private _repository: UserRepository;

  constructor(repository: UserRepository) {
    this._repository = repository;
  }
}

// ❌ ERRADO
class UserService {
  private repository: UserRepository;  // Sem underscore
}
```

---

### Import Order

**Ordem Correta:**
```typescript
// 1. Node.js builtins
import { readFile } from 'fs/promises';
import * as path from 'path';

// 2. External dependencies
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// 3. Internal (path aliases)
import { User } from '@/core/domain/entities/user.entity';
import { UserRepository } from '@/core/ports/user.repository';

// 4. Relative imports
import { UserMapper } from '../mappers/user.mapper';
import { PrismaService } from './prisma.service';
```

**Alfabetização:**
```typescript
// ✅ CORRETO (ordem alfabética)
import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

// ❌ ERRADO (desordenado)
import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
```

---

## 🚫 Regras Proibidas

### Console.log

```typescript
// ❌ ERRADO
console.log('User created:', user);

// ✅ CORRETO (usar logger)
this.logger.log('User created', { userId: user.id });

// ✅ PERMITIDO (apenas warn/error)
console.warn('Deprecated method used');
console.error('Critical error:', error);
```

### Debugger

```typescript
// ❌ ERRADO
function debug(): void {
  debugger; // ESLint error!
  // ...
}

// ✅ CORRETO (usar breakpoints do IDE)
```

### Eval

```typescript
// ❌ ERRADO
eval('const x = 10');
new Function('return 10')();

// ✅ CORRETO (não usar eval!)
```

### Var

```typescript
// ❌ ERRADO
var userName = 'John';

// ✅ CORRETO
const userName = 'John';
let userAge = 30;
```

---

## 🔗 Integração com Hooks

### Pre-commit Hook (Husky)

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Lint staged files
npx lint-staged
```

### Lint-Staged Configuration

**Arquivo:** `.lintstagedrc.json`
```json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,yml,yaml}": [
    "prettier --write"
  ]
}
```

---

## 🧪 Validação

### Scripts NPM

**Adicionar ao `package.json`:**
```json
{
  "scripts": {
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "lint:fix": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\" \"test/**/*.ts\"",
    "validate": "npm run lint && npm run format:check && npm run build"
  }
}
```

### CI/CD Validation

```yaml
# .github/workflows/lint.yml
name: Lint & Format Check

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - run: npm ci
      - run: npm run lint
      - run: npm run format:check
      - run: npm run build
```

---

## 📦 Dependências Necessárias

```bash
# ESLint + TypeScript
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# ESLint plugins
npm install -D eslint-plugin-import eslint-import-resolver-typescript

# Prettier
npm install -D prettier eslint-config-prettier

# Husky + Lint-Staged
npm install -D husky lint-staged

# Setup Husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

---

## 🎯 Workflow Recomendado

### Durante Desenvolvimento

1. **IDE Auto-Format on Save**
   - VSCode: `"editor.formatOnSave": true`
   - Usa Prettier automaticamente

2. **Lint em Tempo Real**
   - ESLint mostra erros inline
   - Corrigir antes de commitar

3. **Pre-commit Hook**
   - Husky roda lint-staged
   - Formata arquivos staged automaticamente
   - Bloqueia commit se houver erros

### Antes de PR

```bash
# Validar tudo
npm run validate

# Ou individual
npm run lint
npm run format:check
npm test
npm run build
```

---

## 🚀 AI (Claude Code) Usage

**A IA deve:**
1. ✅ Sempre rodar `npm run lint:fix` após modificar código
2. ✅ Sempre rodar `npm run format` após modificar código
3. ✅ Verificar com `npm run validate` antes de criar PR
4. ✅ Respeitar todas as regras de ESLint (nunca adicionar `eslint-disable`)
5. ✅ Usar naming conventions corretos
6. ✅ Organizar imports automaticamente

**Hooks Automáticos:**
- `.claude/hooks/format-code.sh` - Formata código automaticamente após edits
- `.claude/hooks/security-validator.py` - Valida segurança antes de writes

---

## 📚 Recursos

- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [EditorConfig](https://editorconfig.org/)

---

**Última atualização**: 2024-01-30
**Versão**: 1.0.0
