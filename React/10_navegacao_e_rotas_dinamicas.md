# React.js (12.º Ano) - 10 · Navegação e rotas dinâmicas

> **Objetivo deste ficheiro**
>
> - Construir navegação “de app” (SPA) com **React Router**.
> - Criar **rotas dinâmicas** (ex.: `/alunos/:id`) e ler parâmetros com `useParams`.
> - Usar navegação **declarativa** (`Link` / `NavLink`) e **programática** (`useNavigate`).
> - Montar **layouts com rotas aninhadas** usando `Outlet` (menu fixo + páginas a trocar).
> - Lidar com **404** e com **query string** (`useSearchParams`) para pesquisa/filtros.
>
> Este ficheiro assume que já tens o básico do React Router do ficheiro `09_react_router_fundamentos.md`.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] Rotas dinâmicas com `:params`](#sec-1)
- [2. [ESSENCIAL] Navegação declarativa: `Link` e `NavLink`](#sec-2)
- [3. [ESSENCIAL] Navegação programática: `useNavigate`](#sec-3)
- [4. [ESSENCIAL] Layouts e rotas aninhadas: `Outlet` e `index`](#sec-4)
- [5. [EXTRA] 404 e query string: `*` e `useSearchParams`](#sec-5)
- [6. [EXTRA] Rotas dinâmicas + dados (ligação ao `useEffect`)](#sec-6)
- [7. [EXTRA] Armadilhas comuns e diagnóstico rápido](#sec-7)
- [Exercícios - Navegação e rotas dinâmicas](#exercicios)
- [Changelog](#changelog)

---

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **Como estudar:** cria mini-projetos e testa no browser a **URL** (barra de endereços). Em React Router, a URL não é “decoração”: é uma parte do estado da aplicação.
- **Regra de ouro:** não uses `<a href="...">` dentro da app para mudar de página. Usa `Link`/`NavLink`.
- **Ligações úteis:**
    - `09_react_router_fundamentos.md` (setup e rotas base)
    - `08_useEffect_e_dados.md` (buscar dados e lidar com estados de ecrã)

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] Rotas dinâmicas com `:params`

### 1.1 Modelo mental: uma rota é um “molde” de URL

Pensa numa rota como um **padrão** (um molde) que o React Router usa para decidir que componente mostrar.

- Rota estática: `/alunos` (sempre igual)
- Rota dinâmica: `/alunos/:id` (tem uma parte variável)

Aqui, `:id` significa:

- “Nesta posição da URL, vai existir um valor que eu quero capturar.”
- Esse valor vai aparecer no teu componente através do hook `useParams()`.

Mini-exemplo de correspondência:

- URL: `/alunos/7`
- Rota: `/alunos/:id`
- Params: `{ id: "7" }` (repara: **texto**, não número)

> **Ponto importante:** `useParams()` devolve sempre strings. Se precisares de um número, converte com `Number(...)` e valida.

---

### 1.2 Onde isto é útil (porquê usar `:id`?)

Rotas dinâmicas resolvem um problema muito comum: **uma lista → um detalhe**.

Exemplo:

- Tens uma lista de alunos em `/alunos`
- Ao clicar num aluno, queres abrir `/alunos/3` (detalhe do aluno com id 3)

Isto é profissional porque:

- A URL fica partilhável (podes copiar e mandar a alguém).
- O browser “percebe” onde estás (back/forward funcionam).
- A app fica organizada por páginas reais.

---

### 1.3 Passo a passo: lista → detalhe (com dados locais)

Vamos construir isto com dados locais (sem backend), só para perceber rotas e params.

#### 1) Cria a lista (`src/pages/ListaAlunos.jsx`)

```jsx
import { Link } from "react-router-dom";

/**
 * Lista simples com links para detalhes.
 * Repara no `to={`/alunos/${aluno.id}`}`.
 */
function ListaAlunos() {
    const alunos = [
        { id: 1, nome: "Ana" },
        { id: 2, nome: "Bruno" },
        { id: 3, nome: "Carla" },
    ];

    return (
        <div>
            <h1>Alunos</h1>

            <ul>
                {alunos.map((aluno) => (
                    <li key={aluno.id}>
                        <Link to={`/alunos/${aluno.id}`}>{aluno.nome}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListaAlunos;
```

#### 2) Cria o detalhe (`src/pages/DetalheAluno.jsx`)

```jsx
import { useParams, Link } from "react-router-dom";

/**
 * Página de detalhe:
 * - lê `id` da rota: /alunos/:id
 * - valida e mostra feedback simples
 */
function DetalheAluno() {
    const { id } = useParams(); // { id: "2" } por exemplo

    // Converte e valida (porque useParams devolve string)
    const idNum = Number(id);
    const idValido = Number.isInteger(idNum) && idNum > 0;

    return (
        <div>
            <h1>Detalhe do aluno</h1>

            {!idValido ? (
                <p>ID inválido: {id}</p>
            ) : (
                <p>Aluno com id: {idNum}</p>
            )}

            <p>
                <Link to="/alunos">Voltar à lista</Link>
            </p>
        </div>
    );
}

export default DetalheAluno;
```

#### 3) Liga as rotas no `App.jsx`

```jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ListaAlunos from "./pages/ListaAlunos";
import DetalheAluno from "./pages/DetalheAluno";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/alunos" replace />} />
            <Route path="/alunos" element={<ListaAlunos />} />
            <Route path="/alunos/:id" element={<DetalheAluno />} />
        </Routes>
    );
}

export default App;
```

> **Nota:** `Navigate` é útil para redirecionar (ex.: página inicial → lista).

---

### 1.4 Melhorar o detalhe: procurar o aluno (em vez de só mostrar o id)

Agora, em vez de mostrar “id=3”, vamos procurar o aluno.

```jsx
import { useParams, Link } from "react-router-dom";

function DetalheAluno() {
    const { id } = useParams();
    const idNum = Number(id);

    const alunos = [
        { id: 1, nome: "Ana" },
        { id: 2, nome: "Bruno" },
        { id: 3, nome: "Carla" },
    ];

    const aluno = alunos.find((a) => a.id === idNum);

    if (!Number.isInteger(idNum)) {
        return (
            <div>
                <h1>Detalhe do aluno</h1>
                <p>ID inválido: {id}</p>
                <Link to="/alunos">Voltar</Link>
            </div>
        );
    }

    if (!aluno) {
        return (
            <div>
                <h1>Detalhe do aluno</h1>
                <p>Aluno não encontrado (id: {idNum})</p>
                <Link to="/alunos">Voltar</Link>
            </div>
        );
    }

    return (
        <div>
            <h1>{aluno.nome}</h1>
            <p>ID: {aluno.id}</p>
            <Link to="/alunos">Voltar</Link>
        </div>
    );
}

export default DetalheAluno;
```

---

### 1.5 Erros comuns (rotas dinâmicas)

- Esquecer `:id` na rota e depois `useParams()` vem vazio.
- Assumir que `id` é número (é **string**).
- Fazer `Number(id)` sem validar e depois usar `NaN` sem querer.
- Criar links errados (ex.: `/alunos:id` em vez de `/alunos/${id}`).

---

### 1.6 Checkpoint

- O que significa o `:` numa rota, como `"/alunos/:id"`?
- Porque é que `useParams()` devolve strings?
- O que deve acontecer se o id for inválido ou não existir?

---

<a id="sec-2"></a>

## 2. [ESSENCIAL] Navegação declarativa: `Link` e `NavLink`

### 2.1 Modelo mental: SPA e “não recarregar a página”

Num site normal, mudar de página com `<a href="...">` faz o browser:

- pedir um HTML novo ao servidor
- recarregar tudo
- perder estado da aplicação

Numa SPA (React), queremos outra coisa:

- mudar a URL
- trocar o componente
- **sem recarregar a página**

É aqui que entram:

- `Link` → navegação simples
- `NavLink` → navegação com “estado ativo” (menu)

---

### 2.2 `Link` (o mais comum)

Regra prática:

- Se queres um “link para outra página”, usa `Link`.

```jsx
import { Link } from "react-router-dom";

function MenuSimples() {
    return (
        <nav>
            <Link to="/alunos">Alunos</Link>{" "}
            <Link to="/pesquisa">Pesquisa</Link>
        </nav>
    );
}

export default MenuSimples;
```

---

### 2.3 `NavLink` (menu com página ativa)

`NavLink` sabe se está “ativo” (se a URL atual corresponde ao `to`).
Isto serve para destacar a página no menu.

```jsx
import { NavLink } from "react-router-dom";

/**
 * Menu com destaque da página ativa.
 * `className` pode ser uma função que recebe { isActive }.
 */
function Menu() {
    return (
        <nav style={{ display: "flex", gap: 12 }}>
            <NavLink
                to="/alunos"
                className={({ isActive }) => (isActive ? "ativo" : "")}
            >
                Alunos
            </NavLink>

            <NavLink
                to="/pesquisa"
                className={({ isActive }) => (isActive ? "ativo" : "")}
            >
                Pesquisa
            </NavLink>
        </nav>
    );
}

export default Menu;
```

> Para veres o efeito, cria uma classe CSS `.ativo` (ex.: texto sublinhado).  
> Se estiveres a usar Tailwind, podes pôr classes diferentes quando `isActive` for true.

---

### 2.4 Links relativos (quando usares rotas aninhadas)

Quando tens rotas aninhadas (secção 4), podes usar `to="perfil"` em vez de `to="/dashboard/perfil"`.

- `to="perfil"` é **relativo** à rota atual
- `to="/dashboard/perfil"` é **absoluto** (começa na raiz)

Para já, guarda a ideia:

- Links relativos são muito úteis dentro de layouts com `Outlet`.

---

### 2.5 Erros comuns (Link/NavLink)

- Usar `<a href="...">` e a app recarrega.
- Esquecer o `to`.
- Fazer `to="alunos"` achando que é absoluto (não é). Se queres absoluto, começa com `/`.

---

### 2.6 Checkpoint

- Porque é que, numa SPA, evitamos `<a href="...">`?
- Quando usas `NavLink` em vez de `Link`?
- Qual é a diferença entre `to="perfil"` e `to="/perfil"`?

---

<a id="sec-3"></a>

## 3. [ESSENCIAL] Navegação programática: `useNavigate`

### 3.1 Modelo mental: nem sempre navegas com um link

Às vezes a navegação acontece depois de uma ação:

- submeter um formulário
- guardar dados
- fazer login
- cancelar uma operação

Nestes casos, não faz sentido ter um `Link`.
Queres “mandar” o utilizador para outra página quando algo acontece.

Para isso existe o `useNavigate()`.

---

### 3.2 Exemplo: após submit, ir para a lista

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Exemplo:
 * - submit -> valida -> navega para /alunos
 */
function CriarAluno() {
    const [nome, setNome] = useState("");
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    function submit(e) {
        e.preventDefault();

        if (nome.trim() === "") {
            setErro("Nome obrigatório.");
            return;
        }

        setErro("");

        // Aqui, num projeto real, guardavas no backend.
        // Neste exemplo, só navegamos para a lista.
        navigate("/alunos");
    }

    return (
        <div>
            <h1>Criar aluno</h1>

            <form onSubmit={submit}>
                <label htmlFor="nome">Nome</label>
                <input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <button type="submit">Guardar</button>
            </form>

            {erro && <p>{erro}</p>}
        </div>
    );
}

export default CriarAluno;
```

---

### 3.3 Voltar atrás (histórico do browser)

O `navigate` também aceita números:

- `navigate(-1)` → voltar à página anterior
- `navigate(1)` → avançar (se existir)

```jsx
import { useNavigate } from "react-router-dom";

function Voltar() {
    const navigate = useNavigate();

    return <button onClick={() => navigate(-1)}>Voltar</button>;
}
```

---

### 3.4 `replace` (não guardar no histórico)

Às vezes não queres que o utilizador volte para trás (ex.: depois de login).
Para isso, podes usar `replace: true`:

```js
navigate("/dashboard", { replace: true });
```

---

### 3.5 Erros comuns (useNavigate)

- Chamar `navigate(...)` no render (isso causa loops). Deve ser em handlers ou effects.
- Usar `useNavigate` fora de `BrowserRouter` (vai dar erro).
- Navegar para um caminho que não existe (vai parar à 404, se tiveres).

---

### 3.6 Checkpoint

- Em que situações o `useNavigate` faz mais sentido do que um `Link`?
- Qual é a diferença entre `navigate("/x")` e `navigate("/x", { replace: true })`?

---

<a id="sec-4"></a>

## 4. [ESSENCIAL] Layouts e rotas aninhadas: `Outlet` e `index`

### 4.1 Modelo mental: uma árvore de rotas

Quando a aplicação cresce, vais querer:

- um menu fixo (sempre presente)
- e uma zona onde as páginas mudam

Isto é exatamente o que um **layout** faz.

Um layout é um componente que:

- mostra UI comum (ex.: menu)
- e reserva um espaço para a “página atual”

Esse espaço chama-se `Outlet`.

Mini-diagrama:

```
Layout (menu fixo)
   ↓
Outlet (a página muda aqui)
```

---

### 4.2 Exemplo: criar um `Layout.jsx`

`src/layouts/Layout.jsx`:

```jsx
import { NavLink, Outlet } from "react-router-dom";

/**
 * Layout base:
 * - menu sempre visível
 * - <Outlet /> é onde entra a página atual
 */
function Layout() {
    return (
        <div>
            <header>
                <h1>Minha App</h1>

                <nav style={{ display: "flex", gap: 12 }}>
                    <NavLink
                        to="/alunos"
                        className={({ isActive }) => (isActive ? "ativo" : "")}
                    >
                        Alunos
                    </NavLink>

                    <NavLink
                        to="/criar"
                        className={({ isActive }) => (isActive ? "ativo" : "")}
                    >
                        Criar
                    </NavLink>
                </nav>
            </header>

            <main style={{ marginTop: 16 }}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
```

---

### 4.3 Rotas aninhadas no `App.jsx`

Agora o `Layout` é a rota “pai” e as páginas ficam como “filhas”.

```jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import ListaAlunos from "./pages/ListaAlunos";
import DetalheAluno from "./pages/DetalheAluno";
import CriarAluno from "./pages/CriarAluno";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* "index" é a página padrão dentro do layout */}
                <Route index element={<Navigate to="/alunos" replace />} />

                <Route path="alunos" element={<ListaAlunos />} />
                <Route path="alunos/:id" element={<DetalheAluno />} />
                <Route path="criar" element={<CriarAluno />} />
            </Route>
        </Routes>
    );
}

export default App;
```

Repara em 2 coisas importantes:

1. Nas rotas filhas, o `path` **não começa com** `/`:

- `path="alunos"` em vez de `path="/alunos"`

2. A rota `index` é a “página por defeito” dentro do layout:

- quando estás em `/`, entra no layout e mostra o `index`.

> **Regra prática:**  
> Dentro de um `<Route path="/" element={<Layout/>}>`, usa paths **relativos** (sem `/`) para manter a árvore coerente.

---

### 4.4 Porque isto é importante numa app real?

Porque assim consegues ter:

- um layout para zona pública (ex.: Home, Sobre)
- um layout para zona privada (ex.: Dashboard)
- menus diferentes por área
- UI partilhada sem repetir em todas as páginas

Mais tarde, quando entrares em autenticação, vais usar layouts + rotas protegidas para controlar acesso.

---

### 4.5 Checkpoint

- Para que serve o `Outlet`?
- Qual é a vantagem de ter um `Layout` como rota pai?
- O que é uma rota `index`?

---

<a id="sec-5"></a>

## 5. [EXTRA] 404 e query string: `*` e `useSearchParams`

### 5.1 Página 404 (rota `*`)

Uma rota com `path="*"` apanha qualquer caminho que não exista.

Regra prática:

- A 404 deve ficar **no fim** (ou, no caso de rotas aninhadas, como “última filha”).

Exemplo:

```jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* ...outras rotas... */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
```

`src/pages/NotFound.jsx`:

```jsx
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div>
            <h1>404</h1>
            <p>Esta página não existe.</p>
            <Link to="/alunos">Ir para Alunos</Link>
        </div>
    );
}

export default NotFound;
```

---

### 5.2 Query string (o que é e para que serve)

A query string é a parte da URL depois do `?`.

Exemplos:

- `/pesquisa?q=ana`
- `/alunos?pagina=2&ordenar=nome`

A ideia:

- **parâmetros de rota** (`/alunos/:id`) identificam “qual é o recurso”
- **query string** (`?q=...`) descreve “como quero ver / filtrar / procurar”

---

### 5.3 `useSearchParams`: ler e escrever query string

`useSearchParams()` dá-te:

- `searchParams` → para ler (como `get("q")`)
- `setSearchParams` → para escrever (atualiza a URL)

Exemplo: `src/pages/Pesquisa.jsx`

```jsx
import { useSearchParams } from "react-router-dom";

/**
 * Pesquisa com query string:
 * - a URL fica sincronizada com o texto
 * - podes partilhar o link (com o q)
 */
function Pesquisa() {
    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get("q") || "";

    function onChange(e) {
        const novo = e.target.value;

        // Regra útil: se estiver vazio, remove o parâmetro da URL
        if (novo.trim() === "") {
            setSearchParams({});
            return;
        }

        setSearchParams({ q: novo });
    }

    return (
        <div>
            <h1>Pesquisa</h1>

            <label htmlFor="q">Procurar</label>
            <input id="q" value={q} onChange={onChange} />

            <p>Query atual: {q}</p>
        </div>
    );
}

export default Pesquisa;
```

> **Nota:** query string é sempre texto. Se tiveres `pagina=2`, tens de converter para número e validar.

---

### 5.4 Checkpoint

- Qual é a diferença entre `/alunos/3` e `/alunos?q=ana`?
- Quando é que faz sentido usar query string em vez de params?
- Porque é que a 404 deve existir numa app?

---

<a id="sec-6"></a>

## 6. [EXTRA] Rotas dinâmicas + dados (ligação ao `useEffect`)

Nesta secção vamos juntar duas ideias:

- o `id` vem da URL (`useParams`)
- e os dados vêm “de fora” (`fetch` dentro de `useEffect`)

Isto é um padrão muito comum:
**o ecrã depende da URL → logo o `useEffect` depende do param**.

### 6.1 Modelo mental

- URL muda (ex.: `/alunos/3` → `/alunos/4`)
- o componente re-renderiza
- o `useEffect` deve voltar a correr para ir buscar os dados do novo id

Logo:

- `id` deve estar nas dependências do effect

### 6.2 Exemplo com API de teste (simples e correto)

```jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

/**
 * Exemplo: detalhe com fetch baseado no id.
 * - id vem da rota
 * - effect depende de id
 * - estados de ecrã: loading / error / success
 */
function DetalheUserAPI() {
    const { id } = useParams();

    const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
    const [erro, setErro] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function carregar() {
            setStatus("loading");
            setErro("");
            setUser(null);

            try {
                const res = await fetch(
                    `https://jsonplaceholder.typicode.com/users/${id}`,
                    { signal: controller.signal },
                );

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const data = await res.json();
                setUser(data);
                setStatus("success");
            } catch (e) {
                if (e instanceof Error && e.name === "AbortError") return;

                const msg =
                    e instanceof Error ? e.message : "Falha ao carregar";
                setErro(msg);
                setStatus("error");
            }
        }

        carregar();

        // Se mudares de /users/1 para /users/2 rápido, isto cancela o pedido anterior.
        return () => controller.abort();
    }, [id]);

    return (
        <div>
            <h1>Detalhe (API)</h1>

            {status === "loading" && <p>A carregar...</p>}
            {status === "error" && <p>{erro}</p>}

            {status === "success" && user && (
                <>
                    <p>Nome: {user.name}</p>
                    <p>Email: {user.email}</p>
                </>
            )}

            <p>
                <Link to="/alunos">Voltar</Link>
            </p>
        </div>
    );
}

export default DetalheUserAPI;
```

> Se esta parte te parecer “muita coisa”, revê o ficheiro `08_useEffect_e_dados.md`.  
> Aqui estás só a aplicar o mesmo padrão, mas a URL é que manda no `id`.

---

<a id="sec-7"></a>

## 7. [EXTRA] Armadilhas comuns e diagnóstico rápido

Quando “não aparece a página” ou “não muda”, faz este checklist.

### 7.1 Checklist rápido

1. **Tens `BrowserRouter` no `main.jsx`?**  
   Sem isto, `Link`, `Routes`, `useParams`, `useNavigate` não funcionam.

2. **O `path` está certo?**

- `/alunos/:id` é diferente de `/aluno/:id`
- letras importam

3. **O `Link to` aponta para um caminho que existe?**

- vê a URL no browser
- se cair na 404, o caminho não está a bater na rota

4. **Estás a usar `<a href>`?**

- se sim, a página recarrega e podes perder estado

5. **Params e query string são texto**

- valida e converte quando precisas de números

6. **Layouts: tens `<Outlet />` no layout?**

- se não tiveres, as rotas filhas nunca aparecem

---

### 7.2 “Não apanha a rota dinâmica”

Sintoma:

- vais a `/alunos/2` e aparece 404 ou página errada.

Causas típicas:

- a rota está como `/alunos/id` (sem `:`)
- o `path` tem outro nome (ex.: `:alunoId`) mas no componente lês `id`

Se o path for:

```jsx
<Route path="/alunos/:alunoId" element={<DetalheAluno />} />
```

Então tens de ler:

```js
const { alunoId } = useParams();
```

---

### 7.3 “O menu não aparece em todas as páginas”

Causa típica:

- fizeste o layout, mas não o puseste como rota pai
- ou esqueceste o `Outlet`

A regra é:

- o menu vive no layout
- as páginas vivem dentro do `Outlet`

---

### 7.4 Checkpoint

- Que 3 verificações fazes primeiro quando uma rota não aparece?
- Porque é que esquecer o `Outlet` “mata” as rotas filhas?
- O que é que costuma significar cair sempre na 404?

---

<a id="exercicios"></a>

## Exercícios - Navegação e rotas dinâmicas

> Objetivo: construir uma mini-app com **lista**, **detalhe**, **layout**, **criar**, **pesquisa** e **404**.

1. Cria `src/pages/ListaAlunos.jsx` com um array de 3 alunos `{ id, nome }`. Renderiza um `<ul>` com `map`.
2. Converte o nome de cada aluno num `<Link to={`/alunos/${aluno.id}`}>...</Link>`.
3. Cria `src/pages/DetalheAluno.jsx` e usa `useParams` para ler `id`. Mostra o id num `<p>`.
4. No `App.jsx`, cria rotas para:
    - `/alunos` → `ListaAlunos`
    - `/alunos/:id` → `DetalheAluno`
5. Em `DetalheAluno`, valida o `id`:
    - se não for número inteiro positivo, mostra “ID inválido”
    - se for válido mas não existir, mostra “Aluno não encontrado”
6. Cria `src/pages/CriarAluno.jsx` com um formulário controlado (nome obrigatório). No submit, usa `useNavigate` para ir para `/alunos`.
7. Cria `src/layouts/Layout.jsx` com `NavLink` para `/alunos` e `/criar`, e um `<Outlet />`.
8. Refaz o `App.jsx` com rotas aninhadas: `Layout` como pai e as páginas como filhas.
9. Cria `src/pages/NotFound.jsx` e adiciona a rota `path="*"` (404). Testa com uma URL inexistente.
10. Cria `src/pages/Pesquisa.jsx` e usa `useSearchParams` para ler/escrever `?q=...`. Mostra o texto da query no ecrã.
11. (Integração) Faz um detalhe “com API” inspirado na secção 6: cria `DetalheUserAPI.jsx`, lê `id` e usa `fetch` dentro de `useEffect` com `AbortController`.

---

<a id="changelog"></a>

## Changelog

- 2026-01-11: criação do ficheiro.
- 2026-01-12: exemplos base de `useParams`, `useNavigate`, `Outlet`, 404 e query string.
- 2026-01-26: reescrita completa com modelo mental (rotas como molde), validação de params, diferença Link/NavLink, layouts com rotas aninhadas (`index`), query string com sincronização de UI e ligação explícita ao padrão de `useEffect` (AbortController) para detalhes por id.
