# React.js (12.º Ano) - 15 · HTTP, REST, CORS e contratos de API

> **Objetivo deste ficheiro**
>
> - Perceber **como o frontend fala com um backend** (HTTP: pedidos e respostas).
> - Saber escolher **métodos HTTP** (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) e interpretar **status codes**.
> - Entender o que é um **contrato de API** (o “acordo” entre frontend e backend) e porque evita bugs.
> - Perceber **CORS** (porque existe, como aparece o erro e como se resolve).
> - Ver padrões “de projeto real” (mas acessíveis) para **respostas consistentes**, **erros consistentes**, e **paginação/filtros**.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] HTTP: a conversa entre cliente e servidor](#sec-1)
- [2. [ESSENCIAL] REST: recursos, rotas e métodos](#sec-2)
- [3. [ESSENCIAL] Status codes: como ler “o que aconteceu”](#sec-3)
- [4. [ESSENCIAL] Contrato de API: o acordo entre frontend e backend](#sec-4)
- [5. [ESSENCIAL] Body, headers e JSON: o que vai dentro do pedido](#sec-5)
- [6. [ESSENCIAL] Query params: filtros, pesquisa e paginação](#sec-6)
- [7. [ESSENCIAL] CORS: porque dá erro e como se resolve](#sec-7)
- [8. [EXTRA] Preflight (OPTIONS): o pedido “antes do pedido”](#sec-8)
- [9. [EXTRA] Axios: quando faz sentido e como usar](#sec-9)
- [10. [EXTRA] Diagnóstico rápido: erros comuns e o que verificar](#sec-10)
- [Exercícios - HTTP, REST, CORS e contratos](#exercicios)
- [Changelog](#changelog)

---

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **Se estás a começar:** lê 1 → 2 → 3 → 4. Isto dá-te o “mapa mental” para todo o resto.
- **Se já usas `fetch` em React:** foca-te em 4 (contratos) e 7 (CORS). É onde acontecem mais bugs.
- **Como estudar (prático):**
    1. Cria uma rota simples no backend (ex.: `GET /api/alunos`).
    2. Consome-a no frontend.
    3. Muda uma coisa no backend (nome de campo, status, erro) e vê como isso “parte” o frontend.
    4. Depois faz o contrário: define o contrato primeiro e implementa a seguir.
- **Ligações úteis:**
    - `08_useEffect_e_dados.md` (porque é que o `fetch` fica no `useEffect`)
    - `11_consumo_api_e_backend_node.md` (onde vais praticar consumo de API no frontend e no backend)

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] HTTP: a conversa entre cliente e servidor

### 1.1 Modelo mental: “pedido” e “resposta”

Quando o teu frontend quer dados, ele faz um **pedido HTTP** (request) para uma **URL**.

O servidor responde com uma **resposta HTTP** (response).

Pensa nisto como uma conversa:

- **Cliente (frontend):** “Quero a lista de alunos.”
- **Servidor (backend):** “Ok. Aqui está.” (ou “Não tens permissão.”, ou “Não encontrei.”)

Um pedido HTTP tem (simplificado):

- **Método**: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- **URL**: ex. `http://localhost:3000/api/alunos`
- **Headers**: metadados (ex.: `Content-Type`, `Authorization`)
- **Body** (às vezes): dados enviados (normalmente em JSON)

Uma resposta HTTP tem:

- **Status code**: `200`, `201`, `400`, `401`, `404`, `500`, ...
- **Headers**: metadados (ex.: `Content-Type`)
- **Body**: dados da resposta (muitas vezes em JSON)

Mini-diagrama:

```
Frontend (React)                 Backend (Node/Express)
      |                                   |
      |  GET /api/alunos                  |
      |---------------------------------->|
      |                                   |
      |  200 OK + JSON (lista)            |
      |<----------------------------------|
```

### 1.2 “Stateless”: o servidor não adivinha o que tu queres

HTTP é **stateless** (sem memória) por natureza.

Isto significa:

- Cada pedido deve trazer a informação necessária para ser entendido.
- O servidor não “se lembra” automaticamente do pedido anterior.

Exemplos práticos do que o pedido tem de trazer:

- A rota correta: `/api/alunos`
- O método correto: `GET`
- (Se for preciso) credenciais: cookies/sessão, token, etc.
- (Se for preciso) filtros/pesquisa: query params

> Nota: Sessões e cookies existem, mas mesmo assim cada pedido tem de trazer o cookie (o browser envia-o). O servidor não “lê a tua mente”.

### 1.3 Porque é que isto interessa em React?

Porque em React vais fazer coisas como:

- carregar dados ao abrir uma página
- filtrar/pesquisar e voltar a carregar
- enviar um formulário (criar/editar)

E cada uma destas ações é, na prática, **um pedido HTTP**.

**Checkpoint**

- O que traz um pedido HTTP?
- O que traz uma resposta HTTP?
- O que quer dizer “stateless”?

---

<a id="sec-2"></a>

## 2. [ESSENCIAL] REST: recursos, rotas e métodos

### 2.1 O que é REST (sem complicar)

REST é uma forma de desenhar APIs baseada em **recursos**.

Um **recurso** é uma “coisa” que existe no teu sistema:

- alunos
- produtos
- treinos
- mensagens

Em REST, tu não pensas em “ações” tipo `criarAluno()`.
Tu pensas em **URLs** que representam recursos, e usas **métodos HTTP** para dizer o que queres fazer.

Exemplos:

- `GET /api/alunos` → buscar a lista de alunos
- `GET /api/alunos/123` → buscar o aluno 123
- `POST /api/alunos` → criar um aluno novo
- `PATCH /api/alunos/123` → editar parcialmente o aluno 123
- `DELETE /api/alunos/123` → apagar o aluno 123

### 2.2 Árvore de decisão: qual método uso?

Quando estiveres na dúvida, usa esta regra:

1. **Quero ler dados?** → `GET`
2. **Quero criar algo novo?** → `POST`
3. **Quero substituir tudo (atualização total)?** → `PUT`
4. **Quero alterar só algumas coisas?** → `PATCH`
5. **Quero apagar?** → `DELETE`

> Na prática, em projetos web, vais usar muito `GET`, `POST` e `PATCH`.

### 2.3 Idempotência (conceito importante)

Idempotente significa:

> Se eu repetir o mesmo pedido 1x, 2x, 10x… o resultado final fica igual.

- `GET` é idempotente (não muda nada).
- `DELETE /alunos/123` é idempotente (apagar 2 vezes deixa “apagado”).
- `POST` normalmente **não** é idempotente (podes criar duplicados).

Isto interessa porque:

- redes falham
- o utilizador pode carregar duas vezes
- o browser pode repetir pedidos
- o teu código pode disparar 2 requests sem querer

Se `POST` criar duplicados, tens de ter cuidado (validações, chaves únicas, etc.).

**Checkpoint**

- O que é um recurso?
- Quando é que usas `POST` vs `PATCH`?
- O que quer dizer “idempotente”?

---

<a id="sec-3"></a>

## 3. [ESSENCIAL] Status codes: como ler “o que aconteceu”

### 3.1 Modelo mental: status é a resposta “curta”

O **status code** é o servidor a dizer, de forma rápida:

- “Correu bem”
- “Fizeste um pedido errado”
- “Não tens permissão”
- “Eu (servidor) falhei”

Categorias principais:

- **2xx** → sucesso
- **4xx** → erro do cliente (o pedido está mal, falta auth, etc.)
- **5xx** → erro do servidor (bug, crash, problema interno)

### 3.2 Os status mais comuns (e o que significam)

**Sucesso**

- `200 OK` → correu bem (resposta normal)
- `201 Created` → criado com sucesso (muito usado em `POST`)
- `204 No Content` → correu bem mas sem body (muito usado em `DELETE`)

**Erros do cliente**

- `400 Bad Request` → dados inválidos, falta campo, etc.
- `401 Unauthorized` → não autenticado (falta login/token)
- `403 Forbidden` → autenticado mas sem permissão
- `404 Not Found` → não existe (rota errada ou id não existe)
- `409 Conflict` → conflito (ex.: email já existe)
- `422 Unprocessable Entity` → validação falhou (opcional, mas útil)

**Erros do servidor**

- `500 Internal Server Error` → bug / erro interno
- `503 Service Unavailable` → servidor indisponível

### 3.3 Como isto liga ao `fetch`/Axios

No frontend, tu vais olhar para:

- `res.ok` (no `fetch`) ou
- `error.response.status` (no Axios)

Para decidir:

- mostrar dados
- mostrar erro
- pedir login
- etc.

**Checkpoint**

- Qual a diferença entre 4xx e 5xx?
- Porque é que `401` e `403` não são a mesma coisa?

---

<a id="sec-4"></a>

## 4. [ESSENCIAL] Contrato de API: o acordo entre frontend e backend

### 4.1 O que é um “contrato” (e porque salva projetos)

Um **contrato de API** é o acordo sobre:

- Que rotas existem
- Que dados entram (request)
- Que dados saem (response)
- Que erros podem acontecer e como são devolvidos

Sem contrato, acontece isto:

- o backend devolve `{ name: "Ana" }`
- o frontend espera `{ nome: "Ana" }`
- a UI parte e ninguém percebe logo porquê

Ou ainda pior:

- o backend devolve erro em texto
- o frontend tenta fazer `res.json()` e rebenta com “Unexpected token <”

Contrato é “a mesma língua” nos dois lados.

### 4.2 Contrato mínimo (o que tens de definir SEMPRE)

Para cada endpoint, define no mínimo:

1. **Método + rota**
2. **O que recebe**
    - `params` (ex.: `/:id`)
    - `query` (ex.: `?q=ana&page=2`)
    - `body` (JSON, se for `POST/PATCH/PUT`)
3. **O que devolve em sucesso**
    - status code
    - shape do JSON
4. **O que devolve em erro**
    - status code
    - shape do erro

### 4.3 Padrão recomendado para respostas (simples e consistente)

Em projetos reais, é muito comum manter um formato consistente.

Duas opções comuns:

**Opção A: resposta “direta” (mais simples)**

- sucesso: devolves o JSON dos dados diretamente
- erro: devolves sempre um JSON com `{ error: {...} }`

Exemplos:

```json
// GET /api/alunos (200)
[
    { "id": "a1", "nome": "Ana" },
    { "id": "b2", "nome": "Bruno" }
]
```

```json
// erro (400/401/404/...)
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "O campo 'nome' é obrigatório",
        "details": [{ "field": "nome", "issue": "required" }]
    }
}
```

**Opção B: resposta “envelopada” (mais formal)**

- sucesso: `{ data: ... }`
- erro: `{ error: ... }`

Exemplo:

```json
{
    "data": [
        { "id": "a1", "nome": "Ana" },
        { "id": "b2", "nome": "Bruno" }
    ]
}
```

> Para 12.º ano, a Opção A costuma ser mais direta.
> O importante é: **ser consistente em toda a API**.

### 4.4 Contrato para listas (paginação)

Quando a lista pode crescer muito, convém devolver:

- os items
- metadados (página, total, etc.)

Exemplo de contrato de lista paginada:

```json
{
    "items": [
        { "id": "a1", "nome": "Ana" },
        { "id": "b2", "nome": "Bruno" }
    ],
    "page": 1,
    "pageSize": 10,
    "totalItems": 42,
    "totalPages": 5
}
```

Isto evita “adivinhações” no frontend.

### 4.5 Datas e IDs (regras simples que evitam bugs)

- **IDs**: trata como **string** no frontend.
    - Mesmo que no backend seja número ou ObjectId, no frontend é texto.
- **Datas**: usa sempre **ISO 8601** (string).
    - Ex.: `"2026-01-26T10:30:00.000Z"`

Se cada endpoint inventar o seu formato de data, ninguém aguenta.

### 4.6 Exemplo de contrato (tabela pequena)

| Ação          | Método | Rota              | Sucesso     | Erros típicos     |
| ------------- | ------ | ----------------- | ----------- | ----------------- |
| Listar alunos | GET    | `/api/alunos`     | 200 + lista | 500               |
| Buscar aluno  | GET    | `/api/alunos/:id` | 200 + aluno | 404, 500          |
| Criar aluno   | POST   | `/api/alunos`     | 201 + aluno | 400/422, 409, 500 |
| Editar aluno  | PATCH  | `/api/alunos/:id` | 200 + aluno | 400/422, 404, 500 |
| Apagar aluno  | DELETE | `/api/alunos/:id` | 204         | 404, 500          |

**Checkpoint**

- O que é um contrato de API?
- Porque é que “ser consistente” é mais importante do que “ser perfeito”?
- Porque é que IDs e datas têm regras próprias?

---

<a id="sec-5"></a>

## 5. [ESSENCIAL] Body, headers e JSON: o que vai dentro do pedido

### 5.1 Headers: “etiquetas” do pedido e da resposta

Headers são metadados. Alguns importantes:

- `Content-Type`: que tipo de body estás a enviar (ex.: `application/json`)
- `Accept`: que tipo de resposta queres (ex.: `application/json`)
- `Authorization`: onde normalmente vai um token (quando existir)
- `Cookie`: cookies são enviados automaticamente pelo browser (quando aplicável)

No Express, para ler JSON do body, normalmente precisas de:

```js
app.use(express.json());
```

Sem isto, `req.body` pode vir `undefined`.

### 5.2 Body (JSON): onde vão os dados de criar/editar

Em `POST`, `PUT`, `PATCH`, normalmente envias um body JSON.

Exemplo de body para criar aluno:

```json
{
    "nome": "Ana",
    "email": "ana@exemplo.pt"
}
```

### 5.3 Exemplo (frontend com `fetch`) — criar recurso

```js
async function criarAluno() {
    const res = await fetch("http://localhost:3000/api/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: "Ana", email: "ana@exemplo.pt" }),
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    const alunoCriado = await res.json();
    return alunoCriado;
}
```

Pontos importantes:

- `body` tem de ser texto → `JSON.stringify(...)`
- `Content-Type` tem de ser `application/json`
- **`fetch` não falha automaticamente em 400/500** → tens de validar `res.ok`

### 5.4 Exemplo (backend com Express) — receber e validar

```js
import express from "express";

const app = express();
app.use(express.json());

/**
 * POST /api/alunos
 * Cria um aluno. Exemplo didático:
 * - valida campos obrigatórios
 * - devolve 201 em sucesso
 */
app.post("/api/alunos", (req, res) => {
    const { nome, email } = req.body ?? {};

    if (!nome || String(nome).trim() === "") {
        return res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "O campo 'nome' é obrigatório",
                details: [{ field: "nome", issue: "required" }],
            },
        });
    }

    // Em projeto real guardavas na BD e geravas id
    const novoAluno = { id: "a1", nome, email: email ?? "" };

    return res.status(201).json(novoAluno);
});
```

**Checkpoint**

- Para que serve `Content-Type`?
- Porque é que temos de fazer `JSON.stringify`?
- O que acontece se esqueceres `express.json()`?

---

<a id="sec-6"></a>

## 6. [ESSENCIAL] Query params: filtros, pesquisa e paginação

### 6.1 O que são query params?

Query params são coisas na URL depois do `?`.

Exemplos:

- `/api/alunos?page=2&pageSize=10`
- `/api/alunos?q=ana`
- `/api/alunos?curso=web&ano=12`

No Express, lês com `req.query`.

### 6.2 Padrões comuns (para não inventar sempre)

**Pesquisa (texto)**

- `q` (ou `search`)
- Ex.: `/api/alunos?q=ana`

**Paginação**

- `page` (começa em 1)
- `pageSize` (quantos items por página)
- Ex.: `/api/alunos?page=1&pageSize=10`

**Ordenação**

- `sort` (campo)
- `order` (`asc` ou `desc`)
- Ex.: `/api/alunos?sort=nome&order=asc`

> O mais importante é: escolher um padrão e manter.

### 6.3 Exemplo backend (ler query e aplicar defaults)

```js
app.get("/api/alunos", (req, res) => {
    const q = String(req.query.q ?? "")
        .trim()
        .toLowerCase();
    const page = Number(req.query.page ?? 1);
    const pageSize = Number(req.query.pageSize ?? 10);

    const pageOk = Number.isFinite(page) && page >= 1 ? page : 1;
    const pageSizeOk =
        Number.isFinite(pageSize) && pageSize >= 1 && pageSize <= 50
            ? pageSize
            : 10;

    // Exemplo com “dados fake”
    const todos = [
        { id: "a1", nome: "Ana" },
        { id: "b2", nome: "Bruno" },
        { id: "c3", nome: "Carla" },
    ];

    const filtrados = q
        ? todos.filter((a) => a.nome.toLowerCase().includes(q))
        : todos;

    const totalItems = filtrados.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSizeOk));

    const start = (pageOk - 1) * pageSizeOk;
    const items = filtrados.slice(start, start + pageSizeOk);

    return res.json({
        items,
        page: pageOk,
        pageSize: pageSizeOk,
        totalItems,
        totalPages,
    });
});
```

**Checkpoint**

- O que são query params?
- Porque é que é importante ter defaults e limites (ex.: `pageSize <= 50`)?

---

<a id="sec-7"></a>

## 7. [ESSENCIAL] CORS: porque dá erro e como se resolve

### 7.1 Primeiro: o que é “origem” (origin)?

A origem é (simplificado):

- **protocolo** + **domínio** + **porta**

Exemplos de origens diferentes:

- `http://localhost:5173` (Vite)
- `http://localhost:3000` (API)
- `https://exemplo.pt` (produção)

### 7.2 Porque existe CORS?

O browser tem uma regra de segurança chamada **Same-Origin Policy**.

Ela existe para evitar que um site malicioso faça pedidos “em teu nome” para outro site onde estás autenticado.

Quando o frontend (origem A) tenta chamar uma API noutra origem (origem B), o browser pergunta:

> “O servidor B permite pedidos vindos da origem A?”

Se o servidor não disser “sim”, o browser bloqueia e aparece erro de CORS.

**Ponto importante:**
CORS é **uma regra do browser**. Postman e curl não têm estas regras.

### 7.3 Como aparece o erro?

Normalmente como um erro no DevTools/Console, do tipo:

- “blocked by CORS policy”
- “No 'Access-Control-Allow-Origin' header…”

E no teu código pode parecer “Network error” (porque o browser bloqueou).

### 7.4 Como se resolve (no backend)

Tens de configurar o servidor para enviar headers CORS.

Em Express, a forma mais simples é usar o pacote `cors`.

```bash
npm i cors
```

Exemplo base (dev):

```js
import cors from "cors";

app.use(
    cors({
        origin: "http://localhost:5173",
    }),
);
```

Isto diz:

- “Aceito pedidos vindos do Vite.”

### 7.5 Cookies / credenciais (quando for o caso)

Se usares cookies (sessões ou JWT em cookie HttpOnly), precisas de mais duas coisas:

1. No backend:

- `credentials: true`
- e `origin` não pode ser `"*"`

```js
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);
```

2. No frontend, no `fetch` tens de dizer:

```js
fetch(url, { credentials: "include" });
```

> Nota: Se não estiveres a usar cookies, isto não é necessário.

**Checkpoint**

- O que é uma origin?
- Porque é que CORS existe?
- Porque é que CORS se resolve no backend (e não “com magia” no frontend)?

---

<a id="sec-8"></a>

## 8. [EXTRA] Preflight (OPTIONS): o pedido “antes do pedido”

### 8.1 O que é um preflight?

Às vezes, antes do teu pedido verdadeiro (ex.: `POST`), o browser manda um pedido **OPTIONS** primeiro.

Esse pedido serve para perguntar ao servidor:

- “Aceitas este método?”
- “Aceitas estes headers?”
- “Aceitas pedidos desta origem?”

Se o servidor não responder corretamente, o pedido verdadeiro nem chega a acontecer.

### 8.2 Quando é que acontece?

Um preflight acontece com frequência quando:

- usas métodos como `PUT`, `PATCH`, `DELETE`
- envias headers “não simples” (ex.: `Authorization`)
- envias JSON com `Content-Type: application/json` (muito comum)

Isto é normal. Não é erro. Mas tens de ter o CORS bem configurado.

### 8.3 Como resolver?

Se estiveres a usar o middleware `cors` do Express corretamente, normalmente ele trata disso.

Se estiveres a configurar “à mão”, tens de garantir que respondes a `OPTIONS` com os headers certos.

**Checkpoint**

- O que é um preflight?
- Porque é que às vezes parece que o `POST` “nem chega ao backend”?

---

<a id="sec-9"></a>

## 9. [EXTRA] Axios: quando faz sentido e como usar

> Onde é que isto deve aparecer no curso?
>
> - **Este ficheiro (HTTP/REST/CORS)** é bom para explicar “o que é” e “porque existe”.
> - O lugar ideal para praticar a sério é o ficheiro de **consumo de API** (`11_consumo_api_e_backend_node.md`), porque aí já estás a construir o “cliente” da API.

### 9.1 Porque é que existe Axios?

O `fetch` é ótimo para aprender, mas em projetos reais o Axios dá-te:

- JSON automático (não precisas de `res.json()`)
- tratamento de erros mais direto (status e body disponíveis no erro)
- `baseURL` e headers comuns num sítio só
- interceptors (avançado, mas útil)

### 9.2 Instalar e criar um “cliente” Axios

```bash
npm i axios
```

Cria um ficheiro `src/lib/api.js`:

```js
import axios from "axios";

/**
 * Cliente Axios para a API.
 * - baseURL aponta para o backend
 * - withCredentials só é preciso se usares cookies
 */
export const api = axios.create({
    baseURL: "http://localhost:3000",
    // withCredentials: true,
});
```

### 9.3 Exemplo: GET com Axios

```js
import { api } from "./lib/api";

export async function listarAlunos() {
    const res = await api.get("/api/alunos");
    return res.data; // aqui já vem o JSON
}
```

### 9.4 Exemplo: erro com Axios (diferença para `fetch`)

```js
import { api } from "./lib/api";

export async function criarAluno(payload) {
    try {
        const res = await api.post("/api/alunos", payload);
        return res.data;
    } catch (err) {
        // err.response existe quando o servidor respondeu com 4xx/5xx
        const status = err?.response?.status;
        const body = err?.response?.data;

        const msg = body?.error?.message ?? `Erro HTTP ${status ?? "?"}`;
        throw new Error(msg);
    }
}
```

**Checkpoint**

- Qual a principal vantagem do Axios para um projeto maior?
- Qual é a diferença entre erro no `fetch` e erro no Axios?

---

<a id="sec-10"></a>

## 10. [EXTRA] Diagnóstico rápido: erros comuns e o que verificar

### 10.1 “Não entra no catch, mas deu 404/500”

No `fetch`, isto é normal.

Lembra-te:

- `fetch` só dá erro automático em **problemas de rede**
- 404/500 são respostas válidas → tens de validar `res.ok`

Checklist:

- tens `if (!res.ok) throw ...`?
- estás a fazer `await res.json()` só depois de validar?

### 10.2 “CORS policy blocked…”

Checklist:

- a origin do frontend está correta no backend?
- estás a usar a porta certa? (`5173` no Vite, por exemplo)
- no backend, tens `cors({ origin: "...", credentials: true? })`?
- se usas cookies, no frontend tens `credentials: "include"` (fetch) / `withCredentials: true` (axios)?

### 10.3 “Unexpected token < in JSON”

Isto costuma significar:

- o backend respondeu **HTML** (ex.: página de erro) em vez de JSON
- e tu fizeste `res.json()`

Checklist:

- a rota existe mesmo?
- estás a chamar o endpoint certo?
- o backend devolve sempre JSON nos erros?

### 10.4 “Rota funciona no Postman, mas no browser falha”

Quase sempre é CORS.

Lembra-te: CORS é regra do browser, Postman não tem isso.

### 10.5 “Estou a criar duplicados sem querer”

Checklist:

- estás a usar `POST` duas vezes?
- tens StrictMode em dev (pode repetir efeitos)?
- tens validações/chaves únicas no backend?

---

<a id="exercicios"></a>

## Exercícios - HTTP, REST, CORS e contratos

1. **Pedido e resposta:** escolhe uma rota (ex.: `GET /api/alunos`) e escreve, em português, o que vai no pedido (método, URL, headers) e o que vem na resposta (status, body).
2. **REST na prática:** para um recurso “tarefas”, desenha 5 endpoints REST (listar, obter 1, criar, editar, apagar).
3. **Status codes:** para cada endpoint de tarefas, decide qual o status de sucesso (200/201/204) e justifica.
4. **Contrato de erro:** define um formato único de erro `{ error: { code, message, details } }` e dá 3 exemplos reais (ex.: campo em falta, login necessário, id inexistente).
5. **Paginação:** desenha a resposta de uma lista paginada (items, page, pageSize, totalItems, totalPages).
6. **CORS:** cria um frontend em `localhost:5173` e um backend em `localhost:3000`. Força um erro de CORS (sem configuração) e depois resolve com o middleware `cors`.
7. **Preflight:** cria um `PATCH` com `Content-Type: application/json` e observa no Network tab que aparece um `OPTIONS` antes.
8. **Axios (opcional):** cria `src/lib/api.js` com `axios.create` e reescreve um `GET` e um `POST` que já tinhas em `fetch`.

---

<a id="changelog"></a>

## Changelog

- 2026-01-11: criação do ficheiro.
- 2026-01-26: reescrita e expansão para nível “guia completo”:
    - modelo mental de HTTP (request/response) e stateless
    - REST com árvore de decisão e idempotência
    - status codes com significado e usos típicos
    - contratos de API (sucesso, erro, listas paginadas, regras de IDs/datas)
    - headers/body/JSON com exemplos frontend e backend
    - query params com padrões e exemplo realista
    - CORS explicado a partir de origin + same-origin policy
    - preflight (OPTIONS) e quando aparece
    - introdução a Axios e onde faz sentido encaixar no curso
    - secção de diagnóstico rápido + exercícios mais completos
