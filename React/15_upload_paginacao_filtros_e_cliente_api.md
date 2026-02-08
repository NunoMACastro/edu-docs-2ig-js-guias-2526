# React.js (12.º Ano) - 17 · Upload, paginação, filtros e cliente de API

> **Objetivo deste ficheiro**
>
> - Usar **query string** (`?page=...&q=...`) como parte do estado da app (links partilháveis e navegação do browser).
> - Implementar **paginação**, **pesquisa** e **filtros** de forma previsível (sem pedidos duplicados e sem “voltar atrás” nos dados).
> - Fazer **upload de ficheiros** com `FormData` (`multipart/form-data`) e tratar validações básicas.
> - Criar um **cliente de API** reutilizável (com `fetch`) e, como EXTRA, uma alternativa com **Axios**.
> - Treinar padrões usados em projetos reais (mas sempre com código acessível): **loading/erro/sucesso**, **debounce**, **abort**, **timeout** e **retries**.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] Query string: o que é e porque usar](#sec-1)
- [2. [ESSENCIAL] Paginação + pesquisa (server-side)](#sec-2)
- [3. [ESSENCIAL] Upload com `FormData` (multipart)](#sec-3)
- [4. [ESSENCIAL] Estados de ecrã: loading, erro, vazio e sucesso](#sec-4)
- [5. [EXTRA] Debounce na pesquisa](#sec-5)
- [6. [EXTRA] Timeouts, retries e cancelamento (AbortController)](#sec-6)
- [7. [EXTRA] Cliente API com Axios](#sec-7)
- [Exercícios - upload, paginação e cliente de API](#exercicios)
- [Changelog](#changelog)

---

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **Pré-requisitos (mínimos):**
    - `useState` / `useEffect` (ver ficheiro **08**).
    - listas e condicionais (ver ficheiro **05**).
    - React Router (`useSearchParams`) (ver ficheiros **09** e **10**).

- **Como estudar (boa sequência):**
    1. lê a secção **1** e faz os mini-exemplos de query string;
    2. passa para a secção **2** e monta a paginação com uma API de teste;
    3. só depois avança para **upload** (secção 3) e extras (5–7).

- **Ideia-chave:**  
  Neste ficheiro estamos a treinar um padrão muito comum em apps:
  **a UI controla parâmetros** (page, filtro, pesquisa) → **esses parâmetros vão para a URL** → **a URL dispara o pedido** → **a resposta volta para a UI**.

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] Query string: o que é e porque usar

### 1.1 O que é “query string”?

É a parte de uma URL que vem depois do `?`.

Exemplos:

- `/tarefas?page=1&limit=10`
- `/clientes?q=ana`
- `/produtos?categoria=tecnologia&ordenar=preco`

Cada par `chave=valor` é chamado de **query param**.

> Mini-regra:
>
> - **Path params** (rota dinâmica) → identificam _um recurso_ (`/clientes/42`)
> - **Query params** → são _opções_ desse pedido (`?page=2&q=ana&limit=10`)

### 1.2 Porque é que vale a pena pôr isto na URL?

Porque traz vantagens reais:

1. **Link partilhável:** copias a URL e outra pessoa abre “no mesmo estado”.
2. **Refresh não perde estado:** podes recarregar a página e manter `page` e `q`.
3. **Botões do browser funcionam:** back/forward muda `page`/`q` corretamente.
4. **Debug mais fácil:** a URL mostra logo o que está a ser pedido.

Isto é um salto enorme de “projeto pequeno” para “app organizada”.

### 1.3 `useSearchParams` (React Router) — modelo mental

O hook `useSearchParams()` dá-te duas coisas:

- `searchParams` → para **ler** params
- `setSearchParams` → para **alterar** params (e atualizar a URL)

O mais importante para não te enganares:

- **Na URL, tudo é texto.**  
  Mesmo `page=2` chega como `"2"`. Tu é que convertes para número.

### 1.4 Ler params com defaults (sem dar erros)

```jsx
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Lê query params e devolve valores já validados.
 * - page e limit: números >= 1
 * - q: texto (trim)
 */
function useListaQuery() {
    const [sp, setSp] = useSearchParams();

    const query = useMemo(() => {
        const pageRaw = sp.get("page") ?? "1";
        const limitRaw = sp.get("limit") ?? "10";
        const qRaw = sp.get("q") ?? "";

        const page = Math.max(1, Number.parseInt(pageRaw, 10) || 1);
        const limit = Math.max(1, Number.parseInt(limitRaw, 10) || 10);
        const q = qRaw.trim();

        return { page, limit, q };
    }, [sp]);

    /**
     * Atualiza 1 ou mais query params, mantendo os restantes.
     * - Se o valor for "" ou null, removemos o param (URL limpa).
     */
    function setQuery(next) {
        const merged = new URLSearchParams(sp);

        for (const [key, value] of Object.entries(next)) {
            if (value === "" || value === null || value === undefined) {
                merged.delete(key);
            } else {
                merged.set(key, String(value));
            }
        }

        setSp(merged);
    }

    return { ...query, setQuery };
}

export default useListaQuery;
```

Porque é que isto é “bom”?

- Se alguém escrever `/tarefas?page=abc`, não crasha.
- `page` e `limit` nunca ficam `NaN`.
- A função `setQuery` não apaga os outros params sem querer.

### 1.5 Onde é que isto é usado?

Quase sempre em páginas de lista:

- **lista de clientes**
- **lista de tarefas**
- **tabela de produtos**
- **pesquisa**
- **filtros**

A seguir vamos ligar isto a um `fetch` com paginação.

---

<a id="sec-2"></a>

## 2. [ESSENCIAL] Paginação + pesquisa (server-side)

### 2.1 O problema real (porquê “server-side”?)

Quando tens muitos dados, não faz sentido trazer tudo para o frontend.

Em vez disso:

- o frontend pede **uma página** de resultados
- o backend devolve **só essa fatia** + informação para paginar

Exemplo de pedido:

```
GET /api/tarefas?page=2&limit=5&q=treino
```

### 2.2 Contrato típico de resposta (o que o backend deve devolver)

Um contrato muito comum é:

```json
{
    "items": [{ "id": 1, "titulo": "..." }],
    "page": 2,
    "limit": 5,
    "total": 42
}
```

Com isto, o frontend consegue calcular:

- `totalPages = Math.ceil(total / limit)`

> Nota: O `total` é o total **depois** de aplicar pesquisa/filtros.

### 2.3 Exemplo de backend (simples, em memória)

Isto é só para perceber a lógica. Num projeto real vais ter base de dados, mas o algoritmo é igual.

```js
import express from "express";

const app = express();

// Exemplo: lista em memória
const tarefas = Array.from({ length: 53 }, (_, i) => ({
    id: i + 1,
    titulo: `Tarefa ${i + 1}`,
}));

app.get("/api/tarefas", (req, res) => {
    const page = Math.max(1, Number.parseInt(req.query.page ?? "1", 10) || 1);
    const limit = Math.max(
        1,
        Number.parseInt(req.query.limit ?? "10", 10) || 10,
    );
    const q = String(req.query.q ?? "")
        .trim()
        .toLowerCase();

    // 1) filtrar (pesquisa)
    const filtradas = q
        ? tarefas.filter((t) => t.titulo.toLowerCase().includes(q))
        : tarefas;

    // 2) paginar
    const total = filtradas.length;
    const start = (page - 1) * limit;
    const items = filtradas.slice(start, start + limit);

    res.json({ items, page, limit, total });
});

app.listen(3000);
```

### 2.4 Frontend: página com query params + fetch + paginação

Vamos juntar tudo:

- `page`, `limit`, `q` vêm da URL
- o `useEffect` faz pedido sempre que **page/limit/q** mudarem
- o UI mostra loading/erro/sucesso e botões de navegação

```jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Página de lista com:
 * - paginação server-side
 * - pesquisa server-side
 * - query params na URL
 */
function ListaTarefas() {
    const [sp, setSp] = useSearchParams();

    // 1) ler params (tudo é texto na URL)
    const page = Math.max(1, Number.parseInt(sp.get("page") ?? "1", 10) || 1);
    const limit = Math.max(1, Number.parseInt(sp.get("limit") ?? "5", 10) || 5);
    const q = (sp.get("q") ?? "").trim();

    // 2) estados do ecrã
    const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
    const [erro, setErro] = useState("");
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(total / limit)),
        [total, limit],
    );

    // 3) efeito: pedir dados quando page/limit/q mudam
    useEffect(() => {
        const controller = new AbortController();

        async function carregar() {
            setStatus("loading");
            setErro("");

            try {
                const url = new URL("http://localhost:3000/api/tarefas");
                url.searchParams.set("page", String(page));
                url.searchParams.set("limit", String(limit));
                if (q) url.searchParams.set("q", q);

                const res = await fetch(url, { signal: controller.signal });

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: pedido falhou`);
                }

                const data = await res.json();
                setItems(data.items ?? []);
                setTotal(data.total ?? 0);
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

        // cancela pedido se mudares de página/pesquisa rapidamente
        return () => controller.abort();
    }, [page, limit, q]);

    // helpers para atualizar query params sem apagar os outros
    function setQuery(next) {
        const merged = new URLSearchParams(sp);

        for (const [key, value] of Object.entries(next)) {
            if (value === "" || value === null || value === undefined) {
                merged.delete(key);
            } else {
                merged.set(key, String(value));
            }
        }

        setSp(merged);
    }

    function irParaPagina(n) {
        const next = Math.min(Math.max(1, n), totalPages);
        setQuery({ page: next });
    }

    function mudarPesquisa(e) {
        // ao mudar pesquisa, normalmente voltamos à página 1
        setQuery({ q: e.target.value, page: 1 });
    }

    return (
        <div>
            <h1>Tarefas</h1>

            <label htmlFor="q">Pesquisa</label>
            <input id="q" value={q} onChange={mudarPesquisa} />

            {status === "loading" && <p>A carregar...</p>}
            {status === "error" && <p>{erro}</p>}

            {status === "success" && (
                <>
                    {items.length === 0 ? (
                        <p>Sem resultados.</p>
                    ) : (
                        <ul>
                            {items.map((t) => (
                                <li key={t.id}>{t.titulo}</li>
                            ))}
                        </ul>
                    )}

                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button
                            onClick={() => irParaPagina(page - 1)}
                            disabled={page <= 1}
                        >
                            Anterior
                        </button>

                        <span>
                            Página {page} / {totalPages}
                        </span>

                        <button
                            onClick={() => irParaPagina(page + 1)}
                            disabled={page >= totalPages}
                        >
                            Seguinte
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ListaTarefas;
```

### 2.5 Erros comuns (e como evitar)

- **Não voltar à página 1 quando mudas pesquisa/filtro**  
  Resultado: o utilizador pode ficar em “Página 7”, mas com pesquisa nova só existem 2 páginas.
  Solução: quando `q` mudar, faz `page: 1`.

- **Race condition (resposta antiga chega depois)**  
  Solução: usa `AbortController` no `useEffect` (como no exemplo).

- **Query params apagarem outros params sem querer**  
  Solução: fazer merge com `URLSearchParams(sp)` em vez de usar `setSearchParams({ ... })` do zero.

---

<a id="sec-3"></a>

## 3. [ESSENCIAL] Upload com `FormData` (multipart)

### 3.1 O problema: porque é que não envio um ficheiro em JSON?

Porque um ficheiro não é “texto normal”.
Para upload, o formato clássico é **`multipart/form-data`**.

No browser, fazes isso com `FormData`.

**Regra importante:**  
Quando usas `FormData`, **não defines manualmente** o header `Content-Type`.
O browser trata disso (inclui o “boundary” automaticamente).

### 3.2 Modelo mental do upload

1. O utilizador escolhe um ficheiro (`<input type="file" />`)
2. O frontend cria um `FormData`
3. Envia para o backend (`POST /upload`)
4. O backend guarda/valida e devolve um JSON com o resultado

### 3.3 Backend (Express + Multer) — exemplo seguro (mínimo)

> Nota: este exemplo mostra validação de tipo e tamanho (o mínimo aceitável).

```js
import express from "express";
import multer from "multer";

const app = express();

// guarda em memória (bom para demonstrar e validar; em produção guardas em disco/cloud)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const permitido = ["image/png", "image/jpeg"];
        if (!permitido.includes(file.mimetype)) {
            cb(new Error("Tipo de ficheiro não permitido"));
            return;
        }
        cb(null, true);
    },
});

app.post("/api/upload", upload.single("avatar"), (req, res) => {
    if (!req.file) {
        res.status(400).json({
            error: { message: "Ficheiro em falta (campo avatar)." },
        });
        return;
    }

    // Aqui, em produção:
    // - guardas em disco ou cloud
    // - crias um nome único
    // - devolves URL/metadata

    res.json({
        ok: true,
        file: {
            originalName: req.file.originalname,
            mime: req.file.mimetype,
            size: req.file.size,
        },
    });
});

app.use((err, req, res, next) => {
    res.status(400).json({ error: { message: err.message } });
});

app.listen(3000);
```

### 3.4 Frontend: escolher ficheiro + enviar

```jsx
import { useState } from "react";

/**
 * Form de upload (ESSENCIAL):
 * - guarda o File em estado
 * - envia com FormData
 * - trata loading/erro/sucesso
 */
function UploadAvatar() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
    const [msg, setMsg] = useState("");

    function escolher(e) {
        const escolhido = e.target.files?.[0] ?? null;
        setFile(escolhido);
        setMsg("");
        setStatus("idle");
    }

    async function enviar(e) {
        e.preventDefault();

        if (!file) {
            setStatus("error");
            setMsg("Escolhe um ficheiro primeiro.");
            return;
        }

        setStatus("loading");
        setMsg("");

        try {
            const form = new FormData();
            form.append("avatar", file);

            const res = await fetch("http://localhost:3000/api/upload", {
                method: "POST",
                body: form,
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                const m = data?.error?.message ?? `HTTP ${res.status}`;
                throw new Error(m);
            }

            setStatus("success");
            setMsg("Upload feito com sucesso.");
        } catch (e2) {
            const m = e2 instanceof Error ? e2.message : "Falha no upload";
            setStatus("error");
            setMsg(m);
        }
    }

    return (
        <form onSubmit={enviar}>
            <label htmlFor="avatar">Avatar (PNG/JPG até 2MB)</label>
            <input
                id="avatar"
                type="file"
                accept="image/png,image/jpeg"
                onChange={escolher}
            />

            <button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "A enviar..." : "Enviar"}
            </button>

            {status === "error" && <p>{msg}</p>}
            {status === "success" && <p>{msg}</p>}
        </form>
    );
}

export default UploadAvatar;
```

### 3.5 Armadilhas típicas no upload

- **Tentar controlar o `<input type="file" />` com `value`**  
  O browser não deixa (por segurança). Aqui o input é “especial”: lês o ficheiro, mas não controlas o `value`.

- **Definir `Content-Type` manualmente**  
  Vais estragar o `multipart`. Deixa o browser tratar disso.

- **Não validar tipo e tamanho**  
  É um risco de segurança e pode rebentar o servidor.

---

<a id="sec-4"></a>

## 4. [ESSENCIAL] Estados de ecrã: loading, erro, vazio e sucesso

Quando trabalhas com dados externos (ou uploads), tens sempre estados diferentes.

Se não modelares estes estados, a UI fica confusa.

### 4.1 Modelo mental: “estado do ecrã” (UI state)

Um padrão simples e consistente é ter um `status` com valores fixos:

- `"loading"` → estamos à espera
- `"success"` → temos resposta válida
- `"error"` → falhou (e temos mensagem)
- (opcional) `"idle"` → ainda não fizemos nada

Isto evita combinações incoerentes.

### 4.2 Lista vazia não é “erro”

Se uma pesquisa não encontra nada, isso normalmente é **sucesso** (status 200), mas com `items = []`.

A UI deve mostrar algo do género:

- “Sem resultados.”

### 4.3 Botão “repetir” / “tentar novamente”

Sempre que há pedidos a servidor, é bom ter um botão de retry.

O padrão mais simples:

- guardas um `reloadKey` e incrementas para forçar o effect a repetir.

```jsx
const [reloadKey, setReloadKey] = useState(0);

useEffect(() => {
    // fetch aqui...
}, [page, limit, q, reloadKey]);

function tentarNovamente() {
    setReloadKey((k) => k + 1);
}
```

---

<a id="sec-5"></a>

## 5. [EXTRA] Debounce na pesquisa

### 5.1 O problema

Se atualizares `q` na URL a cada tecla, podes fazer:

- demasiados pedidos
- UI a saltar
- servidor a levar carga desnecessária

A solução típica é **debounce**:

- esperas “um bocadinho” depois da última tecla antes de disparar o pedido.

### 5.2 Modelo mental

- utilizador escreve: `a` `an` `ana`
- tu só queres pedir quando ele parar um momento (ex.: 300ms)

### 5.3 Exemplo: `qInput` (imediato) → `q` (na URL, com delay)

```jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Demonstra debounce para pesquisa:
 * - qInput muda a cada tecla (estado local)
 * - q na URL só atualiza após 300ms sem escrever
 */
function PesquisaComDebounce() {
    const [sp, setSp] = useSearchParams();
    const q = (sp.get("q") ?? "").trim();

    const [qInput, setQInput] = useState(q);

    // mantém o input sincronizado se alguém mudar a URL (back/forward, por exemplo)
    useEffect(() => {
        setQInput(q);
    }, [q]);

    useEffect(() => {
        const id = setTimeout(() => {
            const merged = new URLSearchParams(sp);
            if (qInput.trim() === "") merged.delete("q");
            else merged.set("q", qInput.trim());
            merged.set("page", "1"); // pesquisa nova -> volta à página 1
            setSp(merged);
        }, 300);

        return () => clearTimeout(id);
    }, [qInput, sp, setSp]);

    return (
        <div>
            <label htmlFor="q">Pesquisa</label>
            <input
                id="q"
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
            />
        </div>
    );
}

export default PesquisaComDebounce;
```

> Nota: debounce é EXTRA porque usa `setTimeout` + cleanup, mas é muito usado em pesquisa.

---

<a id="sec-6"></a>

## 6. [EXTRA] Timeouts, retries e cancelamento (AbortController)

### 6.1 Timeout: quando o servidor “não responde”

O `fetch` não tem timeout automático.
Se precisares, fazes um abort ao fim de X ms.

```js
/**
 * Faz fetch com timeout usando AbortController.
 * @param {string} url
 * @param {RequestInit} [options]
 * @param {number} timeoutMs
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        return res;
    } finally {
        clearTimeout(id);
    }
}
```

### 6.2 Retry (tentar novamente) — versão simples

Nem todos os erros devem ter retry, mas para:

- falhas de rede
- timeouts
- erros temporários

pode fazer sentido tentar 2–3 vezes.

```js
/**
 * Retry simples com espera.
 * @param {() => Promise<Response>} fn
 * @param {number} tentativas
 */
async function retry(fn, tentativas = 3) {
    let lastError;

    for (let i = 0; i < tentativas; i += 1) {
        try {
            return await fn();
        } catch (e) {
            lastError = e;
            await new Promise((r) => setTimeout(r, 300)); // espera curta
        }
    }

    throw lastError;
}
```

### 6.3 Cancelamento (porquê é tão importante?)

Em pesquisa/paginação, podes disparar vários pedidos seguidos.

Se não cancelares o anterior:

- a resposta antiga pode chegar depois e sobrescrever dados atuais
- o utilizador vê “voltar atrás” sem perceber

Por isso, quando o pedido depende de `q/page/...`, `AbortController` é o padrão recomendado (já o usaste na secção 2).

---

<a id="sec-7"></a>

## 7. [EXTRA] Cliente API com Axios

### 7.1 Em que ficheiro faz sentido falar de Axios?

Aqui mesmo.  
Este ficheiro já está a juntar tudo o que é “falar com o servidor” (paginação, filtros, upload, erros, retries).  
Então é o sítio certo para apresentar o Axios como alternativa ao `fetch`.

### 7.2 Porque é que se usa Axios?

O `fetch` chega perfeitamente, mas o Axios costuma ser escolhido dizer que:

- já faz parse de JSON automaticamente (na maioria dos casos)
- facilita `baseURL`
- facilita interceptors (por exemplo, para anexar token, tratar 401, etc.)
- suporta progresso de upload/download de forma mais direta

> Nota: mesmo com Axios, os conceitos continuam iguais:
> status HTTP, estados de ecrã, race conditions, cancelamento, etc.

### 7.3 Criar uma instância (`src/services/api.js`)

```js
import axios from "axios";

/**
 * Cliente Axios:
 * - baseURL: evita repetir host em todos os pedidos
 * - withCredentials: útil se usares cookies (ver ficheiro de autenticação)
 */
export const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
    timeout: 8000,
});
```

### 7.4 GET com paginação

```js
/**
 * Obtém tarefas com paginação e pesquisa.
 * @param {{ page: number, limit: number, q?: string }} params
 */
export async function getTarefas(params) {
    const res = await api.get("/api/tarefas", { params });
    return res.data; // já é JSON
}
```

### 7.5 Upload com progresso (EXTRA dentro do EXTRA)

```js
/**
 * Upload com progresso.
 * @param {File} file
 * @param {(percent: number) => void} onProgress
 */
export async function uploadAvatar(file, onProgress) {
    const form = new FormData();
    form.append("avatar", file);

    const res = await api.post("/api/upload", form, {
        onUploadProgress: (evt) => {
            if (!evt.total) return;
            const percent = Math.round((evt.loaded / evt.total) * 100);
            onProgress(percent);
        },
    });

    return res.data;
}
```

---

<a id="exercicios"></a>

## Exercícios - upload, paginação e cliente de API

1. **Query string básica:** cria uma página `/tarefas` e mostra no ecrã o valor de `page` e `q` lidos de `useSearchParams`.
2. **Defaults:** abre `/tarefas?page=abc&limit=-5` e garante que o teu código não crasha e converte para valores válidos.
3. **Paginação server-side (frontend):** cria botões Anterior/Seguinte e atualiza a URL (`page`) ao clicar.
4. **Pesquisa server-side:** adiciona um input `q` e garante que ao escrever o `page` volta a 1.
5. **Lista vazia:** quando `items.length === 0`, mostra “Sem resultados.” (não é erro).
6. **Abort:** usa `AbortController` no `useEffect` e testa escrever rápido na pesquisa.
7. **Upload:** cria `UploadAvatar` e faz POST com `FormData`. No backend, valida tipo e tamanho (mínimo).
8. **Cliente de API (fetch):** cria uma função `apiGet(url, params)` que constrói `URLSearchParams` e devolve JSON validando `res.ok`.
9. **Axios (EXTRA):** cria `src/services/api.js` com `axios.create` e refaz o exercício 3 usando Axios.
10. **Debounce (EXTRA):** faz com que `q` só atualize na URL depois de 300ms sem escrever.

---

<a id="changelog"></a>

## Changelog

- 2026-01-27: reescrita e expansão completa do ficheiro (nível didático alinhado com o ficheiro 08), com:
    - query string como estado da app,
    - paginação/pesquisa server-side com contrato,
    - padrões de UI state,
    - upload com FormData e validações básicas,
    - debounce, abort, timeout/retry,
    - introdução do Axios no contexto certo.
