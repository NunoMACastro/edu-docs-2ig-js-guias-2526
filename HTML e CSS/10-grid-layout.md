![Header](../Images/Header.png)

# [10] CSS Grid para Grelhas (11.º ano)

## 0) Objetivo do capítulo

Construir layouts em duas dimensões com Grid de forma clara e escalável.

## No fim deste capítulo consegues...

- Definir áreas com `grid-template-areas`.
- Evitar efeitos colaterais com scoping de seletores.
- Montar um layout completo com header, sidebar, main e footer.

## Vocabulário mínimo

- `grid container`: elemento com `display: grid`.
- `grid item`: filho direto do container.
- `grid-template-areas`: mapa visual de áreas.
- `gap`: espaço entre linhas/colunas.
- `scoping`: limitar regras ao contexto certo.

## 1) Exemplo A (base completo com scoping)

```html
<div class="layout container">
  <header class="cartao">Header</header>
  <aside class="cartao">Sidebar</aside>
  <main class="cartao">Conteúdo principal</main>
  <footer class="cartao">Footer</footer>
</div>
```

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "aside main"
    "footer footer";
  grid-template-columns: 240px 1fr;
  gap: 12px;
}

.layout > header {
  grid-area: header;
}

.layout > aside {
  grid-area: aside;
}

.layout > main {
  grid-area: main;
}

.layout > footer {
  grid-area: footer;
}

@media (max-width: 768px) {
  .layout {
    grid-template-areas:
      "header"
      "main"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
}
```

## 2) Exemplo B (armadilha comum)

Problema:

```css
header {
  grid-area: header;
}
```

Isto afeta qualquer `header` da página. Usa scoping:

```css
.layout > header {
  grid-area: header;
}
```

## Checkpoint visual

- Desktop: header em cima, sidebar à esquerda, main à direita, footer em baixo.
- Mobile: áreas empilhadas numa coluna.

## DevTools: onde olhar

- `Layout`: ativa overlay de Grid e vê áreas.
- `Styles`: confirma `grid-template-areas` ativa em cada breakpoint.

## Erros comuns

1. Definir áreas no CSS sem elementos correspondentes no HTML.
2. Esquecer `gap` e ficar com blocos colados.
3. Usar seletores globais (`header`, `main`) sem contexto.

## Exercícios em escada

### Exercício A (guiado)

Cria layout Grid com 4 áreas (header, aside, main, footer).

Resultado esperado:

- Estrutura visual igual ao mapa de áreas.

### Exercício B (intermédio)

Adiciona media query para empilhar o layout em mobile.

Resultado esperado:

- Ordem lógica e legível em ecrãs pequenos.

### Exercício C (aplicação)

Constrói dashboard simples com cartões no `main` usando grid interno.

Resultado esperado:

- Layout principal e secundário coesos.

## Changelog

- v1.0.1 - Scoping obrigatório com `.layout > ...` e exemplo completo com `grid-template-areas`.
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
