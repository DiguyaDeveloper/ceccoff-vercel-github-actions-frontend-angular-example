## 📝 Descrição

<!-- O que este PR faz? Por que é necessário? -->

## 🔗 Issue relacionada

<!-- Fixes #000 | Closes #000 | Related to #000 -->

---

## 🎯 Tipo de mudança

<!-- Marque com [x] o tipo correto. O título do PR deve refletir o mesmo tipo. -->

- [ ] `feat` — Nova funcionalidade
- [ ] `fix` — Correção de bug
- [ ] `refactor` — Refatoração (sem nova feature ou bug fix)
- [ ] `perf` — Melhoria de performance
- [ ] `test` — Testes (adicionar ou corrigir)
- [ ] `ci` — CI/CD ou build
- [ ] `docs` — Documentação
- [ ] `chore` — Manutenção, deps, configuração
- [ ] `style` — Formatação (sem mudança de lógica)

---

## 🧪 Como testar

<!-- Passos para validar a mudança localmente -->

1.
2.
3.

---

## ✅ Checklist

### Código
- [ ] Self-review feito — revisei meu próprio código antes de solicitar review
- [ ] Nenhum `console.log` ou código de debug esquecido
- [ ] Sem secrets ou credenciais no código
- [ ] Cobertura de testes mantida (`npm run test:ci`)
- [ ] Lint passando (`npm run lint`)

### Angular
- [ ] Componentes novos usam `changeDetection: ChangeDetectionStrategy.OnPush`
- [ ] Componentes novos são `standalone: true`
- [ ] Usado `@if` / `@for` (não `*ngIf` / `*ngFor`)
- [ ] Subscriptions gerenciadas com `takeUntilDestroyed` ou `toSignal`

### Deploy
- [ ] Funciona em DEV após merge (health check verde)
- [ ] Variáveis de ambiente necessárias documentadas (se aplicável)
- [ ] Breaking changes documentados abaixo (se aplicável)

---

## 💥 Breaking Changes

<!-- Se não há breaking changes, remova esta seção -->

**Antes:**
```
```

**Depois:**
```
```

**Migração necessária:**

---

## 📸 Screenshots

<!-- Se a mudança afeta a UI, adicione antes/depois -->
