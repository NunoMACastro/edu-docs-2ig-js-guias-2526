# React.js (12.º Ano) - 01 · Fundamentos e setup de React

> **Objetivo deste ficheiro**
>
> - Entender o que é o React e a ideia de **UI declarativa**.
> - Perceber o que é um **componente** e porque é que ele “volta a correr” (re-render).
> - Criar um projeto com **Vite** e correr o servidor local.
> - Saber onde editar o código e como ver mudanças no browser (sem recarregar a página).

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] O que é React e como funciona](#sec-1)
- [2. [ESSENCIAL] Criar um projeto com Vite](#sec-2)
- [3. [ESSENCIAL] Estrutura base e primeiro componente](#sec-3)
- [4. [EXTRA] Ferramentas de apoio e hábitos iniciais](#sec-4)
- [Exercícios - Fundamentos e setup](#exercicios)
- [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **ESSENCIAL vs EXTRA:** domina tudo o que está marcado como [ESSENCIAL]. O [EXTRA] ajuda a consolidar e a trabalhar “como em projetos reais”.
- **Como estudar (método simples):**
    1. Lê a teoria (modelo mental).
    2. Copia os exemplos.
    3. Muda uma coisa pequena e observa o resultado (no browser e na consola).
    4. Faz os exercícios no fim.
- **Pré‑requisitos rápidos (antes de começar):**
    - **Node.js + npm:** precisas de Node **18+** (ou mais recente) e npm. Sem isto não consegues instalar dependências.
    - **Editor de código:** VS Code (recomendado) ou similar com suporte para JavaScript/JSX.
    - **Terminal:** para correr comandos (`npm`, `node`, etc.).
    - **Browser atualizado:** Chrome/Edge/Firefox para testar.

### 0.1 Confirmação rápida (2 comandos)

No terminal:

```bash
node -v
npm -v
```

Se aparecerem versões (ex.: `v20.x` e `10.x`), está tudo ok.

<a id="sec-1"></a>

## 1. [ESSENCIAL] O que é React e como funciona

### 1.1 Modelo mental (a ideia central)

React é uma biblioteca para construir interfaces (UI). Em vez de dizeres ao browser:

- “cria um `<p>`”
- “agora muda o texto”
- “agora esconde este botão”

tu descreves **como a interface deve estar** para um certo estado.

Ou seja, tu dizes:

- “se `logado === true`, mostra o menu”
- “se `loading === true`, mostra ‘A carregar…’”

E o React trata de atualizar o ecrã quando os dados mudam.

> **Nota sobre SPA:** “Single Page Application” não significa uma única página de conteúdo. Significa que a app **não recarrega o browser** a cada mudança. O conteúdo muda por JavaScript (vais ver melhor quando entrarem rotas em `09_react_router_fundamentos.md`).

---

### 1.2 UI declarativa vs “mudar o ecrã à mão”

#### A) “Mudar o ecrã à mão” (ideia geral, imperativo)

Sem React, era comum fazer algo do género:

- procurar um elemento no DOM (`document.querySelector`)
- e depois alterar o texto/classe/visibilidade.

Isto funciona, mas quando a app cresce, começa a ficar confuso:

- tens de te lembrar de atualizar tudo no sítio certo,
- e é fácil criar bugs (um sítio atualiza, outro não).

#### B) UI declarativa (React)

Em React, escreves a regra no JSX:

- “se a condição for verdadeira, mostra X; se não, mostra Y”.

Exemplo simples (só para perceber a ideia):

```jsx
function Mensagem({ logado }) {
    return <p>{logado ? "Bem-vindo!" : "Faz login para continuar."}</p>;
}
```

Aqui não há `querySelector`. A UI “cai” da regra.

---

### 1.3 DOM real e “DOM virtual” (explicação simples)

- **DOM (Document Object Model):** é a árvore de elementos HTML que o browser usa para mostrar a página.
- **Problema:** mexer no DOM diretamente, muitas vezes, é lento e difícil quando tens muitos elementos.
- **Como o React ajuda:** o React calcula como a UI deve ficar e aplica apenas as alterações necessárias no DOM real.

Não precisas de decorar termos. O importante é isto:

> Tu descreves a UI, o React trata das atualizações.

---

### 1.4 O que é um componente (e porque é que ele “volta a correr”)

Um componente é uma **função** que devolve JSX (o “desenho” da UI).

A ideia essencial:

- quando **estado** ou **props** mudam, o React **volta a chamar a função** do componente para calcular o JSX atualizado.

Mini-diagrama:

```
estado/props mudam
   ↓
React volta a chamar o componente
   ↓
novo JSX é calculado
   ↓
o ecrã é atualizado
```

---

### 1.5 Experiência rápida (para veres um re-render)

Cria este componente e observa a consola:

```jsx
import { useState } from "react";

/**
 * Mostra que:
 * - o corpo do componente corre em cada render
 * - ao mudar estado, o componente volta a correr
 */
function App() {
    const [count, setCount] = useState(0);

    console.log("RENDER do App. count =", count);

    return (
        <main>
            <h1>React a correr</h1>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Somar</button>
        </main>
    );
}

export default App;
```

O que deves ver:

- quando abres a página, aparece 1 log (primeiro render);
- quando clicas, aparece novo log (novo render).

Isto é normal e é uma parte central do React.

---

### 1.6 JSX não é HTML (diferenças que aparecem logo)

Algumas diferenças que aparecem muito cedo:

- `class` em HTML → `className` em JSX
- `for` em HTML → `htmlFor` em JSX
- atributos e estilos seguem regras do JavaScript

Exemplo:

```jsx
function Cartao() {
    return (
        <div className="card">
            <label htmlFor="nome">Nome</label>
            <input id="nome" />
        </div>
    );
}
```

---

### 1.7 Glossário rápido (para ires usando nos próximos ficheiros)

- **Componente:** função que devolve JSX.
- **JSX:** forma de escrever UI dentro do JavaScript.
- **Props:** dados que entram no componente vindos do “pai”.
- **State (estado):** dados guardados no componente que, quando mudam, causam re-render.
- **Hook:** função do React que dá “poderes” ao componente (ex.: `useState`, `useEffect`).

---

### 1.8 Erros comuns

- Pensar que React é “a app toda” (React é a camada de UI; depois juntas router, pedidos, etc.).
- Tentar manipular o DOM manualmente com `document.querySelector` (em React, isso deve ser raro).
- Confundir HTML com JSX (há diferenças, como `className`).

### 1.9 Boas práticas

- Pensa em blocos pequenos (componentes) e reutilizáveis.
- Escreve regras para a UI (declarativo), em vez de passos para “mexer no ecrã”.

### 1.10 Checkpoint

- Explica, com as tuas palavras, o que quer dizer “UI declarativa”.
- O que é um componente em React?
- O que acontece quando o estado muda?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Criar um projeto com Vite

### 2.1 O que é o Vite (e o que ele te dá)

O Vite é uma ferramenta que cria e gere o teu projeto React. Dá-te:

- um **servidor de desenvolvimento** (para veres a app a correr localmente),
- atualização rápida quando guardas ficheiros (sem recarregar a página),
- e um processo de **build** (para preparar a app para produção).

Pensa assim:

- **dev** = trabalhar e testar no teu computador
- **build** = preparar uma versão “final” para publicar

---

### 2.2 Passos (com o que cada comando faz)

1. Criar o projeto (estrutura inicial):

```bash
npm create vite@latest meu-app -- --template react
```

2. Entrar na pasta do projeto:

```bash
cd meu-app
```

3. Instalar dependências (cria/usa `node_modules`):

```bash
npm install
```

4. Iniciar o servidor local:

```bash
npm run dev
```

Se o terminal mostrar um link (ex.: `http://localhost:5173`), abre-o no browser.

> **Nota (Ficha 03/04):** nesses tutoriais vais ver imports com alias `@/` (ex.: `@/components/...`).  
> Esse atalho precisa de configuração extra (`vite.config.js` + `jsconfig.json`), explicada na Ficha 03. Aqui ainda não usamos alias.

---

### 2.3 O que é “instalar dependências” (para perceberes o `node_modules`)

Quando fazes `npm install`, o npm descarrega bibliotecas que o projeto precisa.
Essas bibliotecas vão para a pasta `node_modules`.

Regras importantes:

- `node_modules` pode ser enorme.
- Não se edita nada lá dentro.
- Em trabalhos com Git, normalmente **não se envia** `node_modules` (instala-se com `npm install` no computador de cada pessoa).

---

### 2.4 Onde estão os comandos do `npm run ...`? (package.json)

O `npm run dev` não é “mágico”: ele executa um script que está no `package.json`.

Mais tarde vais ver scripts como:

- `npm run dev` → servidor local
- `npm run build` → versão final
- `npm run preview` → ver a versão final no teu computador

---

### 2.5 Se algo correr mal (problemas típicos)

#### A) Esqueci-me do `npm install`

Sintoma: erros a dizer que falta algo.

Solução:

```bash
npm install
npm run dev
```

#### B) Pasta com espaços ou caracteres estranhos

Sintoma: erros estranhos no terminal.

Solução:

- cria o projeto numa pasta com nome simples, por exemplo `C:\Projetos\react` ou `~/Projetos/react`.

#### C) Porta ocupada

Sintoma: o Vite tenta usar outra porta ou dá erro.

Solução:

- fecha o terminal de outra app que esteja a usar essa porta, ou aceita a nova porta que o Vite sugerir.

#### D) Windows PowerShell a bloquear scripts (aparece muito)

Sintoma: erro parecido com “running scripts is disabled” ao correr `npm`.

Solução (uma forma simples):

- abre o PowerShell como administrador e define uma política menos restritiva para o utilizador atual:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Depois volta a correr:

```bash
npm run dev
```

> Se estiveres na escola e não tiveres permissões, chama o professor para ajudar.

---

### 2.6 Checkpoint

- Que comando instala dependências?
- Que comando inicia o servidor de desenvolvimento?
- Para que serve o `package.json`?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Estrutura base e primeiro componente

### 3.1 Mapa do projeto (o mínimo que precisas de saber já)

Depois de criares o projeto, vais ver (entre outras) estas partes:

- `index.html` → tem um `div` com `id="root"` (é onde o React “entra”).
- `src/main.jsx` → liga o React ao `#root` e renderiza o `App`.
- `src/App.jsx` → o componente principal que vais editar mais vezes.
- `package.json` → scripts e dependências.
- `node_modules` → dependências instaladas (não mexer).

Regra prática:

> No dia a dia, vais editar quase sempre `src/App.jsx` e criar ficheiros em `src/components`.

---

### 3.2 Como a app “entra” na página (fluxo completo)

O fluxo é este:

1. O browser abre `index.html` e encontra o `div#root`.
2. O `main.jsx` cria a raiz do React nesse `div#root`.
3. O React renderiza o `<App />` dentro do `root`.

Mini-diagrama:

```
index.html (div#root)
   ↓
src/main.jsx (createRoot + render)
   ↓
src/App.jsx (JSX do App)
```

---

### 3.3 Código do `main.jsx` (lê com calma)

```jsx
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
```

O que está a acontecer:

- `document.getElementById("root")` encontra o `div` no `index.html`.
- `createRoot(...)` cria a “raiz” do React.
- `.render(<App />)` diz ao React para desenhar o `App` dentro do `root`.

> **Nota sobre StrictMode (dev):** em desenvolvimento, o React pode repetir alguns renders/efeitos para ajudar a encontrar problemas. Em produção, não é assim. Mais detalhe no ficheiro 08 (useEffect).

---

### 3.4 O teu primeiro componente (App)

```jsx
// src/App.jsx
function App() {
    return (
        <main>
            <h1>Primeiro projeto React</h1>
            <p>Já está tudo ligado.</p>
        </main>
    );
}

export default App;
```

---

### 3.5 Experiência rápida: “guardar e ver a mudança”

1. Abre `src/App.jsx`.
2. Muda o texto do `<h1>`.
3. Guarda o ficheiro.
4. Volta ao browser.

Deves ver a mudança imediatamente.

Se não aparecer:

- confirma que o terminal ainda tem o `npm run dev` a correr;
- confirma que estás a editar o projeto certo.

---

### 3.6 Erros comuns (e como resolver)

#### A) Nada aparece no browser

Verifica:

- existe `id="root"` no `index.html`?
- o `main.jsx` tem `getElementById("root")`?
- o terminal mostra o servidor a correr?

#### B) “App is not defined” / “export default”

Se apagares o `export default App`, o React deixa de conseguir importar o componente.

Solução:

- volta a colocar `export default App;` no fim do ficheiro.

#### C) Editar `index.html` à espera de “reagir”

O React reage quando mudas **estado/props**. O `index.html` é mais “casca” inicial.
No dia a dia, vais mexer sobretudo no `src/`.

---

### 3.7 Checkpoint

- Qual é a função do `div#root` no `index.html`?
- Onde é que o `App` é ligado à página?
- Qual é o ficheiro que vais editar mais vezes no início?

<a id="sec-4"></a>

## 4. [EXTRA] Ferramentas de apoio e hábitos iniciais

### 4.1 React DevTools (ver componentes no browser)

Instala a extensão **React Developer Tools** no teu browser.
Depois, nas DevTools, aparece o separador **Components**.

O que dá para ver:

- a árvore de componentes (ex.: `App`, e mais tarde os teus componentes)
- props e estado (quando já estiveres a usar `useState`)

### 4.2 Consola e separador Network (para pedidos)

Duas zonas onde vais passar muito tempo:

- **Console**: erros e logs (`console.log`, `console.error`).
- **Network**: pedidos HTTP (vais usar muito quando entrarem APIs e `fetch`).

### 4.3 Hábitos simples que ajudam muito

- Lê as mensagens de erro do terminal e do browser com calma (elas costumam dizer o ficheiro e a linha).
- Faz mudanças pequenas e testa logo (não acumulando erros).
- Se algo “deixou de funcionar”, volta atrás (Ctrl+Z) e tenta perceber o que mudou.

### 4.4 (Opcional) Git desde o início

Se estiverem a usar Git:

- faz um commit depois de criares o projeto (estado “limpo”),
- não versionas `node_modules` (porque instala-se com `npm install`).

<a id="exercicios"></a>

## Exercícios - Fundamentos e setup

1. Cria um projeto novo com Vite e abre-o no browser.
2. Muda o texto do `<h1>` para o teu nome (em `src/App.jsx`).
3. Adiciona um segundo parágrafo e confirma que o browser atualiza ao guardar.
4. Abre o `index.html` e encontra o `div` com `id="root"`.
5. Explica por escrito o caminho: `index.html` → `main.jsx` → `App.jsx`.
6. Adiciona um botão que mostre um `alert("Olá")` ao clicar (usa `onClick`).
7. (Observação) Mete um `console.log("RENDER")` no `App` e confirma que ele aparece:
    - quando a página abre,
    - e quando fazes uma mudança ao código e guardas.
8. Cria `src/components/Saudacao.jsx` com um componente simples e usa-o no `App`.
9. (Diagnóstico) Apaga o `export default` do `App` de propósito, lê o erro, e volta a corrigir.
10. Instala React DevTools e confirma que consegues ver o componente `App` no separador **Components**.

<a id="changelog"></a>

## Changelog

- 2026-01-11: criação do ficheiro.
- 2026-01-12: clarificação de SPA e reforço de onde editar e do papel do `root`.
- 2026-01-26: expansão didática (modelo mental declarativo, re-render observável, Vite explicado por comandos, troubleshooting comum, e exercícios com diagnóstico).
