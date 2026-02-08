# React.js (12.º Ano) - 11 · Consumo de API e backend Node.js

> **Objetivo deste ficheiro**
>
> - Perceber o modelo **cliente-servidor** (frontend ↔ backend).
> - Entender o que é um **contrato de API** (o “acordo” entre frontend e backend).
> - Criar uma API simples com **Node.js + Express** (ES Modules).
> - Consumir a API no React com:
>     - `fetch` (base, obrigatório)
>     - `axios` (padrão muito usado em projetos reais)
> - Evitar erros comuns: **CORS**, **URLs erradas**, **status HTTP**, **erros de validação**, e **credenciais/cookies**.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] Modelo cliente-servidor (o que acontece “na vida real”)](#sec-1)
- [2. [ESSENCIAL] Contrato de API (o acordo entre as duas partes)](#sec-2)
- [3. [ESSENCIAL] Criar uma API simples em Node.js (Express)](#sec-3)
- [4. [ESSENCIAL] Consumir a API no React (GET + POST com fetch)](#sec-4)
- [5. [ESSENCIAL] CORS e erros comuns (diagnóstico rápido)](#sec-5)
- [6. [ESSENCIAL+] Axios (porque existe e como usar bem)](#sec-6)
- [7. [EXTRA] Proxy no Vite e variáveis de ambiente](#sec-7)
- [Exercícios - Consumo de API com backend Node.js](#exercicios)
- [Changelog](#changelog)

---

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- Este ficheiro liga **React** e **Node**. É normal parecer “muita coisa”, porque agora já tens duas aplicações a falar uma com a outra.
- Vai pela ordem:
    1. Entende o modelo cliente-servidor (secção 1)
    2. Entende o contrato (secção 2)
    3. Cria a API (secção 3)
    4. Consome no React (secção 4)
- Ligações úteis:
    - `08_useEffect_e_dados.md`: quando usar `useEffect` (ex.: carregar ao montar) vs quando usar handlers (ex.: submit).
    - `13_http_rest_cors_e_contratos_api.md`: reforça HTTP/REST/CORS (muito ligado a este ficheiro).

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] Modelo cliente-servidor (o que acontece “na vida real”)

### 1.1 A ideia central

Quando estás numa app “a sério”, tens quase sempre duas partes:

- **Frontend (cliente)**: corre no browser (React).
    - Mostra interface.
    - Reage a cliques e inputs.
    - Pede dados e envia dados.

- **Backend (servidor)**: corre num servidor (Node.js + Express).
    - Guarda e valida dados.
    - Decide o que cada utilizador pode ou não fazer.
    - Fala com base de dados (mais tarde: MongoDB).

O React **não deve** “guardar dados importantes” como verdade absoluta.
O React mostra e edita, mas **o servidor é a fonte de verdade**.

---

### 1.2 O que é um pedido HTTP (request) e uma resposta (response)

Pensa nisto como uma conversa:

- O frontend diz: “Preciso de X”
- O backend responde: “Aqui vai X” (ou “Não dá, por causa de Y”)

Essa conversa é feita em **HTTP**.

Um pedido tem:

- **método** (GET, POST, PUT, DELETE…)
- **URL** (o “endereço” do que queres)
- **headers** (informação extra)
- **body** (dados enviados, normalmente JSON)

Uma resposta tem:

- **status** (200, 201, 400, 401, 404, 500…)
- **headers**
- **body** (muitas vezes JSON)

---

### 1.3 GET vs POST (a diferença que precisas já)

- **GET**: pedir dados (não deve alterar nada)
    - Ex.: “dá-me a lista de alunos”
- **POST**: enviar dados para criar algo novo
    - Ex.: “cria um aluno com nome X e curso Y”

> Nota: Mais tarde vais ver PUT/PATCH/DELETE. Para já, GET e POST chegam para treinar o essencial.

---

### 1.4 Onde é que isto entra no React?

Aqui é onde muita gente se perde, então guarda esta regra simples:

1. **Carregar dados quando o ecrã abre**  
   → normalmente `useEffect` com `[]`  
   (porque é “tarefa externa” que acontece quando o componente aparece)

2. **Enviar dados quando o utilizador faz algo** (submit, botão)  
   → handler (`onSubmit`, `onClick`)  
   (porque é uma ação do utilizador)

Isto está explicado com detalhe no ficheiro 08.

---

<a id="sec-2"></a>

## 2. [ESSENCIAL] Contrato de API (o acordo entre as duas partes)

### 2.1 O que é o “contrato”?

Um contrato é o acordo entre frontend e backend:

- **Que URLs existem?**
- **Que métodos se usam?**
- **Que dados vão no body?**
- **Que dados voltam na resposta?**
- **Que formato têm os erros?**

Sem contrato, acontece o clássico:

- frontend envia `nomeAluno`
- backend espera `nome`
- e tudo falha “sem ninguém perceber porquê”.

---

### 2.2 Exemplo de contrato (Alunos)

Vamos definir um contrato simples.

#### Listar alunos

- **GET** `/api/alunos`
- **Resposta 200**

```json
[
    { "id": 1, "nome": "Ana", "curso": "Web" },
    { "id": 2, "nome": "Bruno", "curso": "Redes" }
]
```

#### Obter aluno por id

- **GET** `/api/alunos/:id`
- **Resposta 200**

```json
{ "id": 1, "nome": "Ana", "curso": "Web" }
```

- **Resposta 404 (não existe)**

```json
{
    "error": {
        "code": "NOT_FOUND",
        "message": "Aluno não encontrado",
        "details": []
    }
}
```

#### Criar aluno

- **POST** `/api/alunos`
- **Body**

```json
{ "nome": "Carla", "curso": "Web" }
```

- **Resposta 201**

```json
{ "id": 3, "nome": "Carla", "curso": "Web" }
```

- **Resposta 422 (validação)**

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Nome e curso são obrigatórios",
        "details": [{ "field": "nome", "message": "Obrigatório" }]
    }
}
```

---

### 2.3 Porque é que o formato de erro interessa?

Porque no React tu queres mostrar uma mensagem boa.

Se o backend devolver sempre algo diferente, o frontend fica cheio de `if` confusos.

Por isso, é muito comum escolher um formato de erro “fixo” como:

```json
{ "error": { "code": "...", "message": "...", "details": [] } }
```

Assim, no frontend tu sabes sempre “onde está a mensagem”.

---

### 2.4 Checklist rápido de contrato (antes de programar)

Antes de começar a codificar:

- Qual é o **método**?
- Qual é a **URL**?
- O pedido tem body? Se sim, qual é o formato?
- O sucesso devolve o quê?
- O erro devolve o quê (e em que status)?

Se consegues responder a isto, já consegues implementar.

---

<a id="sec-3"></a>

## 3. [ESSENCIAL] Criar uma API simples em Node.js (Express)

### 3.1 Setup mínimo (ES Modules)

```bash
mkdir backend
cd backend
npm init -y
npm install express cors
```

No `package.json`, garante:

```json
{
    "type": "module"
}
```

Isto permite usar `import`/`export` (ES Modules), que é o padrão recomendado.

---

### 3.2 Estrutura sugerida (simples e organizada)

Para não meter tudo num ficheiro gigante:

```
backend/
  package.json
  src/
    app.js
    server.js
    routes/
      alunos.routes.js
```

---

### 3.3 Código do servidor

```js
// src/app.js
import express from "express";
import cors from "cors";

const app = express();

/**
 * Configuração base de CORS para desenvolvimento.
 * - Permite pedidos do Vite (React) em http://localhost:5173
 * - Mais tarde, quando usarmos cookies/credenciais, esta configuração muda (secção 5 e 6).
 */
app.use(
    cors({
        origin: "http://localhost:5173",
    }),
);

app.use(express.json()); // permite ler JSON no body

export default app;
```

```js
// src/server.js
import app from "./app.js";

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`API a correr em http://localhost:${PORT}`);
});
```

---

### 3.4 Rotas de alunos (com contrato consistente)

```js
// src/routes/alunos.routes.js
import { Router } from "express";

const router = Router();

let nextId = 3;
const alunos = [
    { id: 1, nome: "Ana", curso: "Web" },
    { id: 2, nome: "Bruno", curso: "Redes" },
];

/**
 * Devolve erro num formato consistente.
 *
 * @param {import("express").Response} res
 * @param {number} status
 * @param {string} code
 * @param {string} message
 * @param {Array<object>} [details]
 */
function sendError(res, status, code, message, details = []) {
    return res.status(status).json({ error: { code, message, details } });
}

// GET /api/alunos
router.get("/", (req, res) => {
    res.status(200).json(alunos);
});

// GET /api/alunos/:id
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return sendError(res, 400, "INVALID_ID", "Id inválido");
    }

    const aluno = alunos.find((a) => a.id === id);
    if (!aluno) {
        return sendError(res, 404, "NOT_FOUND", "Aluno não encontrado");
    }

    res.status(200).json(aluno);
});

// POST /api/alunos
router.post("/", (req, res) => {
    const { nome, curso } = req.body || {};

    if (!nome || !curso) {
        return sendError(
            res,
            422,
            "VALIDATION_ERROR",
            "Nome e curso são obrigatórios",
            [
                { field: "nome", message: "Obrigatório" },
                { field: "curso", message: "Obrigatório" },
            ],
        );
    }

    const novo = { id: nextId++, nome, curso };
    alunos.push(novo);

    res.status(201).json(novo);
});

export default router;
```

Agora liga as rotas no `app.js`:

```js
// src/app.js
import express from "express";
import cors from "cors";
import alunosRoutes from "./routes/alunos.routes.js";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
    }),
);

app.use(express.json());

app.use("/api/alunos", alunosRoutes);

export default app;
```

Executar:

```bash
node src/server.js
```

Testar no browser:

- `http://localhost:3000/api/alunos`

---

<a id="sec-4"></a>

## 4. [ESSENCIAL] Consumir a API no React (GET + POST com fetch)

Nesta secção vais fazer o “lado do frontend”.

Lembra-te do modelo:

- `useEffect` para carregar dados ao abrir (GET)
- `onSubmit` para enviar dados do utilizador (POST)

---

### 4.1 Primeiro passo: escolher o URL base

Em desenvolvimento, tens duas origens:

- React (Vite): `http://localhost:5173`
- API (Express): `http://localhost:3000`

Isto é normal. Mas obriga-te a ser consistente.

Padrão simples:

- guardar o base URL numa variável (mais tarde: `.env`)

Exemplo:

```js
const API_BASE_URL = "http://localhost:3000";
```

---

### 4.2 Criar um “mini cliente de API” (fetch wrapper)

A ideia aqui é: em vez de espalhar `fetch(...)` por todo o lado, crias funções com nome:

- `apiGetAlunos()`
- `apiCreateAluno(...)`

Assim o teu React fica mais limpo e mais fácil de manter.

Cria `src/api/alunosApi.js`:

```js
// src/api/alunosApi.js

/**
 * URL base da API em desenvolvimento.
 * Mais tarde, vais trocar por uma variável de ambiente (secção 7).
 */
const API_BASE_URL = "http://localhost:3000";

/**
 * Converte uma Response em JSON (se existir) e devolve um erro útil quando !res.ok.
 *
 * @param {Response} res
 * @returns {Promise<any>}
 * @throws {Error}
 */
async function parseJsonOrThrow(res) {
    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
        ? await res.json()
        : null;

    if (!res.ok) {
        const msg = body?.error?.message || `HTTP ${res.status}: pedido falhou`;
        throw new Error(msg);
    }

    return body;
}

/**
 * GET /api/alunos
 *
 * @returns {Promise<Array<{id:number, nome:string, curso:string}>>}
 */
export async function apiGetAlunos() {
    const res = await fetch(`${API_BASE_URL}/api/alunos`);
    return await parseJsonOrThrow(res);
}

/**
 * POST /api/alunos
 *
 * @param {{nome:string, curso:string}} input
 * @returns {Promise<{id:number, nome:string, curso:string}>}
 */
export async function apiCreateAluno(input) {
    const res = await fetch(`${API_BASE_URL}/api/alunos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    return await parseJsonOrThrow(res);
}
```

Repara em duas coisas importantes:

- `fetch` não dá erro automaticamente em 404/500 → por isso validamos `res.ok`.
- nem todas as respostas são JSON → por isso confirmamos `Content-Type`.

---

### 4.3 Componente React: listar e criar (GET + POST)

Cria `src/components/AlunosPage.jsx`:

```jsx
import { useEffect, useState } from "react";
import { apiCreateAluno, apiGetAlunos } from "../api/alunosApi.js";

/**
 * Página de alunos:
 * - Carrega alunos ao montar (GET)
 * - Permite criar aluno (POST)
 * - Mostra estados: loading / erro / sucesso
 */
function AlunosPage() {
    const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
    const [erro, setErro] = useState("");
    const [alunos, setAlunos] = useState([]);

    const [nome, setNome] = useState("");
    const [curso, setCurso] = useState("Web");

    useEffect(() => {
        let ignore = false;

        async function carregar() {
            setStatus("loading");
            setErro("");

            try {
                const data = await apiGetAlunos();
                if (!ignore) {
                    setAlunos(data);
                    setStatus("success");
                }
            } catch (e) {
                const msg =
                    e instanceof Error ? e.message : "Falha ao carregar";
                if (!ignore) {
                    setErro(msg);
                    setStatus("error");
                }
            }
        }

        carregar();

        // Pequena proteção para evitar setState se o componente sair (em casos simples).
        // Quando chegares ao AbortController (ficheiro 08 e secção 6), esse é o padrão preferido.
        return () => {
            ignore = true;
        };
    }, []);

    async function onSubmit(e) {
        e.preventDefault();

        if (nome.trim() === "") {
            setErro("Nome é obrigatório.");
            setStatus("error");
            return;
        }

        try {
            setErro("");
            // opcional: podes mostrar um estado "loading" específico de submit,
            // mas para já mantemos simples
            const novo = await apiCreateAluno({ nome: nome.trim(), curso });

            // Atualiza lista no frontend (sem novo GET)
            setAlunos((prev) => [...prev, novo]);

            // Limpa campos
            setNome("");
            setCurso("Web");

            setStatus("success");
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Falha ao criar";
            setErro(msg);
            setStatus("error");
        }
    }

    return (
        <div>
            <h2>Alunos</h2>

            <form onSubmit={onSubmit}>
                <label>
                    Nome
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </label>

                <label>
                    Curso
                    <select
                        value={curso}
                        onChange={(e) => setCurso(e.target.value)}
                    >
                        <option value="Web">Web</option>
                        <option value="Redes">Redes</option>
                    </select>
                </label>

                <button type="submit">Criar</button>
            </form>

            {status === "loading" && <p>A carregar...</p>}
            {status === "error" && erro && <p>{erro}</p>}

            {status === "success" && (
                <>
                    {alunos.length === 0 ? (
                        <p>Sem alunos.</p>
                    ) : (
                        <ul>
                            {alunos.map((a) => (
                                <li key={a.id}>
                                    {a.nome} — {a.curso}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

export default AlunosPage;
```

---

### 4.4 Checkpoint (para garantires que percebeste)

- Onde é que está o GET? Porquê no `useEffect`?
- Onde é que está o POST? Porquê no `onSubmit`?
- Porque é que validamos `res.ok`?
- Porque é que criámos `apiGetAlunos()` em vez de usar `fetch` diretamente no componente?

---

<a id="sec-5"></a>

## 5. [ESSENCIAL] CORS e erros comuns (diagnóstico rápido)

### 5.1 O que é CORS (e porque aparece agora)

Como tens frontend e backend em portas diferentes:

- `http://localhost:5173` (React)
- `http://localhost:3000` (API)

O browser considera isto **origens diferentes** (origins diferentes).
Por segurança, o browser bloqueia pedidos por defeito.

CORS é a forma do servidor dizer ao browser:
“Eu permito pedidos vindos desta origem”.

No Express, isso é configurado no backend com `cors(...)`.

---

### 5.2 Erros mais comuns e o que significam

1. **`Failed to fetch`** (muito genérico)

Causas típicas:

- backend está desligado
- URL errada
- CORS bloqueou
- rede caiu

O que fazer:

- abre `http://localhost:3000/api/alunos` no browser
- confirma que o servidor está mesmo a correr
- olha para o separador Network (DevTools)

2. **CORS error (mensagem a dizer que foi bloqueado)**

Causa típica:

- o backend não permite a origem do frontend

Solução:

- garantir `origin: "http://localhost:5173"` no `cors(...)`

3. **404 Not Found**

Causa típica:

- endpoint errado (URL mal escrita)
- rota não existe

Solução:

- confirma o contrato (secção 2)
- confirma se o `app.use("/api/alunos", ...)` está certo

4. **422 / 400**

Causa típica:

- body inválido (faltam campos)
- tipo errado (id não é número)

Solução:

- ver a mensagem do backend (`error.message`)
- confirmar que estás a enviar JSON com `Content-Type: application/json`

---

### 5.3 Cookies/credenciais (nota curta)

Quando chegares a autenticação com cookies (JWT em HttpOnly cookies):

- no **frontend** tens de enviar pedidos com credenciais
- no **backend** tens de permitir credenciais no CORS

Com `fetch`, isso é:

```js
fetch(url, { credentials: "include" });
```

Com `axios`, é:

```js
axios.get(url, { withCredentials: true });
```

Isto é desenvolvido com mais detalhe na secção 6 (Axios) e no ficheiro de autenticação.

---

<a id="sec-6"></a>

## 6. [ESSENCIAL+] Axios (porque existe e como usar bem)

### 6.1 Onde é que faz sentido falar de Axios?

**Aqui.**  
O ficheiro 08 ensina `fetch` (base e obrigatório).
Este ficheiro (11) já está a falar de “consumo de API” de forma mais completa, por isso é o lugar certo para introduzir **axios**.

A ideia é:

- primeiro percebes o fluxo com `fetch` (porque é nativo e obriga-te a entender HTTP)
- depois aprendes axios (porque é muito usado em projetos reais e simplifica muito)

---

### 6.2 O que é o Axios (sem complicar)

Axios é uma biblioteca para fazer pedidos HTTP.

Vantagens típicas:

- API mais simples (já lida bem com JSON)
- `baseURL` numa instância (não repetes `"http://localhost:3000"`)
- `withCredentials` mais direto (cookies)
- melhor forma de tratar erros (e ler status/body)
- interceptors (padrão profissional, quando precisares)

Instalar:

```bash
npm install axios
```

---

### 6.3 Axios “mínimo” (comparação rápida com fetch)

Com fetch:

```js
const res = await fetch("http://localhost:3000/api/alunos");
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
```

Com axios:

```js
import axios from "axios";

const res = await axios.get("http://localhost:3000/api/alunos");
console.log(res.data); // já tens os dados
```

O axios:

- converte JSON automaticamente
- e lança erro em 400/500 (vai para o `catch`)

---

### 6.4 Criar um cliente axios (padrão recomendado)

Cria `src/api/httpClient.js`:

```js
// src/api/httpClient.js
import axios from "axios";

/**
 * Cliente HTTP centralizado.
 * Assim, todos os pedidos partilham a mesma configuração.
 *
 * Nota: em autenticação com cookies, ativa withCredentials.
 */
export const http = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000,
    withCredentials: false, // muda para true quando trabalhares com cookies (login)
});
```

Agora cria `src/api/alunosApiAxios.js`:

```js
// src/api/alunosApiAxios.js
import { http } from "./httpClient.js";

/**
 * GET /api/alunos
 */
export async function apiGetAlunosAxios() {
    const res = await http.get("/api/alunos");
    return res.data;
}

/**
 * POST /api/alunos
 *
 * @param {{nome: string, curso: string}} input
 */
export async function apiCreateAlunoAxios(input) {
    const res = await http.post("/api/alunos", input);
    return res.data;
}
```

---

### 6.5 Como tratar erros com axios (modelo mental)

Quando axios falha, o erro pode ter:

- `error.response` (houve resposta do servidor, tipo 404/422/500)
- `error.request` (foi enviado, mas não houve resposta)
- ou outro erro (ex.: timeout)

Exemplo de tratamento “bom e simples”:

```js
/**
 * Extrai uma mensagem útil de um erro do axios.
 *
 * @param {any} err
 * @returns {string}
 */
export function getAxiosErrorMessage(err) {
    const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message;

    return msg || "Falha no pedido";
}
```

---

### 6.6 Usar axios no componente (exemplo curto)

```jsx
import { useEffect, useState } from "react";
import { apiGetAlunosAxios } from "../api/alunosApiAxios.js";
import { getAxiosErrorMessage } from "../api/getAxiosErrorMessage.js";

function AlunosAxios() {
    const [status, setStatus] = useState("loading");
    const [erro, setErro] = useState("");
    const [alunos, setAlunos] = useState([]);

    useEffect(() => {
        async function carregar() {
            setStatus("loading");
            setErro("");

            try {
                const data = await apiGetAlunosAxios();
                setAlunos(data);
                setStatus("success");
            } catch (e) {
                setErro(getAxiosErrorMessage(e));
                setStatus("error");
            }
        }

        carregar();
    }, []);

    if (status === "loading") return <p>A carregar...</p>;
    if (status === "error") return <p>{erro}</p>;

    return (
        <ul>
            {alunos.map((a) => (
                <li key={a.id}>{a.nome}</li>
            ))}
        </ul>
    );
}

export default AlunosAxios;
```

---

### 6.7 Quando é que usamos mesmo axios no curso?

Recomendação prática:

- `fetch` (ficheiro 08 e secção 4 deste ficheiro) é obrigatório para entender o essencial.
- axios entra a partir do momento em que:
    - tens vários endpoints,
    - queres um **cliente** centralizado,
    - tens autenticação com cookies (com `withCredentials`),
    - queres padrões mais “de projeto”.

Ou seja: axios faz mais sentido a partir daqui (ficheiro 11), não antes.

---

<a id="sec-7"></a>

## 7. [EXTRA] Proxy no Vite e variáveis de ambiente

### 7.1 Porquê usar proxy?

Se usares proxy, consegues fazer pedidos assim:

```js
fetch("/api/alunos");
```

Em vez de:

```js
fetch("http://localhost:3000/api/alunos");
```

E isso reduz:

- erros de URL
- problemas de CORS em desenvolvimento

---

### 7.2 Proxy no Vite (exemplo)

No `vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
        },
    },
});
```

---

### 7.3 Variáveis de ambiente no Vite

Cria `.env` no projeto React:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Depois no código:

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

> Nota importante: `.env` no frontend **não guarda segredos**. Tudo o que está no frontend pode ser visto pelo utilizador.

---

<a id="exercicios"></a>

## Exercícios - Consumo de API com backend Node.js

1. Cria a API de alunos (secção 3) e confirma no browser que `GET /api/alunos` funciona.
2. No React, cria `apiGetAlunos()` com fetch e mostra a lista ao montar (`useEffect`).
3. Adiciona um formulário controlado (ficheiro 06) para criar alunos e faz `POST /api/alunos`.
4. Implementa um estado `status` ("loading" | "success" | "error") para controlar o ecrã.
5. Faz um erro de propósito: muda o endpoint para `/api/aluno` e observa o 404. Corrige.
6. Faz um erro de propósito: tenta criar um aluno sem nome e observa o 422. Mostra a mensagem do servidor.
7. Instala axios e cria `httpClient.js` com `baseURL`. Troca o GET por axios.
8. Implementa `getAxiosErrorMessage(err)` e usa-a para mostrar erros de forma consistente.
9. (EXTRA) Configura proxy no Vite e passa a usar `fetch("/api/alunos")`.
10. (EXTRA) Usa `.env` para o `API_BASE_URL` e confirma que funciona.

---

<a id="changelog"></a>

## Changelog

- 2026-01-11: criação do ficheiro.
- 2026-01-26: reescrita para maior detalhe e coerência com o ficheiro 08; adição de secção de Axios, cliente API, e checklist de diagnóstico.
