# React.js (12.º Ano) - 09 · React Router (fundamentos)

> **Objetivo deste ficheiro**
>
> - Perceber o problema que o React Router resolve numa **SPA** (aplicação de uma só página).
> - Instalar e configurar o `react-router-dom` num projeto **React + Vite**.
> - Criar rotas com `<Routes>` e `<Route>` e navegar sem recarregar a página.
> - Usar `<Link>`, `<NavLink>` e `useNavigate()` (navegação declarativa e programática).
> - Criar uma rota **404** e uma estrutura simples de páginas (com boas práticas).

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] O problema: várias páginas numa SPA](#sec-1)
- [2. [ESSENCIAL] Instalar e ligar o Router](#sec-2)
- [3. [ESSENCIAL] Rotas: `<Routes>` e `<Route>`](#sec-3)
- [4. [ESSENCIAL] Navegação sem refresh: `<Link>` e `<NavLink>`](#sec-4)
- [5. [ESSENCIAL] Navegação programática: `useNavigate()`](#sec-5)
- [6. [EXTRA] Layout e rotas aninhadas com `<Outlet />`](#sec-6)
- [7. [EXTRA] Rota 404 e o “refresh” em rotas internas](#sec-7)
- [8. [EXTRA] Organização de pastas para páginas e componentes](#sec-8)
- [Exercícios - React Router (fundamentos)](#exercicios)
- [Changelog](#changelog)

---

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **Antes de começares:** confirma que dominas `useState` e eventos (`04_estado_e_eventos.md`) e renderização condicional/listas (`05_listas_e_condicionais.md`).
- **Forma de estudar:**
    1. Cria 2–3 páginas simples.
    2. Faz navegação com `Link` e confirma que **não há refresh**.
    3. Só depois adiciona `NavLink`, 404 e layout.
- **Nota importante:** este ficheiro é **fundamentos**. Rotas dinâmicas (ex.: `/alunos/:id`) e parâmetros ficam no `10_navegacao_e_rotas_dinamicas.md`.

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] O problema: várias páginas numa SPA

### 1.1 O que é uma SPA?

Uma **SPA** (Single Page Application) é uma aplicação em que:

- o browser carrega **um único HTML** (ex.: `index.html`) e um pacote de JavaScript,
- a aplicação muda de “página” **sem recarregar** o site,
- a mudança é feita alterando o que se mostra no ecrã (componentes React).

Isto tem uma vantagem grande:

- A experiência fica mais rápida (sem “piscar” de refresh).
- O estado pode manter-se (por exemplo, carrinho, filtros, dados em memória).

### 1.2 Então por que precisamos de “rotas”?

Mesmo numa SPA, tu queres coisas como:

- URL diferente para cada “página” (ex.: `/`, `/sobre`, `/contactos`)
- botão “voltar atrás” a funcionar
- poder partilhar um link e abrir exatamente naquela página

Sem um router, tu acabas com este tipo de código:

- um `useState` no `App` para guardar “qual página está ativa”
- muitos `if`s e `switch` para mostrar páginas
- e a URL não muda (ou seja, não dá para partilhar links)

O **React Router** resolve isto de forma profissional:

- liga **URL ↔ componente**
- muda a URL sem refresh
- mantém histórico (voltar/avançar)

### 1.3 Modelo mental (muito útil)

Pensa assim:

- O React Router “ouve” a URL atual (ex.: `/sobre`)
- Encontra a rota que corresponde a essa URL
- Mostra o componente certo

Mini-diagrama:

```
URL muda (ex.: /sobre)
   ↓
Router procura uma rota que combine
   ↓
React desenha o componente dessa rota
   ↓
Sem refresh da página
```

### 1.4 Rotas do browser vs rotas do React

- **Rota do browser (tradicional):**
    - O browser pede ao servidor a página `/sobre`
    - O servidor responde com um HTML diferente

- **Rota numa SPA (React Router):**
    - O servidor devolve sempre o mesmo `index.html`
    - O React Router escolhe o componente a mostrar consoante a URL

Isto explica uma coisa importante que vais ver no fim (secção 7):
**quando fazes refresh numa rota interna, o servidor tem de estar configurado para devolver o `index.html`.**

---

<a id="sec-2"></a>

## 2. [ESSENCIAL] Instalar e ligar o Router

### 2.1 Instalar a biblioteca

No terminal (na pasta do projeto):

```bash
npm install react-router-dom
```

Confirma no `package.json` que aparece em `dependencies`.

### 2.2 Onde é que o Router deve estar?

O router deve envolver a tua aplicação **no ponto de entrada** (normalmente em `main.jsx`).

A ideia é simples:

- O Router precisa de estar “por cima” do `App`
- Assim, qualquer componente dentro do `App` pode usar rotas, links e hooks do router

### 2.3 Exemplo: `main.jsx` com `<BrowserRouter>`

```jsx
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
);
```

#### O que é o `BrowserRouter`?

É o tipo de router mais comum. Usa as URLs “normais” do browser (ex.: `/sobre`) e o histórico (voltar/avançar).

> **Nota curta:** existe também `HashRouter` (URLs com `#`), mas em projetos atuais e com Vite, o normal é `BrowserRouter`.

### 2.4 Erros comuns nesta fase

- Esquecer-se de instalar `react-router-dom`.
- Usar `<Routes>` sem envolver a app com `<BrowserRouter>`. (Vai dar erro.)
- Envolver o router no sítio errado (muito “baixo” na árvore).

### 2.5 Checkpoint

- Porque é que o `<BrowserRouter>` deve envolver o `<App />`?
- O que ganhas ao ter URLs diferentes para páginas diferentes?

---

<a id="sec-3"></a>

## 3. [ESSENCIAL] Rotas: `<Routes>` e `<Route>`

### 3.1 O que são “rotas” no React Router?

Uma **rota** é uma regra do tipo:

- Se a URL for `X`, mostra o componente `Y`.

Exemplo:

- `/` → `Home`
- `/sobre` → `Sobre`

### 3.2 O que é `<Routes>`?

`<Routes>` é o “contentor” onde defines as rotas.

Pensa nele como: “Aqui dentro estão todas as páginas possíveis da aplicação”.

### 3.3 O que é `<Route>`?

`<Route>` define uma rota individual com duas coisas essenciais:

- `path` → o caminho na URL
- `element` → o componente a mostrar

Exemplo:

```jsx
<Route path="/sobre" element={<Sobre />} />
```

### 3.4 Primeiro exemplo completo: 2 páginas + rotas

Cria páginas simples:

```jsx
// src/pages/Home.jsx
function Home() {
    return <h1>Home</h1>;
}

export default Home;
```

```jsx
// src/pages/Sobre.jsx
function Sobre() {
    return <h1>Sobre</h1>;
}

export default Sobre;
```

No `App.jsx`:

```jsx
// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Sobre from "./pages/Sobre.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
        </Routes>
    );
}

export default App;
```

### 3.5 “Como é que o Router escolhe a rota certa?”

O router faz **comparação do caminho** (`path`) com a URL atual.

- Se a URL for `/`, combina com `path="/"`.
- Se a URL for `/sobre`, combina com `path="/sobre"`.

Se nenhuma rota combinar, tens de ter uma rota 404 (ver secção 7).

### 3.6 Rotas absolutas e relativas (para não confundir)

Neste ficheiro, vamos usar caminhos “absolutos” (com `/`) porque é o mais direto.

Mais à frente, com rotas aninhadas (`<Outlet />`), vais ver caminhos relativos.

### 3.7 Erros comuns nesta secção

- Escrever o `element` sem JSX (por exemplo, `element={Home}` em vez de `element={<Home />}`).
- Criar páginas dentro do `App.jsx` e depois ficar difícil de manter (ver secção 8).
- Esquecer a rota 404 e ficar com ecrã “vazio” quando a rota não existe.

### 3.8 Checkpoint

- O que faz `<Routes>`?
- O que faz `<Route path="..." element={...} />`?

---

<a id="sec-4"></a>

## 4. [ESSENCIAL] Navegação sem refresh: `<Link>` e `<NavLink>`

### 4.1 Porque não usar `<a href="...">`?

Se fizeres isto numa SPA:

```jsx
<a href="/sobre">Sobre</a>
```

O browser interpreta como navegação “normal” e:

- faz refresh,
- perde estado (em memória),
- e volta a pedir recursos ao servidor.

O React Router dá-te `<Link>` para evitar isso:

- muda a URL com a History API
- atualiza o componente
- **sem recarregar** a página

### 4.2 `<Link>` (navegação normal)

Exemplo:

```jsx
import { Link } from "react-router-dom";

function Menu() {
    return (
        <nav>
            <Link to="/">Home</Link> | <Link to="/sobre">Sobre</Link>
        </nav>
    );
}

export default Menu;
```

> Repara na prop `to`: é o destino (path) para onde queres ir.

### 4.3 Exemplo: menu + rotas (tudo junto)

```jsx
// src/App.jsx
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Sobre from "./pages/Sobre.jsx";

function App() {
    return (
        <div>
            <nav>
                <Link to="/">Home</Link> | <Link to="/sobre">Sobre</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sobre" element={<Sobre />} />
            </Routes>
        </div>
    );
}

export default App;
```

### 4.4 `<NavLink>` (link com “ativo”)

`NavLink` é como `Link`, mas ajuda a aplicar estilos quando a rota está ativa.

Isso é útil para menus, porque queres mostrar ao utilizador “onde está”.

Exemplo com classe:

```jsx
import { NavLink } from "react-router-dom";

function Menu() {
    return (
        <nav>
            <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "ativo" : "")}
            >
                Home
            </NavLink>

            {" | "}

            <NavLink
                to="/sobre"
                className={({ isActive }) => (isActive ? "ativo" : "")}
            >
                Sobre
            </NavLink>
        </nav>
    );
}

export default Menu;
```

CSS (exemplo simples):

```css
/* src/index.css (ou App.css) */
.ativo {
    font-weight: bold;
    text-decoration: underline;
}
```

### 4.5 Boas práticas de navegação

- Usa `<Link>`/`<NavLink>` para navegar dentro da app.
- Usa `<a>` apenas para links externos (ex.: outro site).
- Se o menu crescer, cria um componente `Navbar` em `components/`.

### 4.6 Checkpoint

- Qual é a diferença prática entre `<a>` e `<Link>` numa SPA?
- Para que serve o `NavLink`?

---

<a id="sec-5"></a>

## 5. [ESSENCIAL] Navegação programática: `useNavigate()`

### 5.1 O que é “navegar programaticamente”?

É navegar **por código**, em vez de ser por clique num link.

Isto faz sentido em situações como:

- depois de submeter um formulário com sucesso → ir para outra página
- depois de login → ir para o dashboard
- depois de guardar um item → voltar para a lista

### 5.2 `useNavigate()` (o essencial)

`useNavigate` devolve uma função `navigate(...)`.

Exemplo simples:

```jsx
import { useNavigate } from "react-router-dom";

function IrParaSobre() {
    const navigate = useNavigate();

    function ir() {
        navigate("/sobre");
    }

    return <button onClick={ir}>Ir para Sobre</button>;
}

export default IrParaSobre;
```

### 5.3 `navigate(-1)` e `navigate(1)`

Também podes usar números para mexer no histórico:

- `navigate(-1)` → voltar atrás
- `navigate(1)` → avançar

Exemplo:

```jsx
import { useNavigate } from "react-router-dom";

function Voltar() {
    const navigate = useNavigate();

    return <button onClick={() => navigate(-1)}>Voltar</button>;
}

export default Voltar;
```

### 5.4 `replace: true` (quando não queres ficar no histórico)

Em certos casos (ex.: login), não queres que o utilizador carregue “voltar” e volte ao formulário.

Aí podes fazer:

```jsx
navigate("/dashboard", { replace: true });
```

### 5.5 Erros comuns

- Tentar usar `useNavigate` fora de um router (sem `<BrowserRouter>`).
- Navegar para uma rota que não existe e ficar com ecrã “vazio” (resolver com 404).
- Usar `useNavigate` quando um `Link` era suficiente (para menus, preferir `Link`/`NavLink`).

### 5.6 Checkpoint

- Dá 2 exemplos reais em que faz sentido usar `useNavigate`.
- Para que serve `replace: true`?

---

<a id="sec-6"></a>

## 6. [EXTRA] Layout e rotas aninhadas com `<Outlet />`

### 6.1 O problema do “menu repetido”

Se tiveres várias páginas e todas precisam do mesmo menu, isto é chato:

- repetir `<nav>...</nav>` em todas as páginas
- ou encher o `App` de lógica

O padrão profissional é ter um **layout**:

- o layout tem o menu (e talvez footer)
- o conteúdo da página muda “no meio”

### 6.2 O que é o `<Outlet />`?

`Outlet` é o sítio onde o router vai desenhar as rotas “filhas”.

Pensa: “Aqui aparece o conteúdo da página atual”.

### 6.3 Exemplo: Layout + rotas aninhadas

Cria um layout:

```jsx
// src/pages/Layout.jsx
import { NavLink, Outlet } from "react-router-dom";

function Layout() {
    return (
        <div>
            <nav>
                <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? "ativo" : "")}
                >
                    Home
                </NavLink>

                {" | "}

                <NavLink
                    to="/sobre"
                    className={({ isActive }) => (isActive ? "ativo" : "")}
                >
                    Sobre
                </NavLink>
            </nav>

            <hr />

            <Outlet />
        </div>
    );
}

export default Layout;
```

Depois, no `App.jsx`, defines as rotas com “pai + filhos”:

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
                {/* index = rota filha para "/" */}
                <Route index element={<Home />} />

                {/* "sobre" (sem /) porque é filha de "/" */}
                <Route path="sobre" element={<Sobre />} />
            </Route>
        </Routes>
    );
}

export default App;
```

### 6.4 Repara nestes detalhes

- O layout é uma rota “pai”.
- A Home é uma rota `index` (significa: “quando o path do pai é exatamente igual”).
- A rota `sobre` fica como `path="sobre"` porque é filha de `/`.

### 6.5 Quando usar este padrão?

- Quando tiveres um menu fixo.
- Quando tiveres páginas com o mesmo “molde” (menu + conteúdo).
- Quando precisares de organizar rotas por secções.

---

<a id="sec-7"></a>

## 7. [EXTRA] Rota 404 e o “refresh” em rotas internas

### 7.1 Rota 404 (quando nada coincide)

A rota 404 é uma rota especial com `path="*"`.

Cria uma página:

```jsx
// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div>
            <h1>Página não encontrada</h1>
            <p>O endereço que escreveste não existe nesta aplicação.</p>
            <Link to="/">Voltar à Home</Link>
        </div>
    );
}

export default NotFound;
```

E adiciona a rota no fim:

```jsx
// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Sobre from "./pages/Sobre.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
```

> **Regra prática:** a rota `*` deve estar **no fim**, porque é o “apanha tudo”.

### 7.2 “Porquê que ao fazer refresh em /sobre dá erro num servidor real?”

Em desenvolvimento (Vite), isto costuma funcionar bem.
Mas em produção, pode acontecer:

- abres `/sobre` diretamente
- o servidor procura um ficheiro/página `/sobre`
- como não existe, devolve 404

Mas numa SPA, o servidor devia devolver sempre o `index.html`.

**Conclusão:**

- Em produção, o servidor (ou hosting) tem de estar configurado para “fallback” para o `index.html`.

> Se mais tarde fizeres deploy (Netlify, Vercel, GitHub Pages, etc.), vamos ver como configurar isto. Aqui fica só a ideia, para não parecer um bug “misterioso”.

---

<a id="sec-8"></a>

## 8. [EXTRA] Organização de pastas para páginas e componentes

### 8.1 Regra simples: `pages` vs `components`

- `pages/` → componentes que representam **páginas** (normalmente têm rotas)
- `components/` → componentes reutilizáveis (navbar, botão, card, etc.)

> **Nota didática (Ficha 04):** para evitar uma refatoração estrutural durante a migração, a Ficha 04 mantém as “páginas” dentro de `components/`.  
> Aqui usamos `pages/` porque é a organização mais comum em projetos reais.

Exemplo de estrutura:

```
src/
  pages/
    Home.jsx
    Sobre.jsx
    Contactos.jsx
    NotFound.jsx
    Layout.jsx
  components/
    Navbar.jsx
    Footer.jsx
  App.jsx
  main.jsx
```

### 8.2 Porquê isto ajuda?

- O `App.jsx` fica mais limpo (só rotas).
- Cada página cresce sem “poluir” o router.
- Os componentes reutilizáveis ficam fáceis de encontrar.

### 8.3 Boas práticas

- Mantém nomes consistentes: `Home.jsx`, `Sobre.jsx`, `NotFound.jsx`.
- Não metas componentes pequenos em `pages` só porque “aparecem na página”.
- Se a Navbar ficar grande, move-a para `components/Navbar.jsx` e usa no `Layout`.

---

<a id="exercicios"></a>

## Exercícios - React Router (fundamentos)

1. No teu projeto React + Vite, instala o router: `npm install react-router-dom`.
2. Envolve o `<App />` com `<BrowserRouter>` em `src/main.jsx`.
3. Cria a pasta `src/pages` e cria `Home.jsx` e `Sobre.jsx` com um `<h1>` em cada.
4. Em `src/App.jsx`, cria `<Routes>` com rotas para `/` e `/sobre`.
5. Adiciona um menu com `<Link>` para navegar entre Home e Sobre. Confirma que a navegação **não faz refresh**.
6. Troca `Link` por `NavLink` e aplica uma classe `"ativo"` ao link ativo (com `className={({isActive}) => ...}`).
7. Cria `Contactos.jsx` e adiciona a rota `/contactos` + link no menu.
8. Cria `NotFound.jsx` e adiciona a rota `path="*"` para 404. Testa com um endereço inventado.
9. (Extra) Cria `Layout.jsx` com menu + `<Outlet />` e muda as rotas para usar layout e rotas aninhadas.
10. (Extra) Cria um botão numa página que use `useNavigate()` para ir para `/contactos`.
11. Escreve 3 linhas a explicar por que razão `<Link>` é melhor que `<a>` numa SPA.

---

<a id="changelog"></a>

## Changelog

- 2026-01-11: criação do ficheiro.
- 2026-01-12: exemplos básicos com Routes/Route e navegação com Link.
- 2026-01-26: reescrita com modelo mental de SPA, setup mais claro, Link/NavLink com `isActive`, `useNavigate`, layout com Outlet, rota 404 e nota sobre refresh em produção.
