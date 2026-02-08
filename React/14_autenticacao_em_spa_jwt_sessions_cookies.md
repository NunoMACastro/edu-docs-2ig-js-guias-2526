# React.js (12.º Ano) - 16 · Autenticação em SPA: JWT, Sessions e Cookies

> **Objetivo deste ficheiro**
>
> - Perceber o que significa **autenticar** e **autorizar** numa aplicação web.
> - Entender as 3 abordagens mais comuns para “manter o login”:
>     - **Sessions** (session id guardado em cookie)
>     - **JWT em storage** (localStorage/sessionStorage) _(não recomendado)_
>     - **JWT em cookie HttpOnly** _(recomendado para este curso)_
> - Perceber (com exemplos) problemas típicos em SPAs:
>     - **CORS**
>     - **CSRF**
>     - **XSS**
>     - **expiração / refresh**
> - Implementar um fluxo “profissional mas acessível”:
>     - **Login** → cookie HttpOnly → **/me** para obter utilizador → **Rotas protegidas** → **Logout**
>     - e o mínimo de **CSRF** para cookies ficarem seguros.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] Autenticação vs autorização (mapa mental)](#sec-1)
- [2. [ESSENCIAL] Como o servidor te “reconhece” (3 abordagens)](#sec-2)
- [3. [ESSENCIAL] Cookies por dentro (HttpOnly, Secure, SameSite)](#sec-3)
- [4. [ESSENCIAL] Sessions (server-side)](#sec-4)
- [5. [ESSENCIAL] JWT (stateless) e onde guardar tokens](#sec-5)
- [6. [ESSENCIAL] Padrão recomendado: JWT em cookie HttpOnly + CSRF](#sec-6)
- [7. [ESSENCIAL] Implementação prática (React + Axios + Node/Express)](#sec-7)
- [8. [EXTRA] Refresh token (sessão longa sem “quebrar” segurança)](#sec-8)
- [9. [EXTRA] Armadilhas comuns e diagnóstico rápido](#sec-9)
- [Exercícios - Autenticação em SPA](#exercicios)
- [Changelog](#changelog)

---

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **Pré-requisitos recomendados:**
    - `13_http_rest_cors_e_contratos_api.md` (HTTP, CORS, cookies, headers)
    - `11_consumo_api_e_backend_node.md` (consumo de API; idealmente já com Axios explicado)
- **Como estudar bem este tema:** tenta sempre responder a estas 3 perguntas:
    1. “Como é que o backend prova quem eu sou?”
    2. “Onde é que o login fica guardado (e quem consegue ler)?”
    3. “Que tipo de ataque (ou bug) pode estragar isto?”

> **Regra de ouro:** em autenticação, “funcionar” não chega. Tem de funcionar **sem abrir buracos**.

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] Autenticação vs autorização (mapa mental)

### 1.1 Autenticação

**Autenticação** responde a:

> “Quem és tu?”

Exemplo típico:

- Envias email + password para o backend
- O backend valida
- O backend passa a reconhecer-te nos pedidos seguintes

### 1.2 Autorização

**Autorização** responde a:

> “Tens permissão para fazer isto?”

Exemplo:

- Estás autenticado
- Mas só Admin pode apagar utilizadores
- Então, além de “quem és”, o backend verifica “o que podes fazer”

### 1.3 Porque é que isto é importante numa SPA (React)?

Numa SPA:

- Navegas sem recarregar a página
- O teu estado React pode desaparecer num refresh
- E tu precisas que o backend continue a reconhecer-te

Ou seja, a SPA precisa de um plano para:

- **descobrir** se já existe login ao abrir
- **proteger** páginas/rotas
- **enviar pedidos** autenticados à API

#### Checkpoint

- Autenticação: “Quem és tu?”
- Autorização: “O que podes fazer?”
- Numa SPA, como é que a app descobre “se estou logado” depois de um refresh?

---

<a id="sec-2"></a>

## 2. [ESSENCIAL] Como o servidor te “reconhece” (3 abordagens)

Quando fazes `GET /perfil` ou `POST /treinos`, o backend tem de saber **quem está a pedir**.

Há 3 abordagens muito comuns:

### 2.1 Sessions (server-side)

- O backend cria uma sessão (um registo guardado no servidor)
- O backend devolve um **cookie com um id** (ex.: `sid=abc123`)
- Em pedidos seguintes, o browser envia `sid`
- O backend vai “buscar” a sessão e sabe quem és

✅ Vantagens:

- Revogar é fácil (apagas a sessão)
- Modelo simples de perceber

⚠️ Desvantagens:

- Tens de guardar sessões (base de dados/Redis)
- Com vários servidores, tens de partilhar sessões

### 2.2 JWT guardado no localStorage (client-side)

- O backend devolve um token (JWT)
- O frontend guarda em localStorage
- O frontend mete no header: `Authorization: Bearer <token>`

✅ Vantagens:

- Implementação rápida
- Não depende de cookies

⚠️ Problema grave:

- Se houver **XSS** (script malicioso na página), esse script pode ler o localStorage e roubar o token

> Por isso, este padrão é frequentemente evitado em apps modernas com foco em segurança.

### 2.3 JWT em cookie HttpOnly (recomendado)

- O backend guarda o token num **cookie HttpOnly**
- JavaScript não consegue ler esse cookie
- O browser envia o cookie automaticamente em pedidos (com CORS/credenciais bem configurados)

✅ Vantagens:

- Reduz risco de roubo de token via XSS
- Bom equilíbrio para SPA + API separada

⚠️ Atenção:

- Como cookies são automáticos, tens de lidar com **CSRF** (ver secção 6)

#### Mini decisão (regra prática do curso)

- Queremos segurança e simplicidade → **JWT em cookie HttpOnly + CSRF**

---

<a id="sec-3"></a>

## 3. [ESSENCIAL] Cookies por dentro (HttpOnly, Secure, SameSite)

Cookies são “automáticos”: o browser envia-os sem tu escreveres código para isso.
Mas três atributos mudam completamente o comportamento e a segurança.

### 3.1 HttpOnly

- `HttpOnly` significa: **JavaScript não consegue ler este cookie**
- Protege contra roubo de tokens por XSS (não elimina XSS, mas reduz impacto)

### 3.2 Secure

- `Secure` significa: só envia cookie em **HTTPS**
- Em produção: **deve estar ligado**
- Em localhost (http): normalmente fica `false` (apenas para dev)

### 3.3 SameSite

Controla quando o cookie é enviado em pedidos vindos “de fora”.

- `Strict`: muito restritivo
- `Lax`: bom default em muitos casos
- `None`: permite cross-site, mas exige `Secure`

Se tens:

- SPA: `http://localhost:5173`
- API: `http://localhost:3000`

são **origens diferentes**. Para cookies funcionarem, tens de configurar CORS e credenciais (secção 7).

#### Checkpoint

- Porque é que `HttpOnly` é importante?
- O que é que `Secure` muda?
- Porque é que `SameSite` influencia CSRF?

---

<a id="sec-4"></a>

## 4. [ESSENCIAL] Sessions (server-side)

### 4.1 Fluxo completo (passo a passo)

1. `POST /login` com email/password
2. Backend valida e cria sessão `{ userId, role, ... }`
3. Backend envia cookie com um id: `sid=abc123`
4. Pedido seguinte: browser envia `sid`
5. Backend encontra sessão e sabe quem és

```
POST /auth/login
   ↓
Set-Cookie: sid=abc123
   ↓
GET /auth/me   (cookie sid=abc123)
   ↓
{ user: ... }
```

### 4.2 Onde isto falha com vários servidores?

Se tiveres 2 servidores:

- Pedido A cria sessão no servidor 1
- Pedido B vai ao servidor 2 → não encontra sessão

Solução típica:

- guardar sessões em Redis (um “local comum”)

---

<a id="sec-5"></a>

## 5. [ESSENCIAL] JWT (stateless) e onde guardar tokens

### 5.1 O que é um JWT, na prática?

JWT é um token assinado pelo backend.
Ele inclui informação (claims), por exemplo:

- id do utilizador (`sub`)
- role (`role`)
- expiração (`exp`)

Quando o backend recebe um pedido:

- valida assinatura e expiração
- se estiver ok, considera o utilizador autenticado

### 5.2 “Stateless” significa o quê?

- O backend não precisa de guardar sessão
- Cada pedido traz “prova” (o token)
- O backend valida e continua

### 5.3 O ponto crítico volta sempre ao mesmo: onde guardar?

- localStorage → risco maior se houver XSS
- cookie HttpOnly → melhor contra roubo de token, mas tens CSRF

#### Checkpoint

- O que é “stateless”?
- Porque é que guardar token em localStorage é arriscado?

---

<a id="sec-6"></a>

## 6. [ESSENCIAL] Padrão recomendado: JWT em cookie HttpOnly + CSRF

### 6.1 O problema: cookies são enviados automaticamente

Se o token está em cookie, o browser envia-o automaticamente.
E isso abre a porta a um ataque chamado **CSRF**.

### 6.2 CSRF (em linguagem simples)

Um CSRF acontece quando:

- tu estás logado na tua app
- abres outro site (malicioso)
- esse site tenta disparar um pedido ao teu backend
- como o browser envia cookies automaticamente, o backend pode aceitar

### 6.3 Defesa simples e comum: CSRF token em header

Ideia:

- além do cookie, o frontend envia um token extra num header
- o backend só aceita pedidos de escrita se esse token estiver correto

Regra prática:

- **GET** → normalmente ok sem CSRF
- **POST/PUT/PATCH/DELETE** → **exigir CSRF**

Fluxo:

1. Backend faz login e coloca cookie HttpOnly `access_token`
2. Backend também disponibiliza um `csrfToken` (por endpoint ou cookie não-HttpOnly)
3. Frontend guarda o `csrfToken` em memória
4. Em pedidos de escrita: manda `X-CSRF-Token: <token>`
5. Backend verifica cookie + header

#### Checkpoint

- Porque é que CSRF aparece quando usas cookies?
- Que métodos HTTP devem exigir CSRF neste curso?

---

<a id="sec-7"></a>

## 7. [ESSENCIAL] Implementação prática (React + Axios + Node/Express)

> Aqui vamos usar **Axios**, porque em SPAs com cookies ele facilita:
>
> - `withCredentials`
> - cliente central (`baseURL`)
> - (opcional) interceptors

### 7.1 Backend: setup mínimo (Express)

Instalações típicas:

- `express`
- `cookie-parser`
- `cors`
- (se fores mesmo usar JWT) `jsonwebtoken`

Exemplo de setup:

```js
/**
 * server.js
 *
 * Setup mínimo para SPA + API com cookies:
 * - JSON body
 * - cookies
 * - CORS com credentials
 */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);

app.listen(3000, () => console.log("API em http://localhost:3000"));
```

> Se `origin` fosse `"*"`, cookies com `credentials: true` não funcionavam.

### 7.2 Backend: rotas mínimas de auth

Endpoints recomendados:

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /auth/csrf` (se estiveres a aplicar CSRF)

```js
/**
 * auth.routes.js
 *
 * Rotas mínimas (exemplo didático).
 * Em projeto real:
 * - passwords com hash (bcrypt)
 * - tokens reais (JWT)
 * - validações melhores
 */

import express from "express";

export const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
        return res
            .status(400)
            .json({ error: { message: "Credenciais em falta" } });
    }

    // Exemplo didático: user “válido”
    const user = { id: "u1", name: "Aluno", role: "client" };

    // Exemplo didático: token placeholder
    const accessToken = "TOKEN_EXEMPLO";

    res.cookie("access_token", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // produção: true (HTTPS)
        path: "/",
    });

    return res.json({ user });
});

authRouter.post("/logout", (req, res) => {
    res.clearCookie("access_token", { path: "/" });
    return res.status(204).send();
});

authRouter.get("/me", (req, res) => {
    const token = req.cookies?.access_token;

    if (!token) {
        return res.status(401).json({ error: { message: "Não autenticado" } });
    }

    // Aqui validavas o token e ias buscar o user real.
    const user = { id: "u1", name: "Aluno", role: "client" };
    return res.json({ user });
});

authRouter.get("/csrf", (req, res) => {
    return res.json({ csrfToken: "CSRF_EXEMPLO" });
});
```

### 7.3 Backend: middleware `requireAuth` para proteger rotas

```js
/**
 * requireAuth.js
 *
 * Bloqueia pedidos sem cookie de autenticação.
 * Em projeto real:
 * - valida JWT (assinatura + exp)
 * - mete req.user com dados reais
 */

export function requireAuth(req, res, next) {
    const token = req.cookies?.access_token;

    if (!token) {
        return res.status(401).json({ error: { message: "Não autenticado" } });
    }

    req.user = { id: "u1", role: "client" };
    return next();
}
```

### 7.4 Frontend: cliente Axios central

```js
/**
 * apiClient.js
 *
 * Cliente Axios central.
 * - withCredentials: envia cookies
 * - baseURL: evita repetir URLs
 */

import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});
```

### 7.5 Frontend: AuthContext (estado global do utilizador)

Objetivo:

- ao abrir a app, chamar `/auth/me`
- guardar `user` em memória
- expor `login/logout`

```jsx
/**
 * AuthContext.jsx
 *
 * Estado global de autenticação.
 * - refreshMe: descobre se há login ao abrir
 * - user fica em memória (Context)
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [status, setStatus] = useState("loading"); // "loading" | "ready"
    const [user, setUser] = useState(null);

    async function refreshMe() {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data.user);
        } catch {
            setUser(null);
        } finally {
            setStatus("ready");
        }
    }

    async function login({ email, password }) {
        const res = await api.post("/auth/login", { email, password });
        setUser(res.data.user ?? null);
        return res.data;
    }

    async function logout() {
        await api.post("/auth/logout");
        setUser(null);
    }

    useEffect(() => {
        refreshMe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = useMemo(
        () => ({ status, user, login, logout, refreshMe }),
        [status, user],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
    return ctx;
}
```

### 7.6 Frontend: rota protegida (React Router)

```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function PrivateRoute({ children }) {
    const { status, user } = useAuth();

    if (status === "loading") return <p>A verificar sessão...</p>;
    if (!user) return <Navigate to="/login" replace />;

    return children;
}
```

### 7.7 Frontend: login (formulário controlado)

```jsx
import { useState } from "react";
import { useAuth } from "./AuthContext";

function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setErro("");

        if (!email.trim() || !password.trim()) {
            setErro("Preenche email e password.");
            return;
        }

        try {
            await login({ email, password });
        } catch {
            setErro("Login inválido.");
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <label>
                Email
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>

            <label>
                Password
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>

            <button type="submit">Entrar</button>
            {erro && <p>{erro}</p>}
        </form>
    );
}

export default LoginPage;
```

#### Checkpoint

- Porque é que a SPA chama `/auth/me` ao abrir?
- Porque é que `withCredentials` é obrigatório quando usas cookies?
- O que faz `PrivateRoute`?

---

<a id="sec-8"></a>

## 8. [EXTRA] Refresh token (sessão longa sem “quebrar” segurança)

Em apps reais:

- **access token** curto (minutos)
- **refresh token** longo (dias)

Ideia:

- quando o access expira, o frontend pede um novo ao backend (`/auth/refresh`)
- o refresh token costuma ficar em cookie HttpOnly e é tratado com muito cuidado

Para 12.º ano, fica como EXTRA porque:

- adiciona mais endpoints e mais regras
- mas ajuda a perceber “porque é que às vezes voltamos a ter de fazer login”

---

<a id="sec-9"></a>

## 9. [EXTRA] Armadilhas comuns e diagnóstico rápido

### 9.1 “Funciona no Postman, mas no browser não”

Muito comum:

- Postman não tem CORS
- Browser tem CORS e regras de cookies

Checklist:

- backend: `cors({ origin: "...", credentials: true })`
- frontend: Axios com `withCredentials: true`
- cookie está a ser guardado? (DevTools → Application/Storage → Cookies)

### 9.2 “Não fica logado depois de refresh”

Checklist:

- a app chama `/auth/me` ao abrir?
- o backend devolve 401? (Network tab)
- o cookie existe mesmo?

### 9.3 “Recebo sempre 401 nas rotas privadas”

Checklist:

- o cookie está a ser enviado no pedido? (Network → Request Headers → Cookie)
- o backend tem `cookie-parser`?
- o cookie foi definido com `path: "/"`?

### 9.4 “Porque não guardamos o token no localStorage?”

Porque:

- um XSS pode ler localStorage e roubar o token
- tokens roubados são “chaves” para entrar como tu
- em auth, reduzir impacto de erros é importante

---

<a id="exercicios"></a>

## Exercícios - Autenticação em SPA

1. Escreve a diferença entre **autenticação** e **autorização** com um exemplo real.
2. Explica o que fazem `HttpOnly`, `Secure` e `SameSite`.
3. Explica porque é que **cookies + SPA em origem diferente** exige `credentials: true` no CORS.
4. Implementa `AuthProvider` com `user` e `status`. Ao abrir, chama `/auth/me`.
5. Implementa um formulário de login (controlado) que chama `POST /auth/login`.
6. Implementa logout a chamar `POST /auth/logout`.
7. Cria `PrivateRoute` para bloquear páginas sem user.
8. Diagnóstico: a app “não fica logada”. Lista 4 verificações (frontend/backend) antes de mexer no código.
9. (EXTRA) Explica por que motivo CSRF aparece com cookies e como um header `X-CSRF-Token` ajuda.
10. (EXTRA) Descreve a ideia de access token curto + refresh token longo.

---

<a id="changelog"></a>

## Changelog

- 2026-01-27: reescrita para nível de detalhe do ficheiro 08 (mapas mentais, comparação de abordagens, cookies por dentro, CSRF, CORS com credenciais, e implementação prática com React + Axios + Express).
