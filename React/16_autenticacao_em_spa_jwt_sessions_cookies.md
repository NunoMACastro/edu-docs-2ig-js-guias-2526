# React.js (11.º Ano) - 16 · Autenticação em SPA: JWT, sessões e cookies

> **Objetivo deste ficheiro**
> Entender sessão vs JWT de forma simples.
> Saber onde guardar o estado de autenticação no React.
> Implementar um fluxo mínimo de login/logout com Express e React.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Session vs JWT (comparação simples)](#sec-1)
-   [2. [ESSENCIAL] Estado de autenticação no React](#sec-2)
-   [3. [ESSENCIAL] Onde guardar o token: localStorage vs httpOnly cookie](#sec-3)
-   [4. [ESSENCIAL] Fluxo completo: login, me, logout e rotas protegidas](#sec-4)
-   [5. [EXTRA] Refresh token (ideia base)](#sec-5)
-   [6. [EXTRA] CSRF e SameSite (nota curta)](#sec-6)
-   [Exercícios - Autenticação](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** faz login/logout primeiro; refresh token é extra.
-   **Como estudar:** usa o backend do ficheiro 11 como base.
-   **Ligações:** contexto base em `12_context_api_estado_global.md`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Session vs JWT (comparação simples)

### Modelo mental

Duas formas comuns:

-   **Sessão (cookie):** o servidor guarda o estado; o browser guarda um cookie.
-   **JWT (token):** o cliente guarda um token e envia em cada pedido.

### Comparação rápida

| Tipo      | Onde está o estado? | Envio | Vantagem | Atenção |
| --------- | ------------------- | ----- | -------- | ------- |
| Sessão    | Servidor            | Cookie | Mais seguro no browser | Precisa de cookies e CSRF | 
| JWT       | Cliente             | Header | Simples para APIs | Token exposto se mal guardado |

### Checkpoint

-   Onde vive o estado numa sessão?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Estado de autenticação no React

### Modelo mental

O React precisa de saber se o utilizador está autenticado. O ideal é guardar isso num `AuthContext` e ter funções `login`, `logout` e `me()`.

### Exemplo (forma simples)

```jsx
// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import { authMe, authLogin, authLogout } from "../services/auth.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function me() {
        try {
            const dados = await authMe();
            setUser(dados.user);
        } catch (e) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(email, password) {
        const dados = await authLogin({ email, password });
        setUser(dados.user);
    }

    async function logout() {
        await authLogout();
        setUser(null);
    }

    useEffect(() => {
        me();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
```

### Checkpoint

-   Para que serve o `me()`?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Onde guardar o token: localStorage vs httpOnly cookie

### Modelo mental

Guardar tokens no browser tem riscos.

-   **localStorage:** fácil, mas vulnerável a XSS (um script malicioso pode roubar o token).
-   **httpOnly cookie (recomendado):** o JavaScript não consegue ler, logo é mais seguro.

### Resumo rápido

-   **localStorage:** só usar em ambiente didático ou muito controlado.
-   **httpOnly cookie:** preferido em contexto real.

### Checkpoint

-   Porque é que `localStorage` é arriscado?

<a id="sec-4"></a>

## 4. [ESSENCIAL] Fluxo completo: login, me, logout e rotas protegidas

### Modelo mental

Fluxo mínimo com cookies:

1. **POST /auth/login** → servidor valida e define cookie httpOnly.
2. **GET /auth/me** → devolve utilizador atual.
3. **POST /auth/logout** → limpa cookie.
4. **ProtectedRoute** bloqueia páginas privadas.

> **Nota:** ao usar cookies, o frontend precisa de `credentials: "include"`.

### Backend (Express, cookie httpOnly)

```js
// backend/index.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());

function sendError(res, status, code, message, details = []) {
    return res.status(status).json({ error: { code, message, details } });
}

const utilizadores = [{ id: 1, email: "ana@escola.pt", nome: "Ana" }];

app.post("/auth/login", (req, res) => {
    const { email } = req.body || {};
    const user = utilizadores.find((u) => u.email === email);

    if (!user) {
        return sendError(res, 401, "INVALID_CREDENTIALS", "Credenciais inválidas");
    }

    res.cookie("session", "token_fake", {
        httpOnly: true,
        sameSite: "lax",
    });

    res.status(200).json({ user });
});

app.get("/auth/me", (req, res) => {
    const cookie = req.headers.cookie || "";
    const temSessao = cookie.includes("session=");

    if (!temSessao) {
        return sendError(res, 401, "NOT_AUTHENTICATED", "Não autenticado");
    }

    res.status(200).json({ user: utilizadores[0] });
});

app.post("/auth/logout", (req, res) => {
    res.clearCookie("session");
    res.status(204).end();
});

app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});
```

### Frontend (serviço + ProtectedRoute)

```jsx
// src/services/auth.js
const API_BASE = "http://localhost:3000";

async function requestJson(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        credentials: "include",
        ...options,
    });
    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
        ? await res.json()
        : null;

    if (!res.ok) {
        const msg =
            body?.error?.message || `Erro ${res.status}: pedido falhou`;
        throw new Error(msg);
    }

    return body;
}

export function authLogin(data) {
    return requestJson("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

export function authMe() {
    return requestJson("/auth/me");
}

export function authLogout() {
    return requestJson("/auth/logout", { method: "POST" });
}
```

```jsx
// src/routes/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

function ProtectedRoute() {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <p>A validar sessão...</p>;
    if (!user) return <Navigate to="/login" replace />;
    return <Outlet />;
}

export default ProtectedRoute;
```

### Erros comuns

-   Esquecer `credentials: "include"` e o cookie não ir no pedido.
-   Guardar token em `localStorage` sem perceber o risco.

### Boas práticas

-   Prefere cookies httpOnly em contexto real.
-   Trata 401 no frontend com mensagens claras.

### Checkpoint

-   Porque é que `credentials: "include"` é necessário?

<a id="sec-5"></a>

## 5. [EXTRA] Refresh token (ideia base)

### Modelo mental

Um refresh token permite manter a sessão sem pedir login a toda a hora. A ideia é ter dois tokens: um curto (access) e um longo (refresh).

### Checkpoint

-   Para que serve um refresh token?

<a id="sec-6"></a>

## 6. [EXTRA] CSRF e SameSite (nota curta)

### Modelo mental

Quando usas cookies, existe risco de **CSRF**. O `SameSite=Lax` ajuda e, em sistemas reais, usa‑se um **CSRF token**.

### Checkpoint

-   O que é CSRF, numa frase?

<a id="exercicios"></a>

## Exercícios - Autenticação

1. Implementa `POST /auth/login`, `GET /auth/me` e `POST /auth/logout` com cookie httpOnly.
2. Cria `AuthContext` com `user`, `login` e `logout`.
3. Implementa um `ProtectedRoute` para bloquear `/perfil`.
4. Mostra uma mensagem útil quando o backend devolve 401.
5. Explica porque `localStorage` é arriscado.

<a id="changelog"></a>

## Changelog

-   2026-01-12: criação do ficheiro com fluxo mínimo de autenticação.
-   2026-01-12: exemplos convertidos para ESM.
