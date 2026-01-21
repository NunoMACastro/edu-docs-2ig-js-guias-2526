# React.js (11.º Ano) - 15 · HTTP, REST, CORS e contratos de API

> **Objetivo deste ficheiro**
> Consolidar o básico de HTTP e REST para o trabalho fullstack.
> Saber ler status codes, headers e body JSON.
> Entender CORS e contratos de API com exemplos práticos.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] REST na prática: métodos e quando usar](#sec-1)
-   [2. [ESSENCIAL] Status codes que vais usar na escola](#sec-2)
-   [3. [ESSENCIAL] Headers e body JSON](#sec-3)
-   [4. [ESSENCIAL] Query params para filtros/paginação](#sec-4)
-   [5. [ESSENCIAL] CORS: o que é e como resolver](#sec-5)
-   [6. [EXTRA] Preflight OPTIONS em linguagem simples](#sec-6)
-   [7. [EXTRA] Idempotência: PUT vs PATCH](#sec-7)
-   [Exercícios - HTTP e contratos](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** domina as bases (métodos, status e CORS) antes do [EXTRA].
-   **Como estudar:** compara este ficheiro com o backend do ficheiro 11.
-   **Ligações:** vais usar isto em `11_consumo_api_e_backend_node.md`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] REST na prática: métodos e quando usar

### Modelo mental

REST organiza rotas por recursos. Um recurso é uma coisa concreta: `alunos`, `tarefas`, `produtos`.

### Métodos (o básico)

-   **GET /api/alunos** → ler lista
-   **GET /api/alunos/1** → ler um item
-   **POST /api/alunos** → criar
-   **PUT /api/alunos/1** → substituir tudo
-   **PATCH /api/alunos/1** → alterar só parte
-   **DELETE /api/alunos/1** → apagar

### Erros comuns

-   Usar GET para criar dados.
-   Usar POST para editar quando existe PUT/PATCH.

### Boas práticas

-   Mantém nomes no plural (`/api/alunos`).
-   Usa o método certo para cada ação.

### Checkpoint

-   Qual é a diferença entre POST e PATCH?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Status codes que vais usar na escola

### Modelo mental

O status code diz se o pedido foi bem ou mal sucedido. Ajuda o frontend a decidir o que mostrar.

### Lista rápida

-   **200 OK** → tudo certo
-   **201 Created** → algo foi criado
-   **204 No Content** → sucesso sem body
-   **400 Bad Request** → pedido mal formado
-   **401 Unauthorized** → falta autenticação
-   **403 Forbidden** → sem permissão
-   **404 Not Found** → não existe
-   **409 Conflict** → conflito (ex.: duplicado)
-   **422 Unprocessable Entity** → validação falhou
-   **500 Server Error** → erro inesperado

### Erros comuns

-   Devolver 200 em tudo.
-   Confundir 401 com 403.

### Boas práticas

-   Usa 201 em POST de criação.
-   Usa 422 para erros de validação.

### Checkpoint

-   Quando é que usas 201?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Headers e body JSON

### Modelo mental

Headers dizem **como** ler o body. Se envias JSON, tens de dizer isso ao servidor.

### O essencial

-   **Content-Type:** `application/json`
-   **Authorization:** onde vai a credencial (conceito)
-   **Accept:** o que o cliente espera receber

### Formato de erro recomendado

```json
{ "error": { "code": "SOME_CODE", "message": "Mensagem", "details": [] } }
```

### Exemplo (POST com JSON)

```js
fetch("/api/alunos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "Ana", curso: "Web" }),
});
```

### Erros comuns

-   Esquecer o `Content-Type`.
-   Enviar JSON inválido.

### Boas práticas

-   Normaliza erros para o frontend.
-   Valida o body antes de guardar.

### Checkpoint

-   Para que serve o `Content-Type`?

<a id="sec-4"></a>

## 4. [ESSENCIAL] Query params para filtros/paginação

### Modelo mental

Query params são opções na URL para filtrar, ordenar ou paginar.

### Exemplos comuns

-   `/api/tarefas?page=1&limit=10`
-   `/api/alunos?q=ana`
-   `/api/alunos?sort=nome`

### Erros comuns

-   Esquecer que query params são texto.
-   Ignorar `page` e devolver tudo de uma vez.

### Boas práticas

-   Devolve `{ items, page, limit, total }`.
-   Mantém nomes simples: `page`, `limit`, `q`, `sort`.

### Checkpoint

-   Para que serve o `limit`?

<a id="sec-5"></a>

## 5. [ESSENCIAL] CORS: o que é e como resolver

### Modelo mental

O browser bloqueia pedidos entre origens diferentes. O CORS permite abrir a porta para a origem certa.

### Exemplo no Express

```js
import cors from "cors";

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);
```

### Erros comuns

-   Backend sem CORS e o browser a bloquear.
-   Confundir CORS com autenticação.

### Boas práticas

-   Restringe a origem em desenvolvimento.
-   Lembra-te: CORS não é segurança real.

### Checkpoint

-   Porque é que o browser bloqueia pedidos cross‑origin?

<a id="sec-6"></a>

## 6. [EXTRA] Preflight OPTIONS em linguagem simples

### Modelo mental

Quando o pedido é “mais sensível” (ex.: headers personalizados), o browser faz um pedido **OPTIONS** primeiro para perguntar se pode.

### Checkpoint

-   O que é um preflight?

<a id="sec-7"></a>

## 7. [EXTRA] Idempotência: PUT vs PATCH

### Modelo mental

-   **PUT** substitui o recurso todo.
-   **PATCH** altera só parte.

Se repetires o mesmo PUT, o resultado deve ser igual. Isso é **idempotente**.

### Checkpoint

-   Em que caso preferes PATCH?

<a id="exercicios"></a>

## Exercícios - HTTP e contratos

1. Escreve 3 exemplos de endpoints REST para `tarefas`.
2. Diz que status code usas para criação e para erro de validação.
3. Faz um POST com `fetch` e `Content-Type: application/json`.
4. Cria uma resposta de erro no formato recomendado.
5. Explica, numa frase, o que é CORS.

<a id="changelog"></a>

## Changelog

-   2026-01-12: criação do ficheiro com bases de HTTP, REST e CORS.
-   2026-01-12: snippets ajustados para ESM.
