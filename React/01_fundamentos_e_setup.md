# React.js (11.º Ano) - 01 · Fundamentos e setup de React

> **Objetivo deste ficheiro**
> Entender o que é React e a ideia de UI declarativa.
> Criar um projeto básico com Vite e correr o servidor local.
> Saber onde editar o código e como ver mudanças no browser.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] O que é React e como funciona](#sec-1)
-   [2. [ESSENCIAL] Criar um projeto com Vite](#sec-2)
-   [3. [ESSENCIAL] Estrutura base e primeiro componente](#sec-3)
-   [4. [EXTRA] Ferramentas de apoio e hábitos iniciais](#sec-4)
-   [Exercícios - Fundamentos e setup](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** estuda tudo o que está marcado como [ESSENCIAL]; [EXTRA] é para consolidar ou ir mais longe.
-   **Como estudar:** lê, copia os exemplos, muda valores, observa o resultado, depois faz os exercícios.
-   **Ligações:** este é o primeiro ficheiro, começa por aqui.
-   **Pré-requisitos rápidos (antes de começar):**
    -   **Node.js + npm:** precisas de uma versão recente (Node 18+ funciona bem). Sem isto não consegues instalar dependências.
    -   **Editor de código:** VS Code ou similar, com suporte para JavaScript/JSX.
    -   **Terminal:** para correr comandos (`npm`, `node`, etc.).
    -   **Browser atualizado:** Chrome, Edge ou Firefox para testar.

<a id="sec-1"></a>

## 1. [ESSENCIAL] O que é React e como funciona

### Modelo mental

React é uma biblioteca para construir interfaces. Em vez de dizeres ao browser "faz isto, depois aquilo", descreves o estado desejado e o React trata das atualizações.

> **Nota sobre SPA:** "Single Page Application" não significa uma única página de conteúdo. Significa que a app não recarrega o browser; o conteúdo muda por JavaScript (ver `09_react_router_fundamentos.md`).

#### DOM e DOM virtual (explicação simples)

-   **DOM (Document Object Model):** é a árvore de elementos HTML que o browser usa para mostrar a página. Se mudares o DOM, a página muda.
-   **Problema:** mexer no DOM diretamente muitas vezes é lento e complexo quando a UI cresce.
-   **DOM virtual:** o React cria uma versão leve do DOM em memória. Quando algo muda, ele compara o DOM virtual antigo com o novo e atualiza apenas o que é preciso no DOM real.

#### O que é um componente (mais explícito)

Um componente é uma **função que descreve uma parte da interface**. Pensa num componente como um bloco de UI: um cartão, um cabeçalho ou um botão. Quando o estado ou as props mudam, o React volta a chamar o componente e redesenha esse bloco.

Resumo: **componente = função que devolve JSX**, e **JSX = a forma de escrever a UI dentro do JavaScript**.

### Sintaxe base

-   Um componente é uma função JavaScript que devolve JSX.
-   JSX parece HTML, mas vive dentro do JavaScript.
-   O React atualiza o DOM quando o estado muda.

### Exemplo

```jsx
// Um componente é uma função que devolve JSX (o "desenho" da UI)
function App() {
    // O return descreve o que deve aparecer no ecrã
    return (
        <main>
            {/* JSX permite misturar HTML com JS de forma controlada */}
            <h1>Olá, React</h1>
            <p>Esta interface é declarativa.</p>
        </main>
    );
}

export default App;
```

### Erros comuns

-   Pensar que React é um framework completo (e apenas a camada de UI).
-   Tentar manipular o DOM manualmente com `document.querySelector`.
-   Confundir HTML com JSX (não são iguais).

### Boas práticas

-   Pensa em pequenos componentes reutilizáveis.
-   Descreve o estado do ecrã, não os passos para chegar lá.

### Checkpoint

-   Consegues explicar a diferença entre DOM real e DOM virtual?
-   O que é um componente em React, numa frase simples?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Criar um projeto com Vite

### Modelo mental

O Vite é uma ferramenta que cria um projeto React já pronto a correr. Ele trata do servidor de desenvolvimento, do build e das dependências.

### Sintaxe base

-   `npm create vite@latest` cria o projeto.
-   `npm install` instala as dependências.
-   `npm run dev` inicia o servidor local.

### Exemplo

```bash
# Cria um novo projeto React chamado "meu-app"
npm create vite@latest meu-app -- --template react
# Entra na pasta do projeto
cd meu-app
# Instala as dependências do projeto
npm install
# Inicia o servidor local de desenvolvimento
npm run dev
```

> **Aviso:** se o terminal mostrar um link (ex: `http://localhost:5173`), abre-o no browser para veres a app.

### Erros comuns

-   Esquecer o `npm install` e ter erros ao iniciar.
-   Criar o projeto numa pasta com espaços no nome.
-   Fechar o terminal e perder o servidor local.

### Boas práticas

-   Usa nomes simples para pastas (sem espaços).
-   Mantém o terminal aberto enquanto estás a desenvolver.

### Checkpoint

-   Qual é o comando que instala dependências?
-   Que comando inicia o servidor de desenvolvimento?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Estrutura base e primeiro componente

### Modelo mental

O ficheiro `main.jsx` é o ponto de entrada. Ele liga o React ao `div#root` no `index.html`. O `App.jsx` é o componente principal que vais editar.

Na prática, vais **editar quase sempre `src/App.jsx`** e criar componentes em `src/components`. O React renderiza o `App` dentro do `div#root`.

### Sintaxe base

-   `index.html` tem um `div` com `id="root"`.
-   `main.jsx` cria a raiz e renderiza o `App`.
-   `App.jsx` define a interface principal.

### Exemplo

```jsx
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// ReactDOM cria a raiz da aplicação dentro do div#root do index.html
ReactDOM.createRoot(document.getElementById("root")).render(
    // O App é o componente principal que controla a página
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

> **Nota sobre StrictMode (dev):** em desenvolvimento, alguns efeitos e renders podem correr duas vezes para ajudar a detetar problemas. Isto não acontece em produção. Mais detalhe no `08_useEffect_e_dados.md`.

```jsx
// src/App.jsx
function App() {
    // Componente principal com um pequeno layout inicial
    return (
        <div>
            {/* O texto aqui é o que vais ver no browser */}
            <h1>Primeiro projeto React</h1>
            <p>Já está tudo ligado.</p>
        </div>
    );
}

export default App;
```

### Erros comuns

-   Apagar o `id="root"` no `index.html` e nada aparecer.
-   Editar `index.html` a espera de ver mudanças reativas.
-   Esquecer o `export default` e ficar sem componente.

### Boas práticas

-   Mantem o `App` simples no inicio.
-   Faz pequenas mudanças e confirma no browser.

### Checkpoint

-   Qual é a função do `div#root` no `index.html`?
-   Onde é que o `App` é ligado à página?

<a id="sec-4"></a>

## 4. [EXTRA] Ferramentas de apoio e hábitos iniciais

### Modelo mental

Ferramentas como React DevTools e extensões do editor ajudam-te a perceber a estrutura dos componentes e a encontrar erros mais depressa.

### Sintaxe base

-   React DevTools mostra a árvore de componentes no browser.
-   O editor pode formatar e detetar erros simples automaticamente.

### Exemplo

-   Quando tens a app aberta, abre as DevTools e procura o separador **Components** para veres o `App` e outros componentes.
-   Se o editor sublinhar a vermelho, lê a mensagem com calma e procura o ficheiro indicado.

### Erros comuns

-   Ignorar mensagens do terminal ou do browser.
-   Instalar demasiadas extensões sem saber o que fazem.

### Boas práticas

-   Resolve os avisos um a um, sem acumular.
-   Guarda o link do servidor local para abrir rápido.

### Checkpoint

-   Para que servem as DevTools no React?
-   Que tipo de erro aparece no terminal versus no browser?

<a id="exercicios"></a>

## Exercícios - Fundamentos e setup

1. Cria um projeto novo com Vite e abre-o no browser.
2. Muda o texto do `<h1>` para o teu nome. Dica: edita `src/App.jsx`.
3. Adiciona um parágrafo com uma frase tua.
4. Adiciona um segundo parágrafo e observa a atualização automática.
5. Encontra o `div` com `id="root"` no `index.html`.
6. Remove temporariamente o `React.StrictMode` e confirma que a app continua a funcionar.
7. Volta a colocar o `React.StrictMode`.
8. Altera o título do projeto no `index.html` (tag `<title>`).
9. Escreve numa folha quais os ficheiros mais importantes e para que servem.
10. Abre as DevTools do browser e identifica o componente `App`.

<a id="changelog"></a>

## Changelog

-   2026-01-11: criação do ficheiro.
-   2026-01-12: clarificação de SPA e reforço de onde editar e do papel do `root`.
