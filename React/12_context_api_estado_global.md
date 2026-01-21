# React.js (11.º Ano) - 12 · Context API e estado global

> **Objetivo deste ficheiro**
> Perceber o problema do prop drilling e como o Context ajuda.
> Criar um contexto com `createContext` e consumir com `useContext`.
> Partilhar estado global simples entre componentes.
> Preparar um gancho base para autenticação.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] O problema do prop drilling](#sec-1)
-   [2. [ESSENCIAL] Criar Context e Provider](#sec-2)
-   [3. [ESSENCIAL] Consumir contexto com useContext](#sec-3)
-   [4. [ESSENCIAL] Gancho para autenticação (AuthContext)](#sec-4)
-   [5. [ESSENCIAL] Quando NÃO usar Context](#sec-5)
-   [6. [EXTRA] Separar contexto e hook personalizado](#sec-6)
-   [Exercícios - Context API e estado global](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** cria o contexto e consome-o antes de refatorar.
-   **Como estudar:** escolhe um exemplo simples, como tema claro/escuro.
-   **Ligações:** revê props em `03_props_e_composicao.md`. Para autenticação completa, vê `16_autenticacao_em_spa_jwt_sessions_cookies.md`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] O problema do prop drilling

### Modelo mental

Prop drilling acontece quando tens de passar props por muitos componentes até chegar ao destino. Imagina uma árvore de componentes:

-   O dado nasce no topo (ex.: `App`).
-   Passa por componentes intermédios que **não o usam**.
-   Só no fim chega ao componente que precisa.

Isto torna o código mais difícil de ler e manter, porque cada componente intermédio tem de receber e reenviar props sem necessidade.

O Context permite partilhar dados sem passar por todos os níveis, criando um "canal global" dentro da árvore de componentes.

### Quando o Context é overkill

Usar Context nem sempre é boa ideia. Exemplos em que **não** vale a pena:

-   O dado só é usado por 1 ou 2 componentes próximos.
-   O estado muda a toda a hora (ex.: posição do rato), criando muitos re-renders.
-   O problema resolve-se com props simples.

Exemplos em que **faz sentido**:

-   Tema claro/escuro.
-   Utilizador autenticado.
-   Idioma da aplicação.

### Sintaxe base (passo a passo)

-   **O estado vive num ponto comum:** normalmente no topo da árvore.
-   **Passas props em cadeia:** `App -> Layout -> Header -> Botao`.
-   **O problema aparece quando a cadeia é longa.**
-   **O Context evita a cadeia:** o componente final lê diretamente.
-   **Não é para tudo:** só quando muitos componentes precisam do mesmo dado.

### Exemplo

```jsx
// Exemplo de problema: dados passam por vários componentes
function App() {
    const tema = "claro";
    // App passa tema para Layout, que passa para Header...
    return <Layout tema={tema} />;
}
```

### Erros comuns

-   Usar Context para tudo, sem necessidade.
-   Criar contextos para dados que só um componente usa.

### Boas práticas

-   Usa Context apenas quando muitos componentes precisam do mesmo dado.
-   Se o dado for local, usa props ou estado local.

### Checkpoint

-   O que é prop drilling numa frase simples?
-   Dá um exemplo em que o Context seria exagero.

<a id="sec-2"></a>

## 2. [ESSENCIAL] Criar Context e Provider

### Modelo mental

Criamos um contexto com `createContext` e depois usamos um Provider para "oferecer" os dados.

Pensa no Provider como uma "caixa" que envolve a app. Tudo o que estiver dentro dessa caixa pode ler os dados.

### Sintaxe base (passo a passo)

-   **Cria o contexto:** `createContext()` (pode ter valor inicial).
-   **Cria um Provider:** componente que guarda o estado.
-   **Passa um `value`:** normalmente um objeto com dados e funções.
-   **Envolve o `App`:** no `main.jsx` ou no topo da árvore.
-   **Sem Provider, o contexto não existe:** dá erro ou valor vazio.

### Exemplo

```jsx
// src/context/ThemeContext.jsx
import { createContext, useState } from "react";

// Contexto para partilhar o tema
export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [tema, setTema] = useState("claro");

    function alternarTema() {
        // Alterna entre claro e escuro
        setTema((prev) => (prev === "claro" ? "escuro" : "claro"));
    }

    return (
        // O Provider torna o tema acessível na árvore
        <ThemeContext.Provider value={{ tema, alternarTema }}>
            {children}
        </ThemeContext.Provider>
    );
}
```

```jsx
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* Provider no topo para todos os componentes */}
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
```

### Erros comuns

-   Esquecer de envolver o `App` com o Provider.
-   Criar vários Providers sem necessidade.
-   Passar um `value` que muda sempre (ex.: objeto criado fora de estado).

### Boas práticas

-   Coloca o Provider no topo da app.
-   Mantém o contexto simples e direto.
-   Se o `value` for grande, separa em contextos diferentes.

### Checkpoint

-   O que acontece se esqueceres o Provider?
-   Porque é que o `value` costuma ser um objeto com dados e funções?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Consumir contexto com useContext

### Modelo mental

Com `useContext`, qualquer componente pode ler os dados do contexto sem receber props.

Quando o valor do contexto muda, os componentes que o usam também voltam a renderizar. Por isso, não convém colocar dados que mudam a toda a hora sem necessidade.

Se o contexto mudar frequentemente, muitos componentes vão renderizar ao mesmo tempo. Isso não é um erro, mas pode tornar a app lenta se for exagerado. Nestes casos, considera:

-   Manter o estado mais local.
-   Separar em contextos diferentes (um para cada tipo de dado).

### Sintaxe base (passo a passo)

-   **Importa `useContext` e o contexto.**
-   **Chama `useContext` dentro do componente.**
-   **Desestrutura os dados necessários.**
-   **Usa no JSX.**

### Exemplo

```jsx
// src/components/SwitchTema.jsx
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";

function SwitchTema() {
    // Lemos tema e função do contexto
    const { tema, alternarTema } = useContext(ThemeContext);

    return (
        <button onClick={alternarTema}>
            {/* O texto muda conforme o tema atual */}
            Tema atual: {tema}
        </button>
    );
}

export default SwitchTema;
```

### Erros comuns

-   Usar `useContext` fora do Provider.
-   Desestruturar uma propriedade que não existe no `value`.

### Boas práticas

-   Exporta o contexto de um ficheiro único.
-   Mantém o `value` estável para evitar renders desnecessários.

### Checkpoint

-   O que acontece aos componentes quando o valor do contexto muda?
-   Porque é que dados muito "agitados" não são bons para Context?

<a id="sec-4"></a>

## 4. [ESSENCIAL] Gancho para autenticação (AuthContext)

### Modelo mental

Autenticação é um caso típico de Context: muitos componentes precisam de saber se o utilizador está autenticado. Aqui fica um **gancho simples** (sem JWT) para preparares o ficheiro 16.

### Exemplo (AuthContext + ProtectedRoute)

```jsx
// src/context/AuthContext.jsx
import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const isAuthenticated = Boolean(user);

    async function login(email, password) {
        // Aqui vais ligar ao backend mais tarde
        setUser({ nome: "Ana", email });
    }

    function logout() {
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
```

```jsx
// src/routes/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

function ProtectedRoute() {
    const { isAuthenticated } = useContext(AuthContext);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Outlet />;
}

export default ProtectedRoute;
```

```jsx
// src/App.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Perfil from "./pages/Perfil.jsx";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/perfil" element={<Perfil />} />
            </Route>
        </Routes>
    );
}

export default App;
```

> **Nota:** o fluxo completo de login/logout está em `16_autenticacao_em_spa_jwt_sessions_cookies.md`.

### Checkpoint

-   Que estado guardas no `AuthContext`?
-   Para que serve o `ProtectedRoute`?

<a id="sec-5"></a>

## 5. [ESSENCIAL] Quando NÃO usar Context

### Modelo mental

Context é útil, mas também pode criar re-renders em massa. Evita quando o estado é local ou muda a toda a hora.

### Anti-patterns comuns

-   Estado que só 1 ou 2 componentes usam.
-   Valores que mudam muitas vezes (ex.: posição do rato, timers rápidos).
-   Dados que podiam ser passados por props simples.

### Boas práticas

-   Mantém o estado local quando possível.
-   Se precisares de partilhar, começa por props e só depois Context.

### Checkpoint

-   Dá um exemplo de estado que não deve ir para Context.

<a id="sec-6"></a>

## 6. [EXTRA] Separar contexto e hook personalizado

### Modelo mental

Um hook personalizado deixa o acesso ao contexto mais simples e claro. Também é um bom sítio para lançar um erro útil se alguém usar o hook fora do Provider.

### Sintaxe base (passo a passo)

-   **Cria um hook:** `useTheme()`.
-   **Usa `useContext` dentro do hook.**
-   **Devolve o valor do contexto.**
-   **Opcional:** valida se o contexto existe.

### Exemplo

```jsx
// src/context/useTheme.js
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext.jsx";

export function useTheme() {
    const contexto = useContext(ThemeContext);
    if (!contexto) {
        // Ajuda a encontrar erros de Provider em falta
        throw new Error("useTheme deve ser usado dentro de ThemeProvider");
    }
    // Centraliza o acesso ao contexto
    return contexto;
}
```

```jsx
// src/components/SwitchTema.jsx
import { useTheme } from "../context/useTheme.js";

function SwitchTema() {
    // Hook personalizado torna o código mais limpo
    const { tema, alternarTema } = useTheme();

    return <button onClick={alternarTema}>Tema atual: {tema}</button>;
}

export default SwitchTema;
```

### Erros comuns

-   Misturar lógica do contexto em vários sítios.
-   Criar hooks personalizados sem necessidade.

### Boas práticas

-   Usa hooks personalizados para esconder detalhes.
-   Mantém o hook simples e com um único objetivo.

### EXTRA rápido: useReducer + Context (mini-exemplo)

Quando o estado começa a crescer, `useReducer` ajuda a organizar ações.

```jsx
// src/context/ContadorContext.jsx
import { createContext, useReducer } from "react";

export const ContadorContext = createContext();

const estadoInicial = { total: 0 };

function reducer(state, action) {
    switch (action.type) {
        case "incrementar":
            return { total: state.total + 1 };
        case "reset":
            return { total: 0 };
        default:
            return state;
    }
}

export function ContadorProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, estadoInicial);

    return (
        <ContadorContext.Provider value={{ state, dispatch }}>
            {children}
        </ContadorContext.Provider>
    );
}
```

### Checkpoint

-   Qual é a vantagem de ter um hook personalizado para Context?
-   O que acontece se alguém usar o hook fora do Provider?

<a id="exercicios"></a>

## Exercícios - Context API e estado global

1. Em `src/context`, cria `ThemeContext.jsx`. Importa `createContext` e `useState`, cria o contexto e um `ThemeProvider` com estado `tema`.
2. No `main.jsx`, importa `ThemeProvider` e envolve o `<App />`. Guarda e confirma que a app continua a aparecer sem erros.
3. Cria `MostrarTema.jsx`. Importa `useContext` e `ThemeContext`, lê `tema` e mostra "Tema atual: ...".
4. No mesmo componente (ou noutro), adiciona um botão "Alternar" que chama `alternarTema` do contexto. Clica e confirma a mudança.
5. No `App`, aplica `className={tema}` no elemento principal. Cria CSS simples para `.claro` e `.escuro` e confirma a diferença visual.
6. Cria `UserContext.jsx` com `nome` e `curso`. Envolve o `App` e mostra esses dados num componente `Perfil`.
7. Mostra o nome do utilizador em dois componentes diferentes.
8. Adiciona uma função para atualizar o nome.
9. Garante que o Provider está no topo.
10. Cria um hook personalizado para o contexto.
11. Explica quando faz sentido usar Context.
12. Cria um `AuthContext` com `user` e `isAuthenticated`.
13. Cria um `ProtectedRoute` que bloqueia uma página quando não estás autenticado.

<a id="changelog"></a>

## Changelog

-   2026-01-11: criação do ficheiro.
-   2026-01-12: explicações detalhadas e exercícios iniciais em formato guia.
-   2026-01-12: quando usar Context, impacto em re-renders e checkpoints por secção.
-   2026-01-12: mini-exemplo de `useReducer` com Context.
-   2026-01-12: gancho de autenticação, ProtectedRoute e anti-patterns.
