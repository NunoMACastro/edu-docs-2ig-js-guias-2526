![Header](../Images/Header.png)

# [9] Flexbox para Layout Moderno (11.º ano)

## 0) Objetivo do capítulo

Criar layouts flexíveis em uma dimensão para barras, listas e cartões com wrap.

## No fim deste capítulo consegues...

- Controlar direção com `flex-direction`.
- Distribuir itens com `justify-content`, `align-items` e `align-content`.
- Construir padrões reais: navbar e grelha de cartões com wrap.

## Vocabulário mínimo

- `main axis`: eixo principal do Flexbox.
- `cross axis`: eixo secundário.
- `flex-wrap`: permite quebrar linha.
- `align-content`: distribui linhas quando há wrap.
- `flex-basis`: tamanho base de cada item.

## 1) Exemplo A (padrão navbar)

```html
<header class="barra">
  <div class="container barra__conteudo">
    <strong>11.º IG</strong>
    <nav class="barra__menu">
      <a href="#inicio">Início</a>
      <a href="#tarefas">Tarefas</a>
      <a href="#contactos">Contactos</a>
    </nav>
  </div>
</header>
```

```css
.barra {
  border-bottom: 1px solid #d1d5db;
}

.barra__conteudo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}

.barra__menu {
  display: flex;
  gap: 12px;
}

@media (max-width: 640px) {
  .barra__conteudo {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

## 2) Exemplo A2 (padrão grelha com wrap)

```html
<section class="container grelha-flex">
  <article class="cartao">Cartão A</article>
  <article class="cartao">Cartão B</article>
  <article class="cartao">Cartão C</article>
  <article class="cartao">Cartão D</article>
</section>
```

```css
.grelha-flex {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 12px;
}

.grelha-flex .cartao {
  flex: 1 1 220px;
}
```

Nota: `align-content` só tem efeito quando existem múltiplas linhas (`flex-wrap: wrap`).

## 3) Exemplo B (armadilha comum)

Problema: tentar alinhar itens no filho, não no contentor.

Correção: aplicar regras de alinhamento no elemento com `display: flex`.

## Checkpoint visual

- Navbar em linha no desktop e em coluna no mobile.
- Cartões quebram linha sem sobreposição.

## DevTools: onde olhar

- `Layout`: ativa overlay de Flexbox para ver eixos.
- `Styles`: testa `flex-direction` e `wrap` ao vivo.
- Redimensiona viewport e confirma mudança de direção.

## Erros comuns

1. Esquecer `flex-wrap` e forçar overflow horizontal.
2. Usar `width` fixa em todos os cartões.
3. Confundir `align-items` com `align-content`.

## Exercícios em escada

### Exercício A (guiado)

Cria navbar flex com logo e menu.

Resultado esperado:

- Conteúdo alinhado e legível em desktop.

### Exercício B (intermédio)

Converte navbar para coluna em mobile com media query.

Resultado esperado:

- Menu empilhado abaixo de 640px.

### Exercício C (aplicação)

Cria secção com 6 cartões usando `flex-wrap` + `flex-basis`.

Resultado esperado:

- Layout adaptável sem quebra visual.

## Changelog

- v1.0.1 - `flex-direction` e `align-content` documentados; padrões completos de navbar e grelha com wrap.
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
