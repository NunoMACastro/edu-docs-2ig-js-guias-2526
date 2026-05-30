![Header](../Images/Header.png)

# [16] Mini-Projeto Integrador (11.º ano)

## 0) Objetivo do capítulo

Integrar HTML, CSS e ponte para JavaScript/React num projeto prático com entregáveis claros.

## No fim deste capítulo consegues...

- Montar uma base técnica reutilizável (Starter Kit).
- Executar milestones com critérios de conclusão visíveis.
- Entregar um mini-projeto consistente e preparado para evolução.

## Vocabulário mínimo

- `milestone`: etapa com objetivo e critérios.
- `starter kit`: base técnica pronta a reutilizar.
- `estado de UI`: loading, erro, sucesso, vazio.
- `escalável`: fácil de manter e crescer.
- `critério de conclusão`: condição objetiva para considerar etapa concluída.

## 1) Desafio

Construir o "Painel de Estudo" com:

- Cabeçalho com navegação
- Bloco de tarefas
- Bloco de recursos
- Formulário funcional
- Estados visuais (`.is-loading`, `.is-error`, `.is-success`, `.is-empty`)

## 2) Estrutura de projeto

```text
mini-projeto/
  index.html
  css/
    base.css
    layout.css
    components.css
  js/
    main.js
```

## 3) Exemplo A (base): Starter Kit

`index.html`

```html
<!doctype html>
<html lang="pt-PT">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Painel de Estudo</title>
    <link rel="stylesheet" href="css/base.css" />
    <link rel="stylesheet" href="css/layout.css" />
    <link rel="stylesheet" href="css/components.css" />
  </head>
  <body>
    <a class="skip-link" href="#conteudo">Saltar para o conteúdo</a>

    <header class="barra">
      <div class="container barra__conteudo">
        <h1>Painel de Estudo</h1>
        <nav>
          <a href="#tarefas">Tarefas</a>
          <a href="#recursos">Recursos</a>
        </nav>
      </div>
    </header>

    <main id="conteudo" class="container grelha" data-modulo="painel">
      <section id="tarefas" class="cartao">
        <h2>Tarefas</h2>
        <form id="form-tarefa">
          <label for="input-tarefa">Nova tarefa</label>
          <input class="input" id="input-tarefa" name="tarefa" type="text" required />
          <button class="botao" type="submit">Adicionar</button>
        </form>
        <p id="msg-tarefa" class="mensagem is-error hidden">Escreve uma tarefa válida.</p>
        <ul id="lista-tarefas" class="is-empty"></ul>
      </section>

      <section id="recursos" class="cartao">
        <h2>Recursos</h2>
        <p class="mensagem is-success">Checklist da semana carregada.</p>
      </section>
    </main>

    <script defer src="js/main.js"></script>
  </body>
</html>
```

`css/base.css`

```css
:root {
  --cor-fundo: #f8fafc;
  --cor-texto: #1f2937;
  --cor-primaria: #0f766e;
  --cor-borda: #d1d5db;
  --cor-erro: #b91c1c;
  --cor-sucesso: #166534;
  --focus-ring: 0 0 0 3px rgba(15, 118, 110, 0.35);

  --espaco-1: 8px;
  --espaco-2: 12px;
  --espaco-3: 16px;
}

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

body {
  font-family: "Segoe UI", sans-serif;
  background: var(--cor-fundo);
  color: var(--cor-texto);
  line-height: 1.5;
}

img {
  max-width: 100%;
  height: auto;
}

.skip-link {
  position: absolute;
  left: -9999px;
}

.skip-link:focus-visible {
  left: 16px;
  top: 16px;
  background: #111827;
  color: #fff;
  padding: 8px;
}
```

`css/layout.css`

```css
.container {
  width: min(100% - 24px, 1100px);
  margin-inline: auto;
}

.barra {
  border-bottom: 1px solid var(--cor-borda);
  background: #fff;
}

.barra__conteudo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--espaco-2);
  padding: var(--espaco-2) 0;
}

.grelha {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--espaco-3);
  padding-block: var(--espaco-3);
}

.hidden {
  display: none;
}

@media (min-width: 768px) {
  .grelha {
    grid-template-columns: 1fr 1fr;
  }
}
```

`css/components.css`

```css
.cartao {
  background: #fff;
  border: 1px solid var(--cor-borda);
  border-radius: 10px;
  padding: var(--espaco-3);
}

.botao {
  background: var(--cor-primaria);
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
}

.botao:focus-visible,
.input:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.botao:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input {
  width: 100%;
  border: 1px solid var(--cor-borda);
  border-radius: 8px;
  padding: 10px;
}

.mensagem {
  margin-top: var(--espaco-2);
  padding-left: 8px;
}

.mensagem.is-error {
  color: var(--cor-erro);
  border-left: 4px solid var(--cor-erro);
}

.mensagem.is-success {
  color: var(--cor-sucesso);
  border-left: 4px solid var(--cor-sucesso);
}

.is-done {
  text-decoration: line-through;
  opacity: 0.75;
}

@media (prefers-reduced-motion: reduce) {
  .botao,
  .cartao {
    transition: none;
  }
}
```

## 4) Exemplo B (armadilha comum)

Problema:

- `index.html` aponta para `styles.css` e `main.js` sem pastas.
- Classes misturadas (`.card`, `.btn`) em vez de `.cartao` e `.botao`.

Correção:

- Manter caminhos `css/base.css`, `css/layout.css`, `css/components.css` e `js/main.js`.
- Aplicar convenções únicas de classes e estados da coleção.

## 5) Milestones e resultados esperados

### Milestone A - HTML limpo

- Estrutura semântica completa (`header`, `main`, `section`, `footer`).
- IDs e labels corretos no formulário.

Resultado esperado:

- Navegação interna funciona e HTML valida sem erros básicos.

### Milestone B - CSS base

- Tokens em `:root` e reset mínimo ativo.
- Componentes `.cartao`, `.botao`, `.mensagem`, `.input` aplicados.

Resultado esperado:

- Interface consistente e legível.

### Milestone C - Responsividade

- Layout testado em 375px, 768px e 1024px.

Resultado esperado:

- Sem scroll horizontal e com organização clara em cada largura.

### Milestone D - Ponte para JS

- Submissão de tarefa com `trim()`.
- Estados visuais e delegação com `data-action`.

Resultado esperado:

- Fluxo de tarefas funcional sem recarregar a página.

### Desafio extra - Extensão React (não conta para base)

Só começar depois de a Milestone D estar completa.

- Reaproveitar classes e estrutura em componentes React.
- Implementar versão equivalente do painel em JSX.

Resultado esperado:

- Paridade visual e funcional com a versão HTML/CSS/JS.

## Checkpoint visual

- Header e navegação visíveis e alinhados.
- Secção de tarefas funcional com mensagens de estado.
- Layout responsivo sem overflow em 375px, 768px e 1024px.

## 6) Debug com DevTools

- `Network`: confirma carregamento dos 3 CSS e `js/main.js`.
- `Elements`: valida aplicação de classes de estado.
- `Console`: valida ausência de erros em submit/cliques.

## 7) Entrega

1. Código fonte organizado com estrutura do Starter Kit.
2. README curto do grupo (decisões e dificuldades).
3. Lista de 3 melhorias futuras.

## Erros comuns

1. Misturar `app.js` e `main.js` em diferentes exemplos.
2. Alterar classes base para inglês (`.card`, `.btn`) e quebrar consistência.
3. Implementar \"Desafio extra\" antes da Milestone D.

## Exercícios em escada

### Exercício A (guiado)

Implementa Milestones A e B.

Resultado esperado:

- Estrutura e visual base concluídos.

### Exercício B (intermédio)

Implementa Milestone C com validação em 375/768/1024.

Resultado esperado:

- Responsividade comprovada por capturas ou teste em aula.

### Exercício C (aplicação)

Implementa Milestone D com tarefas dinâmicas + estados.

Resultado esperado:

- Mini-projeto funcional pronto para avaliação base.

## Changelog

- v1.0.2 - Estrutura canónica fixada com `js/main.js` e secção de erros comuns adicionada.
- v1.0.1 - Starter Kit completo adicionado; milestones com resultados esperados; "opcional" convertido em Desafio extra com regra explícita.
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
