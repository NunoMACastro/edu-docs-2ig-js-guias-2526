# React.js (11.º Ano) - 07 · Comunicação síncrona e assíncrona

> **Objetivo deste ficheiro**
> Perceber a diferença entre comunicação síncrona e assíncrona.
> Entender o que são Promessas e como resolver tarefas que demoram tempo.
> Usar `async/await` de forma segura, com `try/catch`.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Síncrono vs assíncrono](#sec-1)
-   [2. [ESSENCIAL] Promessas (Promise)](#sec-2)
-   [3. [ESSENCIAL] async/await e try/catch](#sec-3)
-   [4. [ESSENCIAL] HTTP em 2 minutos: request/response](#sec-4)
-   [5. [EXTRA] Padrão simples de loading e erro](#sec-5)
-   [Exercícios - Comunicação síncrona e assíncrona](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** aprende primeiro síncrono/assíncrono e Promessas.
-   **Como estudar:** lê, copia os exemplos e observa a ordem dos logs.
-   **Ligações:** vais usar isto em `08_useEffect_e_dados.md` quando fizeres `fetch`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Síncrono vs assíncrono

### Modelo mental

Síncrono significa **uma coisa de cada vez**. O código só passa à linha seguinte quando a anterior acabou. É como uma fila: só avança quando a pessoa da frente termina.

Assíncrono significa **não bloquear**. Enquanto uma tarefa demora (ex.: pedido à internet), o JavaScript continua com outras coisas e só volta à tarefa quando o resultado estiver pronto.

Pensa no dia a dia:

-   **Síncrono:** ficas parado numa fila até chegares ao balcão.
-   **Assíncrono:** deixas o pedido e continuas a fazer outras tarefas; recebes uma chamada quando estiver pronto.

Porque é que existem os dois?

-   Algumas tarefas são rápidas e simples (síncrono).
-   Outras demoram (rede, ficheiros, timers) e não devem bloquear o programa (assíncrono).
-   Se tudo fosse síncrono, a página podia "congelar" enquanto esperas pela internet.

### Sintaxe base (passo a passo)

-   **Síncrono:** `console.log("A")` → `console.log("B")` (sempre nesta ordem).
-   **Assíncrono:** `setTimeout` ou `fetch` correm "mais tarde".
-   **A ordem muda:** o código continua enquanto o pedido não termina.
-   **O JavaScript não "para" o resto do código** só porque uma tarefa demora.

No `fetch`, isto é exatamente o que acontece: o pedido é feito, o código continua, e a Promise resolve mais tarde com a resposta.

### Exemplo

```js
console.log("1) Inicio");
console.log("2) Meio");
console.log("3) Fim");
// Ordem: 1, 2, 3 (sempre)
```

```js
console.log("1) Inicio");

setTimeout(() => {
    // Este código corre depois, não bloqueia o resto
    console.log("3) Timeout");
}, 0);

console.log("2) Meio");
// Ordem: 1, 2, 3 (timeout vem no fim)
```

### Erros comuns

-   Achar que `setTimeout(..., 0)` corre imediatamente.
-   Esperar que um pedido à API termine antes da linha seguinte.

### Boas práticas

-   Assume que tarefas demoradas são assíncronas.
-   Usa logs para confirmar a ordem real das execuções.

### Checkpoint

-   Quando é que o JavaScript “não bloqueia” o resto do código?
-   Porque é que `setTimeout(..., 0)` não corre imediatamente?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Promessas (Promise)

### Modelo mental

Uma Promessa é um "compromisso" de que algo vai terminar no futuro. Ela representa **um valor que ainda não chegou**.

Uma Promessa pode estar em três estados:

-   **Resolver (fulfilled):** deu certo.
-   **Rejeitar (rejected):** deu erro.
-   **Estar pendente (pending):** ainda não acabou.

Quando a Promessa termina, usas `then` para o sucesso e `catch` para o erro.

Exemplos de tarefas que devolvem Promessas:

-   Pedidos à internet (`fetch`).
-   Esperas com `setTimeout`.
-   Leitura de ficheiros (em Node).

### Sintaxe base (passo a passo)

-   **Criar uma Promise:** `new Promise((resolve, reject) => { ... })`.
-   **Resolver:** chama `resolve(valor)`.
-   **Rejeitar:** chama `reject(erro)`.
-   **Ler o resultado:** `promise.then(...).catch(...)`.
-   **Opcional:** `finally(...)` corre sempre no fim.
-   **Importante:** `then` também devolve uma Promise, por isso dá para encadear.

### Exemplo

```js
function esperar(segundos) {
    return new Promise((resolve) => {
        // Simula uma tarefa que demora
        setTimeout(() => {
            resolve(`Esperei ${segundos}s`);
        }, segundos * 1000);
    });
}

esperar(1)
    .then((mensagem) => {
        // Sucesso: recebemos o valor
        console.log(mensagem);
    })
    .catch((erro) => {
        // Erro: algo falhou
        console.log("Erro:", erro);
    })
    .finally(() => {
        // Este bloco corre sempre
        console.log("Terminei");
    });
```

### Erros comuns

-   Esquecer o `return` da Promise numa função.
-   Escrever `then(console.log(...))` em vez de `then(() => ...)`.
-   Esquecer o `catch` e não tratar o erro.

### Boas práticas

-   Mantém as Promessas pequenas e com um objetivo.
-   Usa `catch` para tratar erros de forma clara.

### Checkpoint

-   Quais são os 3 estados de uma Promise?
-   Para que serve o `finally`?

<a id="sec-3"></a>

## 3. [ESSENCIAL] async/await e try/catch

### Modelo mental

`async/await` é uma forma **mais legível** de trabalhar com Promessas. Em vez de vários `then`, escreves quase como se fosse síncrono.

-   `async` transforma a função num "modo assíncrono".
-   `await` faz o JavaScript esperar **dentro da função**.
-   Para tratar erros, usa `try/catch`.

Importante: o `await` **não bloqueia o resto da aplicação**. Ele apenas pausa aquela função, não a página inteira.

### Sintaxe base (passo a passo)

-   **Cria a função async:** `async function carregar() { ... }`.
-   **Usa await:** `const dados = await promessa`.
-   **Envolve em try/catch:** trata erros de forma segura.
-   **Nota:** `async` devolve sempre uma Promise.
-   **Quando tens várias tarefas:** podes usar `await` uma de cada vez.

### Exemplo

```js
function esperar(segundos) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Esperei ${segundos}s`);
        }, segundos * 1000);
    });
}

async function executar() {
    try {
        // await espera pelo resultado da Promise
        const mensagem = await esperar(1);
        console.log(mensagem);
    } catch (erro) {
        // Se algo falhar, cai aqui
        console.log("Erro:", erro);
    }
}

executar();
```

### Erros comuns

-   Usar `await` fora de funções `async`.
-   Esquecer o `try/catch` e não perceber erros.
-   Misturar `then` e `await` sem necessidade.

### Boas práticas

-   Prefere `async/await` quando há várias Promessas em sequência.
-   Usa `try/catch` para dar mensagens de erro compreensíveis.

### Checkpoint

-   O que acontece se usares `await` fora de uma função `async`?
-   Porque é que `try/catch` é importante em código assíncrono?

<a id="sec-4"></a>

## 4. [ESSENCIAL] HTTP em 2 minutos: request/response

### Modelo mental

HTTP é uma conversa simples:

-   O **cliente** envia um **request** (pedido).
-   O **servidor** responde com **status**, **headers** e **body**.

### Métodos (quando usar)

-   **GET:** pedir dados (ler).
-   **POST:** criar algo novo.
-   **PUT:** substituir um recurso inteiro.
-   **PATCH:** alterar só parte do recurso.
-   **DELETE:** apagar.

### Status codes rápidos

-   **200 OK:** pedido com sucesso.
-   **201 Created:** criado com sucesso (normal em POST).
-   **204 No Content:** sucesso sem body (ex.: DELETE).
-   **400 Bad Request:** pedido mal formado.
-   **401 Unauthorized:** falta autenticação.
-   **403 Forbidden:** estás autenticado, mas não tens permissão.
-   **404 Not Found:** recurso não existe.
-   **409 Conflict:** conflito (ex.: email já existe).
-   **422 Unprocessable Entity:** dados inválidos.
-   **500 Server Error:** erro inesperado no servidor.

### Headers e body (no básico)

-   **Content-Type:** diz o formato do body (`application/json`).
-   **Authorization:** onde vai a credencial (conceito, vamos ver mais tarde).
-   **Body JSON:** `{ "nome": "Ana" }` quando envias dados.

### CORS (só o conceito)

O browser bloqueia pedidos entre origens diferentes por segurança. O CORS é a regra que **permite ou bloqueia** pedidos cross‑origin. Mais detalhes em `15_http_rest_cors_e_contratos_api.md`.

### Erros comuns

-   Confundir 401 com 403.
-   Enviar `POST` sem `Content-Type: application/json`.
-   Usar `GET` para criar dados.

### Boas práticas

-   Escolhe o método certo para cada ação.
-   Usa status codes coerentes (não devolvas 200 em tudo).
-   Valida o body no backend antes de aceitar.

### Mini-checkpoint rápido

-   Que método usas para criar um aluno novo?
-   O que significa `204`?
-   Em que header costuma ir a autenticação?
-   Porque existe CORS?

<a id="sec-5"></a>

## 5. [EXTRA] Padrão simples de loading e erro

### Modelo mental

Quando uma tarefa demora, deves mostrar **loading**. Se falhar, mostras **erro**. Isto melhora a experiência do utilizador porque ele sabe o que está a acontecer.

Em React, este padrão aparece em quase todos os pedidos a APIs.

### Sintaxe base (passo a passo)

-   **Estado `loading`:** começa em `true`.
-   **Estado `erro`:** começa vazio.
-   **Atualiza no fim:** `loading` passa a `false`.
-   **Renderiza conforme o estado.**

### Exemplo

```jsx
import { useState } from "react";

// Simula um pedido demorado
function pedidoSimulado() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 70% de chance de sucesso
            if (Math.random() < 0.7) {
                resolve("Dados carregados!");
            } else {
                reject("Falha no pedido");
            }
        }, 1000);
    });
}

function PedidoSimples() {
    const [mensagem, setMensagem] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    async function carregar() {
        // prepara o estado para o pedido
        setLoading(true);
        setErro("");
        setMensagem("");

        try {
            const resultado = await pedidoSimulado();
            // guarda o resultado
            setMensagem(resultado);
        } catch (e) {
            // guarda o erro
            setErro(String(e));
        } finally {
            // termina o loading
            setLoading(false);
        }
    }

    return (
        <div>
            <button onClick={carregar}>Simular pedido</button>
            {loading && <p>A carregar...</p>}
            {erro && <p>Erro: {erro}</p>}
            {mensagem && <p>{mensagem}</p>}
        </div>
    );
}
```

### Erros comuns

-   Esquecer de desligar o `loading`.
-   Mostrar o erro e o sucesso ao mesmo tempo.

### Boas práticas

-   Limpa o erro antes de um novo pedido.
-   Mostra mensagens curtas e claras.

### Checkpoint

-   O que deve aparecer no ecrã quando `loading` é `true`?
-   Porque é importante mostrar erros ao utilizador?

<a id="exercicios"></a>

## Exercícios - Comunicação síncrona e assíncrona

1. Cria um ficheiro `teste.js`. Escreve `console.log("A")`, depois `console.log("B")`, depois `console.log("C")`. Corre com `node teste.js` e confirma a ordem.
2. No mesmo ficheiro, coloca o log "C" dentro de `setTimeout(() => { ... }, 0)`. Corre novamente e escreve a ordem final num comentário.
3. Cria a função `esperar(ms)` que devolve uma Promise. Dentro da Promise, usa `setTimeout` e faz `resolve("Terminei")`. Chama `esperar(500)` e usa `then` para mostrar a mensagem.
4. Altera `esperar` para rejeitar quando `ms` for menor que 500. Chama `esperar(200)` e usa `catch` para mostrar o erro.
5. Cria uma função `executar` com `async/await`. Dentro, usa `await esperar(1000)` e faz `console.log` do resultado.
6. Cria um componente `PedidoSimples` com um botão "Carregar". Ao clicar, chama uma função `async` que espera 1 segundo e mostra "A carregar..." enquanto espera.
7. Adiciona `finally` para garantir que o loading termina mesmo com erro.
8. Cria duas Promessas e resolve-as em sequência com `await`.
9. Usa `Promise.all` com duas Promessas simples e mostra quando ambas terminaram.
10. Escreve, em 2 a 3 linhas, a diferença entre síncrono e assíncrono com um exemplo do dia a dia.
11. Cria uma função `pedidoSimulado` que usa `Math.random()` para decidir sucesso ou erro. Passo a passo: (1) `const r = Math.random()`, (2) se `r < 0.5` faz `reject("Falhou")`, (3) caso contrário faz `resolve("OK")`. Depois usa `try/catch` para mostrar a mensagem certa.

<a id="changelog"></a>

## Changelog

-   2026-01-12: criação do ficheiro.
-   2026-01-12: explicações teóricas aprofundadas e exercícios mais guiados.
-   2026-01-12: clarificação do comportamento assíncrono do `fetch`.
-   2026-01-12: secção ESSENCIAL sobre HTTP (métodos, status e CORS).
