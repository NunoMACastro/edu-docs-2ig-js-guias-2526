![Header](../Images/Header.png)

# [7] Box Model, Unidades e Display (11.º ano)

## 0) Objetivo do capítulo

Controlar tamanho e espaçamento de elementos para layouts previsíveis.

## No fim deste capítulo consegues...

- Explicar `content`, `padding`, `border` e `margin`.
- Aplicar reset mínimo com `box-sizing` correto.
- Identificar colapso de margens no DevTools.

## Vocabulário mínimo

- `box model`: modelo de caixa dos elementos.
- `box-sizing`: como largura/altura são calculadas.
- `colapso de margens`: fusão de margens verticais adjacentes.
- `display`: forma de renderização do elemento.
- `overflow`: comportamento quando conteúdo excede a caixa.

## 1) Exemplo A (base)

```css
html,
body {
  margin: 0;
  padding: 0;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
}

.cartao {
  padding: 16px;
  border: 1px solid #d1d5db;
  margin-bottom: 12px;
}
```

## 2) Exemplo B (armadilha comum: colapso de margens)

Problema:

```css
.cartao h2 {
  margin-top: 24px;
}
```

Se o `h2` for o primeiro filho, a margem pode "subir" para fora do cartão.

Correção:

```css
.cartao {
  padding-top: 1px; /* ou display: flow-root; */
}

.cartao h2 {
  margin-top: 24px;
}
```

## 3) Ponte rápida para layout

- `display: flex` para alinhamento numa direção.
- `display: grid` para grelha em duas dimensões.

## Checkpoint visual

- O `body` encosta ao topo sem margem padrão.
- Cartões têm caixa previsível e espaçamento consistente.

## DevTools: onde olhar

- `Layout`/`Computed`: verifica dimensões da caixa.
- `Styles`: confirma `box-sizing: border-box` herdado.
- Inspeciona margens no overlay para ver colapso.

## Erros comuns

1. Esquecer reset de margem em `body`.
2. Definir largura sem considerar `padding` e `border`.
3. Tentar resolver colapso de margens com valores arbitrários.

## Exercícios em escada

### Exercício A (guiado)

Aplica reset + `box-sizing` global.

Resultado esperado:

- Layout inicial previsível em todos os blocos.

### Exercício B (intermédio)

Cria 3 cartões e ajusta espaçamento consistente.

Resultado esperado:

- Cartões com larguras e margens estáveis.

### Exercício C (aplicação)

Monta uma secção com cartões e testa `overflow: auto` num bloco de texto longo.

Resultado esperado:

- Conteúdo excedente controlado sem quebrar layout.

## Changelog

- v1.0.1 - Reset mínimo e `box-sizing` com pseudo-elementos adicionados; colapso de margens documentado.
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
