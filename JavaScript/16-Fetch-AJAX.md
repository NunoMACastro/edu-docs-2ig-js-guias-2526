# [16] Fetch / AJAX — Requisições HTTP no Browser (11.º ano)

> **Objetivo**: aprender a **pedir e enviar dados** entre a tua página e um **servidor** usando `fetch`. Vamos explicar o essencial de **HTTP**, o que é uma **API** em linguagem simples, trabalhar com **JSON**, tratar **erros**, usar **timeout/cancelamento** com `AbortController`, fazer **GET/POST**, construir **query strings**, e enviar **ficheiros** com `FormData`. No fim tens mini‑projetos e exercícios.

---

## 0) O que é HTTP? O que é uma API? (versão simples)

-   **HTTP** é o “idioma” que o navegador usa para **pedir** e **receber** informação de um **servidor** (outra máquina).  
    Exemplo: “Dá‑me a lista de alunos” → o servidor responde com texto, normalmente **JSON**.
-   **API** é um **conjunto de regras/endereços** (URLs) que dizem: “se fizeres um pedido **assim**, eu devolvo **isto**”.  
    Pensa numa **máquina de bilhetes**: tem **botões** (endpoints) e regras claras de uso.
-   **JSON** é **texto estruturado** (chave/valor) muito usado para trocar dados:
    ```json
    { "nome": "Ana", "nota": 18 }
    ```

> A tua página (cliente) fala com um **servidor** através de **endpoints** (URLs). Ex.: `/api/alunos`, `/api/login`, `/api/fotos`.

---

## 1) `fetch` — o pedido mais simples

`fetch(url)` **pede** ao browser que vá buscar a URL. Ele **não bloqueia** o JS; quando a resposta chega, tu continuas.

```js
// GET simples (ler dados)
async function exemploGET() {
    const r = await fetch("/api/alunos");
    // fetch só lança erro para falhas de rede; para 404/500 precisas de verificar:
    if (!r.ok) throw new Error("HTTP " + r.status);
    const dados = await r.json(); // interpreta como JSON
    console.table(dados);
}
```

**Métodos mais comuns**

-   **GET** — ler dados
-   **POST** — criar/enviar dados
-   **PUT/PATCH** — atualizar
-   **DELETE** — remover

---

## 2) Utilitários práticos (recomendado)

Criar pequenas funções ajuda a **repetir menos** e a ter **tratamento de erros** consistente.

```js
export async function getJSON(url, { signal } = {}) {
    const r = await fetch(url, { signal }); // sinal permite cancelar
    if (!r.ok) throw new Error(`HTTP ${r.status} em ${url}`);
    return r.json();
}

export async function sendJSON(url, method, body, { signal } = {}) {
    const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal,
    });
    if (!r.ok) throw new Error(`HTTP ${r.status} em ${url}`);
    return r.json();
}

// Açúcar:
export const postJSON = (url, data, opts) => sendJSON(url, "POST", data, opts);
export const putJSON = (url, data, opts) => sendJSON(url, "PUT", data, opts);
export const delJSON = (url, data, opts) => sendJSON(url, "DELETE", data, opts);
```

Uso típico:

```js
try {
    const alunos = await getJSON("/api/alunos");
    console.table(alunos);
} catch (e) {
    console.warn("Falhou:", e.message);
}
```

---

## 3) Construir URLs com parâmetros (query string)

Evita concatenar strings “à mão”. Usa `URL` e `searchParams`.

```js
function urlComParams(base, params) {
    const u = new URL(base, location.origin);
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
    return u.toString();
}

const url = urlComParams("/api/alunos", { page: 2, q: "ana" });
// Ex.: "/api/alunos?page=2&q=ana"
const data = await getJSON(url);
```

---

## 4) Tratar erros (rede vs HTTP)

-   **Erros de rede**: sem internet, servidor em baixo, CORS bloqueado → `fetch` lança um **TypeError**.
-   **Erros HTTP**: 404, 500, 401… `fetch` **não lança** por si; tens de verificar `response.ok` e **lançar tu**.

```js
async function carregar() {
    try {
        const dados = await getJSON("/api/alunos");
        // renderizar na UI...
    } catch (e) {
        // Aqui apanhas tanto HTTP “!ok” como falhas de rede
        console.error("Não consegui carregar:", e.message);
        // Mostrar uma mensagem amigável ao utilizador
    }
}
```

**Códigos úteis**

-   `2xx` sucesso (200 OK, 201 Created)
-   `4xx` erro do cliente (400 Bad Request, 401 Unauthorized, 404 Not Found)
-   `5xx` erro no servidor (500, 503)

---

## 5) Timeout e cancelamento com `AbortController`

O `fetch` não tem timeout nativo, mas podes **cancelar** se demorar demais.

```js
export async function getComTimeout(url, ms = 5000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
        return await getJSON(url, { signal: ctrl.signal });
    } finally {
        clearTimeout(t);
    }
}
```

Uso:

```js
try {
    const lista = await getComTimeout("/api/alunos", 3000);
} catch (e) {
    if (e.name === "AbortError") {
        console.warn("Pedido cancelado por timeout");
    } else {
        console.warn("Falhou:", e.message);
    }
}
```

---

## 6) Repetir com “espera” (retry simples, opcional)

Para erros **temporários** (ex.: 503, 429), pode compensar **tentar outra vez** com **esperas crescentes**.

```js
export async function getComRetry(url, tentativas = 3) {
    let atraso = 300; // ms
    for (let i = 0; i < tentativas; i++) {
        try {
            return await getJSON(url);
        } catch (e) {
            if (i === tentativas - 1) throw e; // última tentativa falhou
            await new Promise((r) => setTimeout(r, atraso));
            atraso *= 2; // backoff exponencial
        }
    }
}
```

---

## 7) Enviar dados: JSON vs `FormData`

-   **JSON**: quando queres enviar **dados “normais”** (strings, números, objetos).
-   **`FormData`**: quando queres enviar **ficheiros** ou um formulário “como o browser faz por defeito” (multipart/form-data).

**POST JSON**

```js
const novoAluno = { nome: "Ana", nota: 18 };
const res = await postJSON("/api/alunos", novoAluno); // devolve JSON de resposta
```

**Upload com `FormData`**

```js
async function uploadFoto(url, ficheiro) {
    const fd = new FormData();
    fd.append("foto", ficheiro, ficheiro.name);
    const r = await fetch(url, { method: "POST", body: fd });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
}

// <input type="file" id="foto">
const file = document.querySelector("#foto").files[0];
await uploadFoto("/api/upload", file);
```

> Nota: `fetch` não dá **progresso** de upload/download diretamente. Para barras de progresso, terás de explorar **XMLHttpRequest** ou streams (avançado).

---

## 8) Autenticação (nota curta, nível básico)

-   Alguns endpoints exigem **login**. Normalmente o servidor devolve um **token** (por exemplo, JWT) após `POST /login`.
-   Depois, envias o token em cada pedido, num header `Authorization: Bearer <token>`:

```js
async function getPrivado(url, token) {
    const r = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
}
```

-   **Cuidados**: não publiques tokens; evita guardar tokens sensíveis em `localStorage` em apps reais; para projetos escolares serve para perceber o fluxo.

---

## 9) CORS (explicação simples)

-   Por segurança, o browser só deixa uma página pedir dados ao **mesmo domínio/porta/protocolo**.
-   Se queres pedir a outro domínio (ex.: `http://localhost:3000` → `http://api.local:4000`), o servidor tem de **autorizar** com headers CORS (ex.: `Access-Control-Allow-Origin`).
-   Isto configura‑se **no servidor**. Em ambiente escolar, usa‑se muitas vezes um **proxy** de desenvolvimento.

---

## 10) Mini‑projetos guiados

1. **Lista de alunos (GET + erro)**

    - Botão “Carregar”. Faz `getJSON("/api/alunos")`, mostra com `console.table` (ou `<ul>`). Em erro, mostra mensagem “Tenta mais tarde”.

2. **Criar aluno (POST JSON)**

    - Formulário com `nome` e `nota`. No `submit`, `preventDefault`, lê com `FormData`, envia com `postJSON`. Depois faz refresh da lista.

3. **Pesquisa com query string**

    - Input “Pesquisar por nome…”. Ao clicar “Pesquisar”, constrói URL com `page` e `q` e chama `getJSON`.

4. **Timeout + retry**

    - Usa `getComTimeout` com 3 segundos. Se falhar, tenta `getComRetry` com 3 tentativas.

5. **Upload de imagem (FormData)**
    - Input `type="file"`. Envia com `fetch` e mostra o nome do ficheiro devolvido pelo servidor.

---

## 11) Mini desafios

1. **Botão Carregar** — cria um botão que, ao clicar, usa `fetch("alunos.json")`, chama `response.json()` e mostra os nomes numa `<ul>`.
2. **Mensagem de erro** — altera o desafio anterior para mostrar “Tenta mais tarde” num `<p>` se o `fetch` falhar (simula trocando o URL por um inexistente).
3. **Pesquisa simples** — cria um formulário com `<input name="q">`. No `submit`, usa `urlComParams` para montar `/api/alunos?q=valor` (pode ser apenas `console.log` da URL) e limpa o formulário.
4. **Loader** — antes de fazer `fetch`, mostra “A carregar…”; quando termina, troca para “Concluído” ou “Erro”. Usa `try/catch` com `await`.
5. **POST fictício** — cria um formulário com `nome` e `nota`, lê com `FormData` e envia para `https://jsonplaceholder.typicode.com/posts` com `fetch` (método `POST`). Mostra o `id` devolvido.
6. **Abortar pedido** — usa `AbortController` para cancelar um `fetch` após 2 segundos (`setTimeout`). Mostra no `console` se foi cancelado ou concluído.

---

## 12) Resumo

-   Usa `fetch` para comunicar com **APIs**: **GET** para ler, **POST/PUT/PATCH** para enviar/atualizar, **DELETE** para remover.
-   Lê JSON com `await r.json()` e **verifica `r.ok`** para lançar erro em HTTP 4xx/5xx.
-   Para **timeout/cancelamento**, usa `AbortController`.
-   Envia **JSON** com `Content-Type: application/json`; para **ficheiros**, usa `FormData`.
-   **CORS** precisa de configuração **no servidor** (ou proxy de desenvolvimento).
-   Cria **utilitários** (`getJSON`, `postJSON`, `urlComParams`) para escreveres menos e com menos erros.

## Changelog

-   **v1.2.0 — 2025-11-10**
    -   Mini desafios simplificados para cenários de browser com `fetch` a ficheiros locais ou APIs públicas.
-   **v1.1.0 — 2025-11-10**
    -   Exercícios renomeados para Mini desafios e revistos para cobrir o ciclo completo de pedidos.
    -   Changelog adicionado para acompanhar futuras melhorias do capítulo.
