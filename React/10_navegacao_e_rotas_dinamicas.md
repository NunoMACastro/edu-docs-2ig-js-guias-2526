# React.js (11.º Ano) - 10 · Navegação e rotas dinâmicas

> **Objetivo deste ficheiro**
> Usar rotas dinâmicas com parâmetros e detalhes.
> Navegar por código com `useNavigate`.
> Criar layouts com rotas aninhadas e página 404.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Rotas dinâmicas com useParams](#sec-1)
-   [2. [ESSENCIAL] Navegação programática com useNavigate](#sec-2)
-   [3. [ESSENCIAL] Layouts e rotas aninhadas](#sec-3)
-   [4. [EXTRA] Página 404 e query string](#sec-4)
-   [Exercícios - Navegação e rotas dinâmicas](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** domina parâmetros e `useNavigate` antes de extras.
-   **Como estudar:** cria uma lista e liga cada item a uma página detalhe.
-   **Ligações:** revê `09_react_router_fundamentos.md` se tiveres dúvidas.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Rotas dinâmicas com useParams

### Modelo mental

Rotas dinâmicas usam uma parte da URL como **parâmetro**. Por exemplo, `/alunos/3` indica o id 3. O `useParams` permite ler esse valor dentro do componente.

Pensa assim: o caminho tem uma **parte variável**. O React Router guarda esse valor e entrega-te com `useParams`.

Exemplo mental:

-   URL: `/alunos/3`
-   Rota: `/alunos/:id`
-   `useParams()` devolve `{ id: "3" }`

Repara que o id vem como **texto**. Se precisares de tratar como número, faz a conversão (ex.: `Number(id)`).

### Sintaxe base (passo a passo)

-   **Define a rota com `:id`:** `/alunos/:id`.
-   **Cria uma página de detalhe:** `DetalheAluno`.
-   **Usa `useParams`:** `const { id } = useParams()`.
-   **Usa o id para mostrar dados:** por enquanto, podes só mostrar o id no ecrã.
-   **Se o id for inválido:** mostra uma mensagem simples (ex.: "Aluno não encontrado").
-   **Lembra-te:** `id` é texto; converte se precisares de comparar com números.

### Exemplo

```jsx
// src/App.jsx
import { Routes, Route } from "react-router-dom";
import ListaAlunos from "./pages/ListaAlunos.jsx";
import DetalheAluno from "./pages/DetalheAluno.jsx";

function App() {
    return (
        <Routes>
            {/* Rota de lista */}
            <Route path="/alunos" element={<ListaAlunos />} />
            {/* Rota dinâmica com parâmetro id */}
            <Route path="/alunos/:id" element={<DetalheAluno />} />
        </Routes>
    );
}

export default App;
```

```jsx
// src/pages/DetalheAluno.jsx
import { useParams } from "react-router-dom";

function DetalheAluno() {
    // Lemos o id diretamente da URL
    const { id } = useParams();

    return (
        <div>
            {/* Mostra o id para confirmar que funcionou */}
            <h1>Detalhe do aluno {id}</h1>
        </div>
    );
}

export default DetalheAluno;
```

```jsx
// src/pages/ListaAlunos.jsx
import { Link } from "react-router-dom";

// Lista de exemplo com id e nome
const alunos = [
    { id: 1, nome: "Ana" },
    { id: 2, nome: "Bruno" },
    { id: 3, nome: "Carla" },
];

function ListaAlunos() {
    return (
        <ul>
            {/* map cria um <li> por cada aluno */}
            {alunos.map((aluno) => (
                <li key={aluno.id}>
                    {/* Link aponta para o detalhe do aluno */}
                    <Link to={`/alunos/${aluno.id}`}>{aluno.nome}</Link>
                </li>
            ))}
        </ul>
    );
}

export default ListaAlunos;
```

### Erros comuns

-   Escrever `:id` no `Link` em vez de passar o valor.
-   Esquecer o `useParams` e ter `undefined`.
-   Tentar usar `useParams` fora de uma rota.
-   Comparar o id (texto) com números sem converter.

### Boas práticas

-   Usa ids reais e consistentes.
-   Valida se o id existe antes de mostrar detalhes.
-   Mantém os parâmetros simples (`id`, `slug`).

### Checkpoint

-   O que é que `useParams()` devolve num URL como `/alunos/3`?
-   Porque é que `id` vem como texto?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Navegação programática com useNavigate

### Modelo mental

`useNavigate` permite mudar de página **por código**. É útil quando queres navegar depois de uma ação (ex.: submit, login, guardar dados).

Pensa assim: em vez de clicares num link, **o código decide** mudar de página.

Também podes usar para voltar atrás (`navigate(-1)`) ou substituir o histórico (`navigate("/x", { replace: true })`).

### Sintaxe base (passo a passo)

-   **Importa o hook:** `import { useNavigate } from "react-router-dom";`
-   **Cria a função:** `const navigate = useNavigate();`
-   **Navega:** `navigate("/caminho")`.
-   **Opcional:** `navigate(-1)` para voltar atrás.
-   **Podes construir o caminho:** `navigate(`/alunos/${id}`)`.

### Exemplo

```jsx
// src/pages/FormOk.jsx
import { useNavigate } from "react-router-dom";

function FormOk() {
    const navigate = useNavigate();

    function enviar(e) {
        // Evita o refresh do form
        e.preventDefault();
        // Depois de enviar, vai para a página de sucesso
        navigate("/sucesso");
    }

    return (
        <form onSubmit={enviar}>
            <button type="submit">Enviar</button>
        </form>
    );
}

export default FormOk;
```

```jsx
// Exemplo: navegar para detalhe depois de escolher um id
function IrParaDetalhe({ id }) {
    // useNavigate permite navegar por código
    const navigate = useNavigate();

    function abrir() {
        // Vai para a página de detalhe desse id
        navigate(`/alunos/${id}`);
    }

    return <button onClick={abrir}>Ver detalhe</button>;
}
```

### Erros comuns

-   Chamar `navigate` no render e navegar logo.
-   Esquecer `preventDefault` e perder estado.
-   Usar `navigate` sem ter rotas configuradas.
-   Usar `useNavigate` fora do Router (vai dar erro).

### Boas práticas

-   Usa navegação programática só quando necessário.
-   Mantém o `navigate` dentro de handlers de eventos.

### Checkpoint

-   Em que situações faz sentido usar `useNavigate`?
-   O que acontece se chamares `navigate` durante o render?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Layouts e rotas aninhadas

### Modelo mental

Um layout é uma página base com cabeçalho e menu. As rotas filhas aparecem dentro do layout usando `Outlet`.

Pensa no layout como a moldura:

-   Cabeçalho e menu ficam fixos.
-   O conteúdo muda lá dentro.

### Sintaxe base (passo a passo)

-   **Cria um componente `Layout`:** nele fica o menu.
-   **Coloca `Outlet` no layout:** é o "buraco" onde a página aparece.
-   **Cria rotas filhas:** dentro da rota pai.
-   **Usa `index` para a página inicial da rota pai.**
-   **Caminhos das filhas são relativos:** `path="sobre"` (sem `/`).

### Exemplo

```jsx
// src/pages/Layout.jsx
import { Outlet, NavLink } from "react-router-dom";

function Layout() {
    return (
        <div>
            <nav>
                {/* Menu comum a todas as páginas */}
                <NavLink to="/">Home</NavLink>
                <NavLink to="/sobre">Sobre</NavLink>
            </nav>
            {/* Aqui aparece a página filha */}
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
            {/* Layout é a rota pai */}
            <Route path="/" element={<Layout />}>
                {/* Páginas filhas */}
                <Route index element={<Home />} />
                <Route path="sobre" element={<Sobre />} />
            </Route>
        </Routes>
    );
}

export default App;
```

### Erros comuns

-   Esquecer `Outlet` e não ver as páginas filhas.
-   Misturar rotas aninhadas com caminhos completos errados.
-   Criar um layout sem menu e não ver diferença na prática.
-   Escrever `path="/sobre"` dentro da rota filha e quebrar o layout.

### Boas práticas

-   Usa layouts para menus e rodapés fixos.
-   Se tiveres vários layouts, separa por área (ex.: `PublicLayout`, `AdminLayout`).

### Checkpoint

-   Para que serve o `Outlet` num layout?
-   O que acontece se escreveres `path="/sobre"` numa rota filha?

<a id="sec-4"></a>

## 4. [EXTRA] Página 404 e query string

### Modelo mental

Uma página 404 aparece quando não existe rota. A query string (ex.: `?q=abc`) serve para filtros e pesquisa.

Isto permite manter o estado de pesquisa na URL, para que o utilizador possa partilhar o link.

Diferença simples:

-   **Parâmetro de rota:** faz parte do caminho (`/alunos/3`).
-   **Query string:** vem depois do `?` e é opcional (`/alunos?q=abc`).

### Sintaxe base (passo a passo)

-   **Rota 404:** `path="*"`.
-   **Componente 404 simples:** um `<h1>` e um link para voltar.
-   **Query string:** usa `useSearchParams` para ler `?q=...`.
-   **O valor vem como texto:** usa `Number()` se precisares.

### Exemplo

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

```jsx
// src/pages/Pesquisa.jsx
import { useSearchParams } from "react-router-dom";

function Pesquisa() {
    const [params, setParams] = useSearchParams();
    // Lemos o valor da query string
    const termo = params.get("q") || "";

    return (
        <div>
            <input
                value={termo}
                onChange={(e) => setParams({ q: e.target.value })}
            />
            <p>Pesquisa: {termo}</p>
        </div>
    );
}

export default Pesquisa;
```

### Erros comuns

-   Colocar a rota 404 no meio e apanhar tudo.
-   Esquecer que `useSearchParams` devolve texto (não número).

### Boas práticas

-   Deixa a rota `*` como última.
-   Mostra uma mensagem simples e um link de retorno na 404.

### Checkpoint

-   Qual é a diferença entre parâmetro de rota e query string?
-   Porque é que a rota `*` deve ficar no fim?

<a id="exercicios"></a>

## Exercícios - Navegação e rotas dinâmicas

1. Em `src/pages`, cria `ListaAlunos.jsx`. Dentro, cria um array com 3 objetos `{ id, nome }`. Depois, usa `map` para renderizar um `<ul>` com `<li>` e confirma que aparece na página.
2. No `ListaAlunos`, importa `Link` de `"react-router-dom"`. Envolve o nome do aluno num `<Link>` com `to={`/alunos/${aluno.id}`}`. Clica e confirma que a URL muda.
3. No `App`, importa `ListaAlunos` e `DetalheAluno`. Cria `<Routes>` com `/alunos` e `/alunos/:id`. Abre `/alunos` no browser e confirma que a lista aparece.
4. No `DetalheAluno`, importa `useParams`, lê `id` e mostra num `<h1>`. Escreve `/alunos/1` e `/alunos/2` na barra e confirma a diferença.
5. Cria um formulário simples com `<form>` e um botão "Guardar". No `onSubmit`, faz `preventDefault()` e usa `useNavigate` para ir para `/alunos`.
6. Cria `Layout.jsx` com `<nav>` e `<Outlet>`. No `App`, coloca o `Layout` como rota pai, move as rotas para dentro e confirma que o menu fica visível em todas as páginas.
7. Cria uma página 404 com `path="*"`.
8. Testa um caminho inexistente e confirma a 404.
9. Cria uma página de pesquisa que lê `?q=...`.
10. Usa `NavLink` para destacar a página ativa.
11. Explica a diferença entre `useParams` e `useSearchParams`.

<a id="changelog"></a>

## Changelog

-   2026-01-11: criação do ficheiro.
-   2026-01-12: explicações detalhadas e exercícios iniciais em formato guia.
-   2026-01-12: detalhes extra sobre parâmetros, layouts e exercícios 1-6 mais guiados.
-   2026-01-12: checkpoints por secção e exercícios iniciais mais passo a passo.
-   2026-01-12: exemplos alinhados com alunos e query string com atualização.
