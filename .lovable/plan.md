
## Correção: Imprimir Apenas Uma Via do Recibo

### Problema Identificado

Ao clicar em "Imprimir / Salvar PDF", o comando `window.print()` imprime toda a página visível, incluindo:
- Header da aplicação
- Formulário (coluna esquerda)
- Prévia ao vivo (coluna direita)
- Modal de prévia (o recibo real)
- Barra de total fixa

Isso gera a impressão de múltiplas "vias" do recibo porque há várias representações dele na tela.

### Solução

Adicionar regras de `@media print` no CSS para:
1. Esconder todos os elementos da interface (header, formulário, sticky bar, etc.)
2. Exibir apenas o conteúdo do recibo dentro do modal
3. Ajustar o layout para ocupar a página inteira de forma limpa

### Arquivo a Modificar

**src/index.css** - Adicionar bloco de estilos para impressão no final do arquivo

### Codigo a Adicionar

```css
/* Print Styles */
@media print {
  /* Hide all UI elements */
  body > *:not([data-radix-portal]) {
    display: none !important;
  }
  
  /* Hide dialog overlay and buttons */
  [data-radix-portal] [data-state] > div:first-child,
  .print\\:hidden {
    display: none !important;
  }
  
  /* Show only the receipt content */
  [data-radix-portal] {
    position: static !important;
  }
  
  [data-radix-portal] [role="dialog"] {
    position: static !important;
    max-width: none !important;
    max-height: none !important;
    width: 100% !important;
    height: auto !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
    overflow: visible !important;
    background: white !important;
  }
  
  /* Receipt content styles */
  #receipt-content {
    padding: 20mm !important;
    background: white !important;
  }
  
  /* Page settings */
  @page {
    size: A4;
    margin: 0;
  }
}
```

### Resultado Esperado

- Ao imprimir, apenas o conteúdo do recibo (dentro do modal) sera visivel
- Header, formulario, previa ao vivo e barra sticky serao ocultados
- Uma unica via do recibo sera gerada
- Layout otimizado para formato A4
