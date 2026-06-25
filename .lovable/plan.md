## Problema

Cada etapa do formulário (Steps 1, 2, 3 e 5) é um elemento `<form>` com `onSubmit`. O GTM possui um listener nativo (`gtm.formSubmit`) que dispara automaticamente a cada `submit` de qualquer `<form>` na página. Por isso o evento "envio de formulário de lead" é disparado a cada avanço de etapa, e não apenas no envio final.

O `dataLayer.push({ event: 'form_submission' })` que existe no código só roda uma vez (no Step 5 final) — os disparos extras vêm do trigger automático do GTM em cima dos `<form>` intermediários.

## Solução (somente no código)

Remover o uso de `<form>` nas etapas intermediárias para que o GTM não detecte submissões nativas. A navegação continua igual, via clique no botão "CONTINUAR".

### Mudanças

1. **`src/components/FormStep1.tsx`**
   - Trocar `<form onSubmit={handleSubmit}>` por `<div>`.
   - Botão "ENVIAR" passa de `type="submit"` para `type="button"` com `onClick={handleSubmit}`.
   - Ajustar `handleSubmit` para não depender de `e.preventDefault()` (assinatura sem evento).
   - Manter envio com Enter: adicionar `onKeyDown` nos inputs chamando `handleSubmit` quando `Enter`.

2. **`src/components/FormStep2.tsx`**
   - Mesma conversão: `<form>` → `<div>`, botão "CONTINUAR" como `type="button" onClick`.

3. **`src/components/FormStep3.tsx`**
   - Mesma conversão.

4. **`src/components/FormStep5.tsx` (etapa final)**
   - Também converter `<form>` → `<div>` e botão final para `type="button" onClick={handleSubmit}`.
   - Manter o `dataLayer.push({ event: 'form_submission', ... })` já existente em `HeroSection.handleSubmit` — esse passa a ser o **único** evento de envio de lead enviado ao GTM.

### Resultado esperado

- Avançar entre etapas não dispara mais `gtm.formSubmit`.
- O GTM recebe apenas o evento customizado `form_submission` no envio final.
- Se o usuário hoje usa o trigger "Form Submission" (All Forms) no GTM para marcar o lead, ele precisará trocar pelo trigger de **Custom Event** com nome `form_submission` (não é uma mudança de código — apenas configuração no painel do GTM).

## Observações

- Nenhuma mudança no backend, no edge function `send-to-sheets` ou no webhook do n8n.
- Validações de cada etapa (telefone, mínimo de 1 vida, etc.) continuam funcionando, apenas chamadas a partir do `onClick` do botão.
