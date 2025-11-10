# 01 — React: Introdução e Setup (11.º ano)

> **Objetivo**: perceber **o que é o React**, como funciona **por alto**, o que é uma **SPA**, o que precisas de instalar, e **criar o teu primeiro projeto** com **Vite**. Vamos fazer o “Olá, mundo!”, explicar **JSX** (o HTML‑like do React) e a **estrutura de pastas**. No fim há exercícios.

---

## 0) Antes de começar: o que é o React?

-   **React** é uma **biblioteca** de JavaScript para construir **interfaces** (páginas/app) interativas.
-   Ajuda‑nos a dividir a UI em **componentes** (peças reutilizáveis): Botão, Card, Lista, etc.
-   Em vez de mexer no DOM “à mão”, descrevemos **como a UI deve ser** para um certo **estado** e o React trata das mudanças. Basicamente, dizemos "Quero ver isto assim e, quando este dado mudar, quero que reajas desta forma". O React cuida de atualizar a interface para refletir essas mudanças de maneira eficiente.
-   Usa **JSX**, uma sintaxe que mistura JavaScript e HTML, tornando mais fácil criar componentes visuais.
-   É assincrono e eficiente: só atualiza o que mudou, não a página toda.

### SPA vs Multi‑página (MPA)

-   **MPA**: cada clique carrega **uma página nova** do servidor (HTML completo).
-   **SPA**: carregas uma vez e, a partir daí, **o JS atualiza só partes** do ecrã; navegação mais fluida.

> Para React vamos trabalhar no **modelo SPA** (Single Page Application).

### O que é JSX?

-   JSX é uma **sintaxe** que parece HTML **dentro do JavaScript**.
-   Permite escrever `<h1>Olá</h1>` numa função e o React transforma isto em UI.
-   Diferenças importantes vs HTML: usa `className` (não `class`), atributos **camelCase** (ex.: `onClick`), e **todas as tags devem fechar**.

### Como o React “desenha” (super simples)

-   React cria uma **árvore virtual** da UI (Virtual DOM) que simula o DOM real e mantém o estado atual de cada componente.
-   Quando o estado muda, React compara as árvores e **altera só o necessário** no ecrã. Tu focas‑te na **lógica**, não nos detalhes do DOM.
-   Por exemplo: Tens uma lista de tarefas quando a página carrega. O React cria uma representação dessa lista na memória (Virtual DOM). Quando adicionas uma nova tarefa, essa nova tarefa é adicionada ao Virtual DOM. O React então compara o Virtual DOM atualizado com o anterior, identifica que apenas uma tarefa foi adicionada, e atualiza apenas essa parte específica do DOM real, em vez de redesenhar toda a lista. Isso torna as atualizações mais rápidas e eficientes.

---

## 1) O que precisas de instalar

1. **Node.js LTS** (18 ou 20) → [nodejs.org](https://nodejs.org)  
   Instala também o **npm** (vem com o Node).
2. Um editor (recomendado **VS Code**).

### O que é `npm` e `npx`?

Grande parte de ecossistemas como o React, usa **ferramentas externas** para ajudar e automatizar funcionalidades. Essas ferramentas são chamadas de **pacotes** ou **bibliotecas** e, no caso do Node.js, são geridas por um sistema chamado **npm** (Node Package Manager).

-   **npm**: gestor de pacotes (instala bibliotecas).
-   **npx**: executa ferramentas **sem instalar globalmente** (ex.: criar projeto).

---

## 2) Criar projeto com Vite (rápido e moderno)

**Vite** é um **bundler + dev server** muito rápido para React.

No terminal, corre:

```bash
# 1) Criar o projeto
npm create vite@latest minha-app-react -- --template react

# 2) Entrar na pasta e instalar dependências
cd minha-app-react
npm install

# 3) Arrancar o servidor de desenvolvimento
npm run dev
```

Abre o endereço que aparece (ex.: `http://localhost:5173`).

> Se preferires JavaScript puro (sem TS), o template `react` já é JS. (Há também `react-swc`, mais rápido na build — opcional.)

---

## 3) Estrutura de pastas (vista rápida)

Depois de criado, verás algo como:

```
minha-app-react/
├─ index.html                 # página base (tem a <div id="root">)
├─ package.json               # scripts npm e dependências
├─ vite.config.js             # config do Vite (normalmente não mexes no início)
└─ src/
   ├─ main.jsx                # ponto de entrada: liga React ao #root
   ├─ App.jsx                 # componente principal
   ├─ assets/                 # imagens, ícones, etc.
   └─ index.css               # estilos globais (podes mudar)
```

-   **`index.html`** tem a `<div id="root"></div>` onde o React “monta” a app.
-   **`src/main.jsx`** cria a **root** do React e diz para renderizar `<App />`.
-   **`src/App.jsx`** é o **teu primeiro componente**.

---

## 4) O que há em `main.jsx` e `index.html`?

**`index.html` (trecho principal)**

```html
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
```

**`src/main.jsx`**

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

-   `React.StrictMode` ajuda a detetar problemas (em dev pode invocar alguns ciclos extra para avisos). Em produção não tem custo.
-   O React **renderiza `<App />` dentro do `#root`**.

---

## 5) O teu primeiro componente (`App.jsx`)

Abre `src/App.jsx` e simplifica para perceberes:

```jsx
export default function App() {
    const titulo = "Olá, React!";
    const ano = new Date().getFullYear();

    // JSX: parece HTML, mas está dentro de JS
    return (
        <main>
            <h1>{titulo}</h1>
            <p>Estamos no ano {ano}.</p>
            <img src="/vite.svg" alt="Logo Vite" width="48" />
        </main>
    );
}
```

### Regras importantes do JSX

-   **Expressões JS** entre `{ ... }` (números, strings, `1+2`, `condição && ...`, etc.).
-   Usa `className="..."` (não `class`).
-   Atributos em **camelCase**: `onClick`, `tabIndex`, `htmlFor` (para `<label>`).
-   **Tags sempre fechadas**: `<img />`, `<input />`.

> JSX não é texto: é **JavaScript**. Se precisares de comentar dentro de JSX, usa `{/* comentário */}`.

---

## 6) Importar CSS e assets

-   Podes importar CSS global em `main.jsx` → `import "./index.css"`.
-   Podes criar CSS por componente (ex.: `App.css`) e importar em `App.jsx`.
-   Imagens: podes usar caminhos relativos dentro de `src/` ou públicos (em `public/` ou raiz, conforme Vite).

```jsx
import "./App.css";

export default function App() {
    return <button className="btn">Comprar</button>;
}
```

**Opção: CSS Modules (evita conflitos de nomes)**  
Cria `Button.module.css` e usa:

```jsx
import styles from "./Button.module.css";

export default function Button({ children }) {
    return <button className={styles.btn}>{children}</button>;
}
```

---

## 7) Módulos ES: `export` e `import`

Cada ficheiro é um **módulo**. Exportas valores e importas noutros ficheiros.

```jsx
// Saudacao.jsx
export default function Saudacao({ nome }){
  return <h2>Olá, {nome}!</h2>
}

// App.jsx
import Saudacao from "./Saudacao.jsx"
export default function App(){
  return <Saudacao nome="Ana" />
}
```

-   `export default` → um por ficheiro (o “principal”).
-   `export` nomeado → vários por ficheiro (ex.: `export function x(){}`), importas com `{ x }`.

---

## 8) Comandos úteis (npm scripts)

-   `npm run dev` → servidor de desenvolvimento (hot reload).
-   `npm run build` → cria a versão de produção (minificada).
-   `npm run preview` → testa **a build** localmente antes de publicar.

---

## 9) Resolução de problemas (comuns)

-   **Página em branco / erro no console**: confirma a **versão do Node** (LTS) e reinstala deps: `rm -rf node_modules && npm install`.
-   **ID do root errado**: no `index.html` certifica‑te que tens `<div id="root">` e no `main.jsx` estás a selecioná-lo.
-   **`class` em vez de `className`**: no JSX deve ser `className`.
-   **Tag não fechada**: no JSX **tudo fecha**: `<img />`, `<input />`, `<br />`.
-   **Extensão do ficheiro**: usa `.jsx` para componentes (Vite também aceita `.js`, mas `.jsx` deixa a intenção clara).

---

## 10) Exercícios guiados (nível 11.º ano)

1. **Setup**

    - Cria uma app com Vite, arranca `npm run dev` e altera o `<h1>` para o teu nome.

2. **Componente Saudação**

    - Cria `Saudacao.jsx` que recebe a prop `nome` e mostra `Olá, <nome>!`.
    - Importa e usa em `App.jsx` com nomes diferentes.

3. **Imagem e CSS**

    - Adiciona um botão com classe `btn` e estiliza em `App.css`.
    - Troca o logo por uma imagem tua dentro de `src/assets`.

4. **JSX e expressões**

    - Cria uma variável com a hora atual e mostra `Bom dia / Boa tarde / Boa noite` consoante a hora (apenas com JSX e operadores, sem `useState` ainda).

5. **Composição**
    - Cria um componente `Card` que recebe `children` e envolve conteúdo com `<div className="card">...</div>`. Usa `Card` em 2 sítios diferentes.

---

## 11) Erros comuns e como evitar

-   Esquecer `export default` no componente → não consegues importar.
-   Escrever JS “fora” do componente mas querer usar variáveis do componente → mantém a lógica **dentro** da função (para já).
-   Misturar `class`/`for` do HTML com `className`/`htmlFor` do JSX.
-   Mover/renomear ficheiros sem atualizar os paths do `import`.
-   Usar acentos ou espaços em nomes de ficheiros → evita; usa `CamelCase` ou `kebab-case`.

---

## 12) Resumo

-   React = **componentes** + **JSX** + **estado** (estado vem a seguir).
-   Vite dá‑te um projeto React **rápido** e simples de iniciar.
-   `index.html` tem o **root**; `main.jsx` rende o `<App />`.
-   JSX parece HTML, mas segue **regras do JS** (className, camelCase, fechar tags).
-   Próximo passo: **JSX em detalhe e renderização** + **props** com mais exemplos.
