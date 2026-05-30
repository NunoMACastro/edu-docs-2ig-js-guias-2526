![Header](../Images/Header.png)

# [2] HTML Semântico e Estrutura (11.º ano)

## 0) Objetivo do capítulo

Construir páginas com semântica clara para facilitar acessibilidade, manutenção e manipulação pelo DOM.

## No fim deste capítulo consegues...

- Estruturar uma página com `header`, `main`, `section`, `article` e `footer`.
- Organizar corretamente hierarquia de títulos.
- Identificar quando usar `div` e `span` sem destruir semântica.

## Vocabulário mínimo

- `semântico`: tag com significado estrutural.
- `hierarquia de títulos`: ordem lógica de `h1` a `h6`.
- `contentor`: elemento que agrupa outros.
- `navegação interna`: links para secções da mesma página.
- `acessibilidade`: facilidade de uso para diferentes perfis.

## 1) Exemplo A (base)

```html
<body>
  <header class="barra container">
    <h1>Portal da Turma</h1>
    <nav>
      <a href="#avisos">Avisos</a>
      <a href="#recursos">Recursos</a>
    </nav>
  </header>

  <main class="container">
    <section id="avisos" class="cartao">
      <h2>Avisos</h2>
      <p>Entrega do trabalho na sexta-feira.</p>
    </section>

    <article id="recursos" class="cartao">
      <h2>Recurso da semana</h2>
      <p>Rever DOM em <code>../JavaScript/16-DOM-Basico.md</code>.</p>
    </article>
  </main>

  <footer class="container">
    <small>11.º ano - Programação</small>
  </footer>
</body>
```

## 2) Exemplo B (armadilha comum)

Problema (tudo com `div`):

```html
<div>
  <div>Título</div>
  <div>Texto</div>
</div>
```

Correção:

```html
<main>
  <section>
    <h2>Título</h2>
    <p>Texto</p>
  </section>
</main>
```

## Checkpoint visual

- A página tem cabeçalho, conteúdo principal e rodapé distintos.
- Os links `#avisos` e `#recursos` levam às secções corretas.

## DevTools: onde olhar

- `Elements`: confirma presença de `header`, `main`, `section`, `article`, `footer`.
- `Elements > Accessibility` (quando disponível): confirma landmarks.

## Erros comuns

1. Saltar de `h1` para `h4` sem contexto.
2. Usar `br` para espaçamento visual.
3. Repetir `id` em múltiplos elementos.

## Exercícios em escada

### Exercício A (guiado)

Transforma uma página só com `div` em versão semântica.

Resultado esperado:

- Estrutura com `header/main/footer`.
- Títulos em ordem lógica.

### Exercício B (intermédio)

Adiciona navegação interna para três secções (`#sobre`, `#projetos`, `#contactos`).

Resultado esperado:

- Todos os links saltam para a secção correta.

### Exercício C (aplicação)

Constrói uma página "Perfil de aluno" com semântica completa e duas secções em formato `.cartao`.

Resultado esperado:

- Página semântica, limpa e pronta para estilização.

## Changelog

- v1.0.1 - Semântica reforçada, exemplos A/B completos e exercícios A/B/C com resultados esperados.
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
