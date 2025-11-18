# [16] DOM Básico - Seletores, Criação/Injeção, Classes, Atributos, Eventos, Delegação, Formulários (11.º ano)

> **Objetivo**: perceber **o que é o DOM**, saber **selecionar elementos**, **ler/alterar** texto e atributos, **criar/injetar/remover** nós, **trabalhar com classes e estilos**, **ouvir eventos** (cliques, inputs, submit), aplicar **delegação de eventos**, e **ler formulários** de forma simples e segura. Linguagem pensada para 11.º ano.

---

## 0) O que é o DOM (explicado simples)

-   Quando o browser abre uma página, transforma o HTML numa **árvore de nós** (o **DOM**).
-   Cada tag HTML (ex.: `<h1>`, `<p>`, `<button>`) torna‑se num **elemento** dessa árvore.
-   O JavaScript consegue **ver e modificar** essa árvore: ler texto, criar elementos, reagir a cliques, etc.

```
<html>
  <body>
    <h1>Título</h1>
    <ul id="lista">
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </body>
</html>
```

---

## 1) Onde pôr o JavaScript?

A forma simples e moderna é carregar o script **depois** do HTML **ou** usar `defer`:

```html
<!-- A) Script no fim do <body> -->
<body>
    <!-- ... HTML ... -->
    <script src="main.js"></script>
</body>

<!-- B) Script no <head> com defer (recomendado) -->
<head>
    <script src="main.js" defer></script>
</head>
```

> `defer` garante que o HTML carrega primeiro e **só depois** corre o JS (evita erros de “elemento ainda não existe”).

---

## 2) Seletores (como encontrar elementos)

```html
<section id="app">
    <h2 class="titulo">Catálogo</h2>
    <button class="btn" data-acao="adicionar">Adicionar</button>
    <ul id="lista"></ul>
</section>
```

```js
// O documento inteiro
const app = document.querySelector("#app"); // 1º que bate
const titulo = document.querySelector(".titulo"); // por classe
const botao = document.querySelector("button.btn"); // por tag + classe

// Vários elementos
const botoes = document.querySelectorAll(".btn"); // NodeList (parecido com array)
botoes.forEach((b) => console.log(b.dataset.acao));

// Alternativas (menos flexíveis, mas válidas)
document.getElementById("lista");
document.getElementsByClassName("btn"); // HTMLCollection
document.getElementsByTagName("li");
```

> **Dica**: usa **`querySelector`/`querySelectorAll`** (com CSS selectors) — são consistentes e fáceis de ler.

---

## 3) Ler e alterar conteúdo (texto vs HTML)

-   `textContent` → **texto simples** (seguro).
-   `innerHTML` → interpreta **HTML** (pode ser perigoso com dados do utilizador).

```js
titulo.textContent = "Catálogo de Produtos"; // muda o texto
// Evita inserir texto vindo do utilizador com innerHTML (risco de XSS)
const li = document.createElement("li");
li.textContent = "<b>Seguro</b> como texto mesmo"; // aparece literalmente
// Se for HTML de confiança (teu, estático), podes usar innerHTML:
li.innerHTML = "<strong>Item</strong> <em>novo</em>";
```

**Outros úteis**

```js
// Atributos
botao.setAttribute("aria-label", "Adicionar novo item");
console.log(botao.getAttribute("data-acao")); // "adicionar"

// dataset → atributos data-*
botao.dataset.estado = "ativo"; // cria data-estado="ativo"
delete botao.dataset.estado; // remove

// Leitura de inputs
const input = document.querySelector("#q"); // <input id="q">
console.log(input.value); // texto que o utilizador escreveu
```

---

## 4) Classes e estilos (preferir classes)

-   **`classList`**: `add`, `remove`, `toggle`, `contains`.
-   **Evita** alterar muitos estilos via `element.style`; guarda estilos no **CSS** e liga/desliga **classes**.

```js
app.classList.add("ativo");
app.classList.remove("oculto");
app.classList.toggle("escuro"); // liga/desliga
console.log(app.classList.contains("escuro")); // true/false

// Estilo direto (ok para casos pontuais):
titulo.style.borderBottom = "1px solid #ddd";
```

---

## 5) Criar, injetar e remover elementos

```js
const ul = document.querySelector("#lista");

// Criar
const item = document.createElement("li");
item.className = "produto";
item.textContent = "Caderno A5";

// Inserir
ul.append(item); // no fim
// ul.prepend(item);  // no início
// item.remove();     // remover
// ul.before(div);    // inserir antes do <ul>
// ul.after(div);     // inserir depois do <ul>
```

**Gerar vários itens com DocumentFragment (mais eficiente)**

```js
const frag = document.createDocumentFragment();
["Lápis", "Borracha", "Estojo"].forEach((nome) => {
    const li = document.createElement("li");
    li.textContent = nome;
    frag.append(li);
});
ul.append(frag); // injeta tudo de uma vez
```

---

## 6) Eventos (reagir a ações do utilizador)

-   Usa `addEventListener(evento, handler)`.
-   Alguns eventos comuns: `click`, `input`, `change`, `submit`, `keydown`.

```html
<input id="q" placeholder="Pesquisar..." />
<button id="pesquisar">Pesquisar</button>
<p id="estado"></p>
```

```js
const q = document.querySelector("#q");
const btn = document.querySelector("#pesquisar");
const estado = document.querySelector("#estado");

btn.addEventListener("click", () => {
    estado.textContent = `A pesquisar por: ${q.value}`;
});

q.addEventListener("input", () => {
    estado.textContent = q.value.length ? "A escrever..." : "À espera...";
});
```

**Formulários e `preventDefault`**

```html
<form id="form-login">
    <input name="email" type="email" required />
    <input name="senha" type="password" required />
    <button>Entrar</button>
</form>
```

```js
document.querySelector("#form-login").addEventListener("submit", (e) => {
    e.preventDefault(); // não recarrega a página
    const fd = new FormData(e.currentTarget);
    const dados = Object.fromEntries(fd.entries()); // { email: "...", senha: "..." }
    console.log("Dados do form:", dados);
    // validar, enviar via fetch, etc.
});
```

---

## 7) Delegação de eventos (um listener, muitos itens)

Quando tens muitos itens (ex.: lista de produtos), em vez de meter um listener em cada `<li>`, coloca **um** no **pai** e detecta **onde** clicaste.

```html
<ul id="produtos">
    <li data-id="1"><button class="rmv">remover</button> Lápis</li>
    <li data-id="2"><button class="rmv">remover</button> Borracha</li>
</ul>
```

```js
const lista = document.querySelector("#produtos");
lista.addEventListener("click", (e) => {
    const btn = e.target.closest(".rmv"); // foi um botão .rmv?
    if (!btn) return; // se não, ignora
    const li = btn.closest("li");
    const id = li.dataset.id;
    li.remove(); // remove da UI
    console.log("Removido id:", id);
});
```

**Vantagem**: menos listeners → código mais leve e simples.

---

## 8) Pequena “caixa de ferramentas”

-   **Selecionar**: `querySelector`, `querySelectorAll`.
-   **Conteúdo**: `textContent` (seguro), `innerHTML` (cuidado).
-   **Atributos**: `getAttribute`, `setAttribute`, `dataset`.
-   **Classes**: `classList.add/remove/toggle/contains`.
-   **Criar**: `createElement`, `append/prepend/before/after`, `remove`.
-   **Eventos**: `addEventListener`; em formulários usa `preventDefault`.
-   **Delegação**: `e.target.closest(seletor)` para descobrir o elemento certo.

---

## 9) Boas práticas (nível iniciante, mas importantes)

-   **Segurança**: quando inseres texto vindo do utilizador, usa **`textContent`** (evita código malicioso).
-   **Separação**: estilos no **CSS**; no JS liga/desliga **classes**.
-   **Performance**: se vais inserir muitos elementos, monta primeiro num **`DocumentFragment`** e depois injeta.
-   **Acessibilidade (A11y)**: associa `<label for="id">` aos inputs; usa `aria-label` quando não houver texto visível.

---

## 10) Mini‑projetos guiados

1. **Lista dinâmica simples**

    - Input + botão “Adicionar”: cria `<li>` com `textContent` e mete na `<ul>`.
    - Botão “Limpar” remove todos os `<li>`.

2. **Pesquisa ao digitar**

    - Ao escrever no input, filtra os `<li>` (mostrar/esconder) cujo texto **inclui** a query.

3. **Carrinho mínimo**

    - Ao clicar “+” num produto, cria uma linha no carrinho (`<ul>`).
    - Delegação para remover itens no carrinho.

4. **Form de login (simulado)**
    - Lê `email`/`senha` com `FormData`, valida “campo vazio” e mostra mensagens de erro/ok num `<p>`.

---

## 11) Mini desafios

1. **Selecionar & alterar** — muda o texto de um `<h1>` para “Bem‑vindo/a!” e adiciona uma classe `destacado`.
2. **Criar itens** — a partir de um array `["Ana","Bruno","Carla"]`, cria `<li>` e injeta numa `<ul>` usando `DocumentFragment`.
3. **Tema escuro** — ao clicar num botão “Alternar tema”, faz `document.body.classList.toggle("escuro")` e altera o texto do botão para “Tema claro”/“Tema escuro”.
4. **Form + validação** — lê um formulário com `FormData`, verifica campos vazios e mostra mensagens diferentes num `<p>` usando `textContent`.
5. **Delegação** — cria uma lista onde cada `<li>` tem um botão “remover”. Usa um único `addEventListener` no `<ul>` e remove o item correto com `closest`.
6. **Filtro** — ao escrever num input, mostra só os `<li>` que contêm esse texto (case‑insensitive) e destaca o termo encontrado com uma classe.
7. **Contador com `setInterval`** — cria um botão “Iniciar contador” que adiciona `<li>` numerados a cada segundo até clicar em “Parar”. Limpa o intervalo corretamente.

---

## 12) Resumo

-   O **DOM** é a **árvore** que representa o HTML.
-   Usa **seletores** para encontrar elementos e **classes** para alterar aparência.
-   Cria e injeta elementos com **`createElement` + `append`**.
-   Reage a eventos com **`addEventListener`** e usa **delegação** para listas grandes.
-   Em formulários, usa **`FormData`** e **`preventDefault`** para controlar o envio.
-   Lembra‑te de **segurança** (`textContent`) e **acessibilidade** (labels).

## Changelog

-   **v1.1.0 — 2025-11-10**
    -   Exercícios promovidos a Mini desafios e expandidos para sete cenários de manipulação do DOM.
    -   Adicionada secção de changelog para acompanhar evoluções do capítulo.
