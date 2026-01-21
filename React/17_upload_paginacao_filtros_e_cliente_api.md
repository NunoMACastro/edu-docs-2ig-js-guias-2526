# React.js (11.º Ano) - 17 · Upload, paginação, filtros e cliente de API

> **Objetivo deste ficheiro**
> Implementar paginação e filtros no backend e no frontend.
> Fazer upload de ficheiros com `multipart/form-data`.
> Melhorar estados de UI e conhecer o upgrade para axios.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Paginação + filtros (backend)](#sec-1)
-   [2. [ESSENCIAL] Paginação + filtros (frontend)](#sec-2)
-   [3. [ESSENCIAL] Upload com multipart/form-data](#sec-3)
-   [4. [ESSENCIAL] Estados de UI: loading, erro e retry](#sec-4)
-   [5. [EXTRA] Debounce em pesquisa](#sec-5)
-   [6. [EXTRA] Timeouts e retries simples](#sec-6)
-   [7. [EXTRA] Axios como alternativa ao fetch](#sec-7)
-   [Exercícios - Upload e paginação](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** faz paginação e upload antes do axios.
-   **Como estudar:** usa o contrato do ficheiro 15 e o backend do ficheiro 11.
-   **Ligações:** para autenticação, vê `16_autenticacao_em_spa_jwt_sessions_cookies.md`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Paginação + filtros (backend)

### Modelo mental

A API deve devolver um pedaço da lista, não tudo. Isso melhora desempenho e experiência.

### Contrato recomendado

```json
{ "items": [], "page": 1, "limit": 10, "total": 42 }
```

### Exemplo (Express)

```js
// backend/index.js
const tarefas = [
    { id: 1, texto: "Estudar React" },
    { id: 2, texto: "Rever Node" },
    { id: 3, texto: "Treinar fetch" },
];

app.get("/api/tarefas", (req, res) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const q = String(req.query.q || "").toLowerCase();

    const filtradas = tarefas.filter((t) =>
        t.texto.toLowerCase().includes(q)
    );

    const total = filtradas.length;
    const start = (page - 1) * limit;
    const items = filtradas.slice(start, start + limit);

    res.status(200).json({ items, page, limit, total });
});
```

### Erros comuns

-   Ignorar `page` e devolver tudo.
-   Esquecer que `page` e `limit` vêm como texto.

### Boas práticas

-   Valida `page` e `limit`.
-   Mantém o formato de resposta sempre igual.

### Checkpoint

-   O que significa `total` no contrato?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Paginação + filtros (frontend)

### Modelo mental

O frontend lê `page` e `q` da URL, chama a API e mostra botões de paginação.

### Exemplo (React)

```jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function ListaTarefas() {
    const [params, setParams] = useSearchParams();
    const page = Number(params.get("page") || 1);
    const q = params.get("q") || "";

    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregar() {
            setLoading(true);
            setErro("");

            try {
                const res = await fetch(
                    `/api/tarefas?page=${page}&limit=5&q=${encodeURIComponent(q)}`
                );
                const contentType = res.headers.get("content-type") || "";
                const data = contentType.includes("application/json")
                    ? await res.json()
                    : null;

                if (!res.ok) {
                    const msg =
                        data?.error?.message ||
                        `Erro ${res.status}: pedido falhou`;
                    throw new Error(msg);
                }

                setItems(data?.items || []);
                setTotal(data?.total || 0);
            } catch (e) {
                setErro(e.message || "Falha ao carregar tarefas");
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, [page, q]);

    const totalPages = Math.ceil(total / 5);

    return (
        <div>
            <input
                placeholder="Pesquisar"
                value={q}
                onChange={(e) => setParams({ page: 1, q: e.target.value })}
            />

            {loading ? (
                <p>A carregar...</p>
            ) : erro ? (
                <p>{erro}</p>
            ) : (
                <ul>
                    {items.map((t) => (
                        <li key={t.id}>{t.texto}</li>
                    ))}
                </ul>
            )}

            <button
                disabled={page <= 1}
                onClick={() => setParams({ page: page - 1, q })}
            >
                Anterior
            </button>
            <span>{page} / {totalPages}</span>
            <button
                disabled={page >= totalPages}
                onClick={() => setParams({ page: page + 1, q })}
            >
                Seguinte
            </button>
        </div>
    );
}
```

### Erros comuns

-   Não atualizar a URL ao mudar de página.
-   Ignorar `total` e não saber quando parar.

### Boas práticas

-   Mostra o número total de páginas.
-   Mantém `page` e `q` na query string.

### Checkpoint

-   Porque é que a URL deve guardar `page` e `q`?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Upload com multipart/form-data

### Modelo mental

Upload é diferente de JSON: usas `FormData` e o backend precisa de middleware para ler o ficheiro.

### Backend (Express + multer)

```bash
npm install multer
```

```js
// backend/index.js
import multer from "multer";
const upload = multer({ dest: "uploads/" });

app.post("/api/upload", upload.single("ficheiro"), (req, res) => {
    if (!req.file) {
        return res
            .status(422)
            .json({ error: { code: "NO_FILE", message: "Ficheiro obrigatório", details: [] } });
    }

    res.status(201).json({ nome: req.file.originalname, path: req.file.path });
});
```

### Frontend (React)

```jsx
import { useState } from "react";

function UploadForm() {
    const [ficheiro, setFicheiro] = useState(null);
    const [erro, setErro] = useState("");

    async function enviar(e) {
        e.preventDefault();
        setErro("");

        if (!ficheiro) {
            setErro("Escolhe um ficheiro antes de enviar");
            return;
        }

        const form = new FormData();
        form.append("ficheiro", ficheiro);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: form,
        });

        if (!res.ok) {
            const contentType = res.headers.get("content-type") || "";
            const data = contentType.includes("application/json")
                ? await res.json()
                : null;
            setErro(data?.error?.message || "Falha no upload");
        }
    }

    return (
        <form onSubmit={enviar}>
            <input type="file" onChange={(e) => setFicheiro(e.target.files[0])} />
            <button type="submit">Enviar</button>
            {erro && <p>{erro}</p>}
        </form>
    );
}
```

### Erros comuns

-   Enviar ficheiro como JSON.
-   Esquecer `upload.single(...)` no backend.

### Boas práticas

-   Valida o tipo e tamanho do ficheiro.
-   Mostra feedback de sucesso/erro.

### Checkpoint

-   Porque é que `FormData` é necessário no upload?

<a id="sec-4"></a>

## 4. [ESSENCIAL] Estados de UI: loading, erro e retry

### Modelo mental

Quando algo falha, o utilizador precisa de um botão para tentar de novo.

### Exemplo simples

```jsx
function ErroComRetry({ onRetry }) {
    return (
        <div>
            <p>Algo correu mal.</p>
            <button onClick={onRetry}>Tentar novamente</button>
        </div>
    );
}
```

### Checkpoint

-   Quando é que faz sentido mostrar um botão de retry?

<a id="sec-5"></a>

## 5. [EXTRA] Debounce em pesquisa

### Modelo mental

Em vez de pedir a cada tecla, esperas um pouco antes de fazer o pedido.

```jsx
useEffect(() => {
    const id = setTimeout(() => {
        setParams({ page: 1, q });
    }, 300);

    return () => clearTimeout(id);
}, [q]);
```

### Checkpoint

-   O que evita o debounce?

<a id="sec-6"></a>

## 6. [EXTRA] Timeouts e retries simples

### Modelo mental

Se um pedido demora demais, podes abortar ou repetir uma vez.

```js
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);
```

### Checkpoint

-   Para que serve o `AbortController`?

<a id="sec-7"></a>

## 7. [EXTRA] Axios como alternativa ao fetch

### Modelo mental

Axios é um upgrade: permite baseURL, timeouts e interceptors. Usa quando o projeto cresce.

### Exemplo rápido

```bash
npm install axios
```

```js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 5000,
});

api.interceptors.response.use(
    (res) => res,
    (error) => {
        const message =
            error.response?.data?.error?.message || "Erro de rede";
        return Promise.reject(new Error(message));
    }
);
```

### Checkpoint

-   Que vantagem dão os interceptors?

<a id="exercicios"></a>

## Exercícios - Upload e paginação

1. Cria `GET /api/tarefas` com `{ items, page, limit, total }`.
2. Implementa paginação no frontend com `page` na URL.
3. Adiciona pesquisa com `q` e confirma que a lista filtra.
4. Implementa `POST /api/upload` com `multer`.
5. Cria um formulário com `FormData` e mostra erro se o upload falhar.

<a id="changelog"></a>

## Changelog

-   2026-01-12: criação do ficheiro com paginação, upload e cliente de API.
-   2026-01-12: snippets ajustados para ESM.
