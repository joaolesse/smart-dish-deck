
## Modernizacao UX/UI - Split View com Visual Premium

### Visao Geral

Transformar a aplicacao em um layout moderno com:
- **Split View**: Formulario a esquerda (60%) + Previa do recibo em tempo real a direita (40%)
- **Glassmorphism**: Cards com efeito de vidro fosco
- **Gradientes sutis**: Header e botoes com gradientes elegantes
- **Floating Labels**: Labels que sobem ao focar nos campos
- **Total Sticky**: Barra fixa no rodape com valor total

---

### Estrutura do Novo Layout

```text
+----------------------------------------------------------+
|                    HEADER (Gradiente)                     |
+----------------------------------------------------------+
|                                   |                       |
|   FORMULARIO (60%)                |   PREVIA (40%)        |
|   +------------------------+      |   +----------------+  |
|   | [Abas] Diarias/Desp... |      |   |   RECIBO       |  |
|   +------------------------+      |   |   (tempo real) |  |
|   |                        |      |   |                |  |
|   | Campos com             |      |   |   Atualiza     |  |
|   | Floating Labels        |      |   |   conforme     |  |
|   |                        |      |   |   digita       |  |
|   | Cards Glassmorphism    |      |   |                |  |
|   |                        |      |   +----------------+  |
|   +------------------------+      |                       |
|                                   |                       |
+----------------------------------------------------------+
|        BARRA STICKY - Total: R$ 1.500,00  [Gerar PDF]    |
+----------------------------------------------------------+
```

---

### Arquivos a Modificar

#### 1. src/index.css - Novos Estilos Base

Adicionar variaveis e classes para:
- Glassmorphism (backdrop-blur, transparencia)
- Gradientes personalizados
- Floating labels
- Sticky footer

**Novas classes**:
```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.floating-label-container { ... }
.floating-label { ... }
.sticky-footer { ... }
```

---

#### 2. src/pages/Index.tsx - Layout Split View

Reestruturar para layout de duas colunas:

```tsx
<main className="flex h-[calc(100vh-header)]">
  {/* Coluna Esquerda - Formulario */}
  <div className="w-3/5 overflow-y-auto p-6">
    <TabNavigation />
    <ReceiptInfoForm />
    {/* Secoes condicionais */}
  </div>
  
  {/* Coluna Direita - Previa Fixa */}
  <div className="w-2/5 bg-muted/30 p-6 sticky top-0">
    <ReceiptPreviewLive /> {/* Nova versao inline */}
  </div>
</main>

{/* Footer Sticky */}
<StickyTotalBar total={total} onGenerate={handlePrint} />
```

---

#### 3. src/components/ReceiptPreviewLive.tsx (NOVO)

Componente de previa inline (nao modal) que:
- Renderiza em escala reduzida (transform: scale(0.65))
- Atualiza em tempo real
- Mostra moldura de papel com sombra

---

#### 4. src/components/StickyTotalBar.tsx (NOVO)

Barra fixa no rodape:
```tsx
<div className="fixed bottom-0 left-0 right-0 glass-card border-t">
  <div className="container flex justify-between items-center py-4">
    <span>Total: <strong>R$ {total}</strong></span>
    <Button>Gerar PDF</Button>
  </div>
</div>
```

---

#### 5. src/components/ui/floating-input.tsx (NOVO)

Input com floating label:
```tsx
<div className="floating-label-container">
  <input className="peer" placeholder=" " />
  <label className="floating-label peer-placeholder-shown:top-4 peer-focus:top-0">
    Nome Completo
  </label>
</div>
```

---

#### 6. Componentes Existentes - Atualizacoes

| Arquivo | Mudanca |
|---------|---------|
| `Header.tsx` | Gradiente mais vibrante, layout compacto |
| `ReceiptInfoForm.tsx` | Usar FloatingInput, glass-card |
| `ServicesSection.tsx` | Botoes com hover gradiente |
| `ValuesSection.tsx` | Cards glass, remover total (vai pro sticky) |
| `ExpensesForm.tsx` | Cards glass, remover total |
| `AdvanceForm.tsx` | Cards glass, remover total |
| `TabNavigation.tsx` | Tabs com indicador animado |

---

### Paleta de Cores Atualizada

```css
/* Gradiente Header */
--header-gradient: linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #0284c7 100%);

/* Glassmorphism Light */
--glass-bg: rgba(255, 255, 255, 0.7);
--glass-border: rgba(255, 255, 255, 0.3);

/* Glassmorphism Dark */
--glass-bg-dark: rgba(30, 41, 59, 0.8);
--glass-border-dark: rgba(71, 85, 105, 0.4);
```

---

### Animacoes e Micro-interacoes

1. **Transicao de abas**: Fade + slide horizontal
2. **Floating labels**: Transicao suave de posicao e tamanho
3. **Cards**: Hover com elevacao e brilho sutil
4. **Sticky bar**: Aparece com slide-up ao rolar
5. **Previa**: Efeito de "papel" com sombra realista

---

### Responsividade

**Desktop (>1024px)**: Split view lado a lado
**Tablet (768-1024px)**: Previa em modal, formulario full-width
**Mobile (<768px)**: Layout vertical, previa em modal, sticky bar compacta

---

### Arquivos a Criar

1. `src/components/ReceiptPreviewLive.tsx` - Previa inline
2. `src/components/StickyTotalBar.tsx` - Barra de total fixa
3. `src/components/ui/floating-input.tsx` - Input com label flutuante

### Arquivos a Modificar

1. `src/index.css` - Estilos glassmorphism e gradientes
2. `src/pages/Index.tsx` - Layout split view
3. `src/components/Header.tsx` - Header compacto com gradiente
4. `src/components/TabNavigation.tsx` - Tabs animadas
5. `src/components/ReceiptInfoForm.tsx` - Floating labels + glass
6. `src/components/ServicesSection.tsx` - Glass cards
7. `src/components/ValuesSection.tsx` - Glass cards, sem total
8. `src/components/ExpensesForm.tsx` - Glass cards, sem total
9. `src/components/AdvanceForm.tsx` - Glass cards, sem total
10. `src/components/GenerateReceiptButton.tsx` - Mover logica para StickyTotalBar

---

### Ordem de Implementacao

1. Estilos base (CSS) - glassmorphism, gradientes
2. FloatingInput component
3. StickyTotalBar component
4. ReceiptPreviewLive component
5. Layout Split View (Index.tsx)
6. Atualizar componentes de formulario
7. Ajustes de responsividade
8. Testes e polimento

---

### Resultado Final

Uma interface moderna e profissional que:
- Mostra a previa do recibo em tempo real enquanto o usuario preenche
- Usa efeitos visuais premium (glassmorphism, gradientes)
- Mantem o total sempre visivel
- Proporciona feedback visual imediato
- Funciona bem em todos os dispositivos
