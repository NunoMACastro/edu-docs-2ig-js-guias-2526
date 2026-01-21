# React.js (11.º Ano) - 09 · React Router: fundamentos e setup

> **Objetivo deste ficheiro**
> Perceber o que é routing no frontend e porque é necessário.
> Instalar o React Router e configurar rotas básicas.
> Criar navegação entre páginas sem recarregar o browser.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] O que é routing no frontend](#sec-1)
-   [2. [ESSENCIAL] Instalar e configurar o Router](#sec-2)
-   [3. [ESSENCIAL] Routes, Route, Link e NavLink](#sec-3)
-   [4. [EXTRA] Estrutura simples de páginas](#sec-4)
-   [Exercícios - React Router fundamentos](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** foca as rotas básicas antes de estruturar pastas.
-   **Como estudar:** cria 2 ou 3 páginas e muda entre elas.
-   **Ligações:** se precisares, revê componentes e estado em `08_useEffect_e_dados.md`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] O que é routing no frontend

### Modelo mental

Routing é a forma de ligar uma URL a uma parte da interface. Em React, isso permite ter várias páginas sem recarregar o browser. O React Router controla o que aparece quando o caminho muda.

Imagina a aplicação como um livro:

-   A **URL** é o número da página.
-   O **Router** decide que conteúdo mostrar com base nesse número.
-   O React troca o conteúdo **sem recarregar** o site inteiro.

Sem routing, terias de criar uma app diferente para cada página, ou recarregar o browser sempre que mudas de página.

O React Router é a **biblioteca oficial mais usada** para fazer routing em apps React. Ele implementa o chamado **client-side routing**:

-   A aplicação carrega uma vez (uma única página).
-   O Router observa a URL.
-   Quando a URL muda, o Router troca os componentes no ecrã.
-   O botão "voltar" e "avançar" do browser continuam a funcionar.

> **Nota:** o servidor continua a devolver o mesmo `index.html`. Quem decide o que mostrar é o React Router, no lado do cliente.

### Sintaxe base (passo a passo)

-   **Uma rota liga um caminho a um componente:** `/sobre` → `<Sobre />`.
-   **A app tem um Router global:** ele observa as mudanças da URL.
-   **Quando o caminho muda, o Router troca o componente.**
-   **Não há reload:** o estado e a interface mantêm-se.

### Exemplo

```jsx
// Exemplo simples de páginas como componentes
function Home() {
    // Esta é a página inicial
    return <h1>Home</h1>;
}

function Sobre() {
    // Esta é a página "Sobre"
    return <h1>Sobre</h1>;
}
```

### Erros comuns

-   Usar links com `<a>` e forçar recarregamento da página.
-   Misturar páginas e componentes pequenos no mesmo ficheiro.
-   Criar várias páginas dentro do `App` sem rotas, ficando tudo visível ao mesmo tempo.

### Boas práticas

-   Cada página deve ser um componente separado.
-   Mantém a navegação visível em todas as páginas.
-   Usa nomes claros para páginas: `Home`, `Sobre`, `Contactos`.

### Checkpoint

-   O que é client-side routing numa frase?
-   Porque é que o React Router evita reload?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Instalar e configurar o Router

### Modelo mental

O React Router é uma biblioteca extra. Depois de instalada, o `BrowserRouter` deve envolver toda a app para permitir a navegação.

Pensa no `BrowserRouter` como o "motor" das rotas. Sem ele, o React não sabe interpretar a URL.

### Sintaxe base (passo a passo)

-   **Instala a biblioteca:** `npm install react-router-dom`.
-   **Importa `BrowserRouter`:** vem de `"react-router-dom"`.
-   **Envolve o `App`:** coloca `<BrowserRouter>` no `main.jsx`.
-   **Deixa o `App` focado em rotas:** não precisas de Router dentro do `App` se já tens no `main.jsx`.

### Exemplo

```bash
# Instala o React Router para gerir rotas
npm install react-router-dom
```

```jsx
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* O BrowserRouter permite mudar de página sem recarregar */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
```

> **Aviso:** se esqueceres o `BrowserRouter`, vais ver erros ao usar `Link` ou `Routes`.

### Erros comuns

-   Importar `BrowserRouter` do sítio errado.
-   Envolver apenas uma parte da app e perder o contexto.
-   Esquecer o `BrowserRouter` e obter erros ao usar `Link`/`Routes`.

### Boas práticas

-   Coloca o Router no ficheiro principal (`main.jsx`).
-   Se tiveres testes, envolve o `App` com `BrowserRouter` também nos testes.

### Checkpoint

-   Onde é que o `BrowserRouter` deve ficar?
-   O que acontece se esqueceres o `BrowserRouter`?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Routes, Route, Link e NavLink

### Modelo mental

`Routes` é o bloco que agrupa as rotas. Cada `Route` define um caminho e o componente que deve ser mostrado. Para navegar, usa `Link` (não `<a>`).

Diferença rápida:

-   **`Link`** muda a URL sem recarregar.
-   **`NavLink`** faz o mesmo, mas também permite estilizar o link ativo.
-   **`useNavigate`** é para navegar por código (ex.: depois de um submit).

### Sintaxe base (passo a passo)

-   **`Routes`** envolve todas as rotas.
-   **`Route`** tem `path` e `element`.
-   **`Link`** usa `to="/caminho"`.
-   **`NavLink`** aplica classe automática quando ativo.
-   **O `element` recebe JSX:** `element={<Home />}`.

### Exemplo

```jsx
// src/App.jsx
import { Routes, Route, Link, NavLink } from "react-router-dom";

function Home() {
    return <h1>Home</h1>;
}

function Sobre() {
    return <h1>Sobre</h1>;
}

function Contactos() {
    return <h1>Contactos</h1>;
}

function App() {
    return (
        <div>
            <nav>
                {/* Link evita o recarregamento da página */}
                <Link to="/">Home</Link>
                {/* NavLink permite aplicar estilo quando ativo */}
                <NavLink to="/sobre">Sobre</NavLink>
                <NavLink to="/contactos">Contactos</NavLink>
            </nav>

            <Routes>
                {/* Cada rota liga um caminho a um componente */}
                <Route path="/" element={<Home />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/contactos" element={<Contactos />} />
            </Routes>
        </div>
    );
}

export default App;
```

### Mini-demonstrador: `<a>` vs `Link`

```jsx
// Exemplo conceptual (não usar ambos ao mesmo tempo)
// <a> faz reload e perde o estado atual
<a href="/sobre">Sobre</a>

// Link muda de rota sem recarregar a app
<Link to="/sobre">Sobre</Link>
```

### Erros comuns

-   Esquecer o `Routes` e colocar `Route` solto.
-   Usar `<a href>` e perder o estado da app.
-   Escrever `element={Home}` em vez de `element={<Home />}`.

### Boas práticas

-   Mantém o menu simples e consistente.
-   Usa `NavLink` quando precisares de mostrar a página ativa.
-   Centraliza o menu num componente `Nav` se ficar grande.

### Resumo rápido: Link vs useNavigate

-   **`Link`/`NavLink`:** navegação declarativa (cliques normais).
-   **`useNavigate`:** navegação programática (depois de ações).

### Checkpoint

-   Qual é a diferença prática entre `<a>` e `<Link>`?
-   Para que serve o `NavLink`?

<a id="sec-4"></a>

## 4. [EXTRA] Estrutura simples de páginas

### Modelo mental

Separar páginas em ficheiros facilita a manutenção. Cada página vive numa pasta `pages`. Assim, o `App` fica focado em rotas e não em conteúdo.

### Sintaxe base

-   `src/pages/Home.jsx`
-   `src/pages/Sobre.jsx`
-   `src/pages/Contactos.jsx`

### Exemplo

```jsx
// src/pages/Home.jsx
function Home() {
    // Página inicial separada do App
    return <h1>Home</h1>;
}

export default Home;
```

```jsx
// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";

function App() {
    return (
        <Routes>
            {/* O App apenas organiza as rotas */}
            <Route path="/" element={<Home />} />
        </Routes>
    );
}

export default App;
```

### Layout Route com `<Outlet />`

```jsx
// src/pages/Layout.jsx
import { Outlet, NavLink } from "react-router-dom";

function Layout() {
    return (
        <div>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/sobre">Sobre</NavLink>
            </nav>
            <Outlet />
        </div>
    );
}

export default Layout;
```

```jsx
// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import Sobre from "./pages/Sobre.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="sobre" element={<Sobre />} />
            </Route>
        </Routes>
    );
}

export default App;
```

### Rota 404 (quando nada coincide)

```jsx
// src/App.jsx
import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound.jsx";

function App() {
    return (
        <Routes>
            {/* Outras rotas acima */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
```

### Erros comuns

-   Importar páginas com caminhos errados.
-   Guardar componentes pequenos na pasta `pages` sem necessidade.

### Boas práticas

-   Usa uma pasta `pages` para componentes de página.
-   Se uma página crescer, divide em componentes menores dentro de `components`.

### Checkpoint

-   Porque é que `pages` e `components` não devem ser misturados?
-   Quando faz sentido criar um componente novo dentro de `components`?

<a id="exercicios"></a>

## Exercícios - React Router fundamentos

1. Abre o terminal do projeto. Corre `npm install react-router-dom`. Abre o `package.json` e confirma que a dependência foi adicionada.
2. Abre `src/main.jsx`. Importa `BrowserRouter` de `"react-router-dom"`. Envolve o `<App />` com `<BrowserRouter>` e guarda o ficheiro.
3. Cria a pasta `src/pages`. Dentro, cria `Home.jsx` e `Sobre.jsx`, cada um com um `<h1>` e `export default`.
4. Abre `src/App.jsx`. Importa `Routes` e `Route`, e também as páginas `Home` e `Sobre`. Cria `<Routes>` e adiciona as rotas para `/` e `/sobre`.
5. No `App`, cria um `<nav>` com dois `Link`: um para `/` e outro para `/sobre`. Clica nos links e confirma que a página muda sem recarregar.
6. Troca `Link` por `NavLink`. Cria uma classe CSS simples (ex.: `.ativo`) e aplica essa classe ao link ativo usando a prop `className`. Confirma que o link ativo muda de estilo.
7. Adiciona uma página `Contactos` e a rota correspondente.
8. Move as páginas para uma pasta `pages`.
9. Confirma que a navegação não recarrega a página.
10. Cria uma rota `/ajuda` com um componente simples.
11. Escreve uma frase a explicar porque `Link` é melhor que `<a>`.

<a id="changelog"></a>

## Changelog

-   2026-01-11: criação do ficheiro.
-   2026-01-12: resumo Link vs useNavigate, exemplo de layout e rota 404.
-   2026-01-12: explicações detalhadas, exemplos extra e exercícios guiados.
-   2026-01-12: explicação reforçada sobre o React Router e exercícios 1-6 mais guiados.
