
## Correção: Impressão do Recibo em Branco

### Problema Identificado

As regras CSS de `@media print` atuais estão escondendo todo o conteúdo, incluindo o recibo, porque:

1. Os seletores CSS para Radix Portal não correspondem corretamente à estrutura real do DOM
2. O `DialogOverlay` (fundo escuro `bg-black/80`) pode estar interferindo
3. A posição `fixed` e transforms do dialog não são removidos corretamente

### Estrutura Atual do Radix Dialog

```text
<body>
  └── #root (hidden by current CSS ✓)
  └── [data-radix-portal]
        └── DialogOverlay (fixed, bg-black/80) ← PROBLEMA: pode cobrir conteúdo
        └── DialogContent (fixed, translate, z-50)
              └── #receipt-content ← O que queremos imprimir
```

### Solução

Reescrever as regras de impressão com seletores mais específicos e robustos:

1. Esconder `#root` (a aplicação principal)
2. Esconder o `DialogOverlay` explicitamente (o fundo escuro)
3. Tornar o `DialogContent` visível com posição estática
4. Garantir que `#receipt-content` seja exibido corretamente
5. Esconder botões do modal usando classe `print:hidden`

### Arquivo a Modificar

**src/index.css** - Reescrever bloco `@media print`

### Novo Codigo CSS

```css
@media print {
  /* Hide main app */
  #root {
    display: none !important;
  }
  
  /* Reset body for printing */
  body {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Hide dialog overlay (dark background) */
  [data-radix-portal] > [data-state] {
    display: none !important;
  }
  
  /* Keep portal visible and static */
  [data-radix-portal] {
    position: static !important;
    display: block !important;
  }
  
  /* Style dialog content for print */
  [data-radix-portal] [role="dialog"] {
    position: static !important;
    transform: none !important;
    max-width: none !important;
    max-height: none !important;
    width: 100% !important;
    height: auto !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
    background: white !important;
    overflow: visible !important;
  }
  
  /* Hide close button (X) on dialog */
  [data-radix-portal] [role="dialog"] > button {
    display: none !important;
  }
  
  /* Utility class for hiding elements in print */
  .print\:hidden {
    display: none !important;
  }
  
  /* Receipt content styles */
  #receipt-content {
    display: block !important;
    padding: 15mm !important;
    background: white !important;
    color: black !important;
  }
  
  /* Ensure tables and content render properly */
  #receipt-content * {
    color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  /* Page settings */
  @page {
    size: A4;
    margin: 10mm;
  }
}
```

### Mudanças Principais

| Antes | Depois |
|-------|--------|
| `body > *:not([data-radix-portal])` | `#root` - mais específico |
| Seletor genérico para overlay | `[data-radix-portal] > [data-state]` |
| Sem reset de transform | `transform: none !important` |
| Margens zero na página | `margin: 10mm` para bordas |
| Sem color-adjust | `print-color-adjust: exact` para cores |

### Resultado Esperado

- O recibo será exibido corretamente ao imprimir
- Apenas o conteúdo do recibo (modal) será impresso
- Cores de fundo de tabelas serão preservadas
- Layout limpo e profissional em formato A4
