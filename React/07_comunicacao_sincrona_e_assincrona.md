# React.js (12.º Ano) - 07 · Comunicação síncrona e assíncrona

> **Objetivo deste ficheiro**
>
> - Distinguir **código síncrono** e **assíncrono** e perceber o impacto na UI.
> - Entender o essencial do **Event Loop** (Call Stack, filas e ordem de execução).
> - Trabalhar com **Promises** e `async/await` de forma “profissional” (sem magia).
> - Fazer pedidos HTTP com `fetch` e tratar **loading / erro / sucesso**.
> - Preparar o terreno para `useEffect` e consumo de APIs (ligações diretas ao ficheiro 08).

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] Síncrono vs assíncrono (o que muda mesmo?)](#sec-1)
- [2. [ESSENCIAL] Event Loop: porque é que o código “não espera”?](#sec-2)
- [3. [ESSENCIAL] Promises: a base do assíncrono moderno](#sec-3)
- [4. [ESSENCIAL] `async/await`: Promises com sintaxe mais legível](#sec-4)
- [5. [ESSENCIAL] `fetch`: pedidos HTTP e dados em JSON](#sec-5)
- [6. [ESSENCIAL+] Padrões de UI: loading / erro / sucesso](#sec-6)
- [7. [EXTRA] Diagnóstico rápido: bugs típicos e como os apanhas](#sec-7)
- [Exercícios - Comunicação síncrona e assíncrona](#exercicios)
- [Changelog](#changelog)

---

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **ESSENCIAL vs EXTRA:** domina as secções 1–6. A secção 7 é para quando já estás a fazer apps e “algo está estranho”.
- **Como estudar:** corre os exemplos e observa a consola. O objetivo é conseguires **prever a ordem** em que as coisas aparecem.
- **Ligações:**
    - `04_estado_e_eventos.md` (estado e re-render).
    - `06_formularios_controlados.md` (submissões e validação).
    - `08_useEffect_e_dados.md` (onde colocar `fetch` em React).

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] Síncrono vs assíncrono (o que muda mesmo?)

### 1.1 A ideia central (modelo mental)

Em JavaScript no browser, pensa assim:

- **Síncrono:** o código corre **linha a linha** e só passa à próxima quando a atual terminar.
- **Assíncrono:** o código **lança uma tarefa** (por exemplo, pedir dados a um servidor) e **continua**, porque essa tarefa vai terminar mais tarde.

O ponto importante não é “ser mais rápido”. É isto:

> **Assíncrono existe para não bloquear a aplicação.**  
> Se o browser ficasse parado à espera de um servidor, a página congelava.

### 1.2 “Bloquear” a aplicação (o problema do síncrono pesado)

No browser, a UI (cliques, scroll, animações) precisa de tempo para responder.
Se tu fizeres trabalho pesado de forma síncrona, o browser não consegue tratar eventos.

Exemplo (não copies para produção; é para perceber o problema):

```js
console.log("Antes");
const inicio = Date.now();

while (Date.now() - inicio < 2000) {
    // 2 segundos a bloquear
}

console.log("Depois");
```

O que vais sentir:

- durante esses 2 segundos, a página fica “presa” (não responde bem).
- isto é exatamente o que evitamos quando fazemos pedidos ou timers de forma assíncrona.

### 1.3 Onde aparece o assíncrono no dia a dia?

Alguns exemplos típicos:

- `setTimeout`, `setInterval` (timers)
- `fetch` (pedidos HTTP)
- ler ficheiros (em Node.js)
- eventos do utilizador (cliques, inputs) — não é “Promise”, mas também entra na lógica do Event Loop

### 1.4 Checkpoint

- O que é que o código assíncrono evita, em termos de UI?
- Porque é que um `while` pesado “congela” a página?

---

<a id="sec-2"></a>

## 2. [ESSENCIAL] Event Loop: porque é que o código “não espera”?

Muita gente sente que o JavaScript “faz magia” porque:

- tu chamas uma função,
- e coisas aparecem na consola “fora de ordem”.

O Event Loop é o que explica isto.

### 2.1 O mínimo que tens de saber

O browser organiza o trabalho assim:

1. **Call Stack (pilha de chamadas)**
    - onde o JavaScript está a executar código **agora** (síncrono).

2. **Web APIs**
    - o browser trata de coisas “externas” ao JS, como timers e rede.

3. **Filas**
    - quando uma tarefa termina, ela entra numa fila para ser executada quando o JS estiver livre.

O Event Loop é o “gestor” que faz isto:

- enquanto há código síncrono na Call Stack → executa.
- quando a Call Stack fica vazia → vai buscar coisas às filas.

### 2.2 Microtarefas vs tarefas (a ordem mais importante)

Há duas filas que interessam muito:

- **Fila de microtarefas** (normalmente: Promises resolvidas)
- **Fila de tarefas** (normalmente: `setTimeout`, eventos, etc.)

Regra prática (muito útil):

> Depois do código síncrono terminar, o browser esvazia primeiro a fila de microtarefas,  
> e só depois pega na fila de tarefas.

### 2.3 Experiência rápida: prever a ordem

Antes de correr, tenta prever.

```js
console.log("A");

setTimeout(() => console.log("B (timeout)"), 0);

Promise.resolve().then(() => console.log("C (promise)"));

console.log("D");
```

Ordem típica:

1. `A`
2. `D`
3. `C (promise)` ← microtarefa
4. `B (timeout)` ← tarefa

Porque:

- `A` e `D` são síncronos.
- a Promise resolve e vai para microtarefas.
- o timeout vai para tarefas.

> Nota: o `setTimeout(..., 0)` não significa “agora”. Significa “assim que possível”, quando o JS estiver livre e depois das microtarefas.

### 2.4 Onde entra o `fetch` nesta história?

O `fetch` começa um pedido na rede (fora do JS). Quando termina:

- o resultado volta para o JS como uma **Promise**.
- essa Promise, quando resolve, entra como microtarefa.

Mas atenção: o tempo de rede é real (pode demorar muito).

### 2.5 Checkpoint

- O que acontece quando a Call Stack fica vazia?
- Porque é que Promises (microtarefas) aparecem antes de `setTimeout`?

---

<a id="sec-3"></a>

## 3. [ESSENCIAL] Promises: a base do assíncrono moderno

### 3.1 O que é uma Promise (modelo mental)

Uma **Promise** é um objeto que representa:

- “Um valor que ainda não tenho, mas vou ter mais tarde (ou vai falhar).”

Uma Promise tem 3 estados:

- **pending** (ainda à espera)
- **fulfilled** (sucesso, com valor)
- **rejected** (falha, com erro)

### 3.2 Como se consome uma Promise

Usas:

- `.then(...)` para sucesso
- `.catch(...)` para erro
- `.finally(...)` para algo que corre sempre

Exemplo simples:

```js
fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((data) => console.log("Users:", data.length))
    .catch((err) => console.log("Erro:", err.message))
    .finally(() => console.log("Terminei"));
```

### 3.3 Encadeamento (o que o `then` devolve)

O ponto mais importante para escrever Promises bem:

> Cada `.then(...)` devolve uma **nova Promise**.

E dentro de um `then`, se tu devolveres:

- um valor normal → ele passa para o próximo `then`
- uma Promise → o próximo `then` espera por ela

Exemplo (observa a lógica):

```js
Promise.resolve(5)
    .then((n) => n * 2) // devolve 10
    .then((x) => Promise.resolve(x + 1)) // devolve Promise(11)
    .then((final) => console.log(final)); // 11
```

### 3.4 Erros em Promises (propagação)

Se houver um erro em qualquer `then`, ele “salta” para o `catch`.

```js
Promise.resolve()
    .then(() => {
        throw new Error("Falhou aqui");
    })
    .then(() => {
        console.log("Isto não corre");
    })
    .catch((e) => console.log("Apanhado no catch:", e.message));
```

### 3.5 Promises em paralelo (quando queres “fazer várias coisas”)

Às vezes queres fazer vários pedidos ao mesmo tempo.

- `Promise.all([...])` → falha se **uma falhar**
- `Promise.allSettled([...])` → dá sempre resultado, com sucesso/erro de cada uma

Exemplo (paralelo + controlo):

```js
const p1 = fetch("https://jsonplaceholder.typicode.com/users");
const p2 = fetch("https://jsonplaceholder.typicode.com/posts");

Promise.all([p1, p2])
    .then(async ([r1, r2]) => {
        const users = await r1.json();
        const posts = await r2.json();
        console.log(users.length, posts.length);
    })
    .catch((e) => console.log("Falhou:", e.message));
```

### 3.6 Checkpoint

- O que é uma Promise, em linguagem simples?
- O que acontece a um erro dentro de um `then`?
- Qual a diferença entre `Promise.all` e `Promise.allSettled`?

---

<a id="sec-4"></a>

## 4. [ESSENCIAL] `async/await`: Promises com sintaxe mais legível

### 4.1 O que `async/await` faz (sem magia)

- `async` marca uma função como “assíncrona”.
- dentro dela, `await` espera por uma Promise e devolve o valor final.

Isto não bloqueia o browser inteiro.

> **Regra mental:**  
> O `await` “pausa” só aquela função **até a Promise resolver**.  
> O resto da aplicação continua a correr.

### 4.2 Exemplo: a mesma coisa com e sem `await`

Sem `await`:

```js
fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((data) => console.log(data.length));
```

Com `await`:

```js
async function carregar() {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();
    console.log(data.length);
}
```

### 4.3 Erros com `try/catch`

Quando usas `await`, o equivalente do `.catch(...)` é `try/catch`.

```js
async function carregar() {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await res.json();
        console.log(data.length);
    } catch (e) {
        const msg = e instanceof Error ? e.message : "Erro desconhecido";
        console.log("Falhou:", msg);
    }
}
```

### 4.4 Sequencial vs paralelo (o erro mais comum)

Se fizeres isto:

```js
const a = await fetch(url1);
const b = await fetch(url2);
```

é **sequencial** (espera pelo primeiro antes de começar o segundo).

Se queres **paralelo**:

```js
const [a, b] = await Promise.all([fetch(url1), fetch(url2)]);
```

Isto é importante para performance quando tens várias fontes.

### 4.5 Checkpoint

- O `await` bloqueia a aplicação toda?
- Qual a diferença entre sequencial e paralelo?

---

<a id="sec-5"></a>

## 5. [ESSENCIAL] `fetch`: pedidos HTTP e dados em JSON

Esta secção liga diretamente ao que vais fazer em React (ficheiro 08).
Mas antes, tens de perceber o fluxo do `fetch` com calma.

### 5.1 O que `fetch` devolve mesmo?

Quando fazes:

```js
const res = await fetch("https://jsonplaceholder.typicode.com/users");
```

`res` é um objeto **Response** (não é o JSON ainda).

Para ter o JSON:

```js
const data = await res.json();
```

São **dois passos diferentes**.

### 5.2 A armadilha mais importante: 404/500 não dão erro automático

O `fetch` só rejeita a Promise em erros de rede (por exemplo, sem internet).

Se o servidor responder com `404` ou `500`, a Promise resolve na mesma — porque isso é uma resposta HTTP válida.

Por isso é que verificamos `res.ok`:

```js
if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
}
```

### 5.3 Template simples e correto (GET)

```js
async function getJson(url) {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    return res.json(); // devolve Promise com o JSON
}

async function teste() {
    try {
        const users = await getJson(
            "https://jsonplaceholder.typicode.com/users",
        );
        console.log(users.length);
    } catch (e) {
        console.log("Falhou:", e instanceof Error ? e.message : "Erro");
    }
}
```

### 5.4 Enviar dados (POST) — visão rápida

Em muitos projetos vais enviar dados (criar algo).

```js
async function criarPost() {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Olá", body: "Texto", userId: 1 }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const criado = await res.json();
    console.log("Criado:", criado.id);
}
```

### 5.5 Checkpoint

- O que é um `Response`?
- Porque é que precisamos de `await res.json()`?
- Porque é que `res.ok` é tão importante?

---

<a id="sec-6"></a>

## 6. [ESSENCIAL+] Padrões de UI: loading / erro / sucesso

Esta secção é a ponte direta para React e para o ficheiro 08.

A pergunta é:
**“Se o `fetch` demora, o que é que o utilizador vê enquanto espera?”**

### 6.1 O “estado do ecrã” (modelo mental)

Quando carregas dados externos, há sempre 3 situações:

1. **loading** → a app está à espera
2. **success** → tens dados e mostras conteúdo
3. **error** → falhou e mostras mensagem

Se não modelares isto, a UI fica confusa ou vazia.

### 6.2 Exemplo rápido (puro JS) só para perceber o fluxo

```js
async function carregar() {
    console.log("loading...");

    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        console.log("success:", data.length);
    } catch (e) {
        console.log("error:", e instanceof Error ? e.message : "Erro");
    }
}
```

Em React, este “loading/success/error” vai viver em **estado**.

### 6.3 Onde colocar `fetch` em React (a regra certa)

- Se é uma ação do utilizador (clicar “Carregar”) → **event handler**.
- Se é algo que deve acontecer quando a página aparece (carregar ao abrir) → **`useEffect`**.

Exemplo (handler):

```jsx
import { useState } from "react";

function BotaoCarregar() {
    const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "error"
    const [erro, setErro] = useState("");
    const [users, setUsers] = useState([]);

    async function carregar() {
        setStatus("loading");
        setErro("");

        try {
            const res = await fetch(
                "https://jsonplaceholder.typicode.com/users",
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            setUsers(data.slice(0, 5));
            setStatus("success");
        } catch (e) {
            setErro(e instanceof Error ? e.message : "Falha ao carregar");
            setStatus("error");
        }
    }

    return (
        <div>
            <button onClick={carregar}>Carregar</button>

            {status === "loading" && <p>A carregar...</p>}
            {status === "error" && <p>{erro}</p>}
            {status === "success" && (
                <ul>
                    {users.map((u) => (
                        <li key={u.id}>{u.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
```

Exemplo (ao montar) — aqui entra o ficheiro 08:

```jsx
import { useEffect, useState } from "react";

function ListaAoMontar() {
    const [status, setStatus] = useState("loading");
    const [erro, setErro] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function carregar() {
            setStatus("loading");
            setErro("");

            try {
                const res = await fetch(
                    "https://jsonplaceholder.typicode.com/users",
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                setUsers(data.slice(0, 5));
                setStatus("success");
            } catch (e) {
                setErro(e instanceof Error ? e.message : "Falha ao carregar");
                setStatus("error");
            }
        }

        carregar();
    }, []);

    if (status === "loading") return <p>A carregar...</p>;
    if (status === "error") return <p>{erro}</p>;

    return (
        <ul>
            {users.map((u) => (
                <li key={u.id}>{u.name}</li>
            ))}
        </ul>
    );
}
```

### 6.4 Checkpoint

- Quando é que usas handler e quando é que usas `useEffect`?
- Quais são os 3 estados mais comuns de um ecrã com dados?

---

<a id="sec-7"></a>

## 7. [EXTRA] Diagnóstico rápido: bugs típicos e como os apanhas

### 7.1 “Porque é que isto aparece fora de ordem?”

Faz este tipo de logs:

```js
console.log("Antes do fetch");
fetch(url).then(() => console.log("Depois do fetch"));
console.log("Depois de chamar fetch");
```

Se a ordem te surpreende, lembra-te:

- chamar `fetch` começa o pedido
- o `.then` só corre quando a Promise resolve
- o resto do código síncrono continua

### 7.2 “O meu `catch` não apanha 404/500”

Quase sempre é porque te esqueceste do `res.ok`:

```js
const res = await fetch(url);
if (!res.ok) throw new Error(`HTTP ${res.status}`);
```

Sem isto, 404/500 entram como “sucesso” do ponto de vista do `fetch`.

### 7.3 “Tenho dois pedidos em simultâneo e a UI fica errada”

Isto é muito comum quando há filtros/pesquisa:

- pedido A começa
- pedido B começa depois
- A termina por último e “pisca” a UI com dados antigos

No React, a solução profissional passa por `AbortController` (ver ficheiro 08, secção de cleanup/abort).

### 7.4 Checkpoint

- Que 2 logs metes para provar que algo é assíncrono?
- Qual é o passo que quase toda a gente se esquece no `fetch`?

---

<a id="exercicios"></a>

## Exercícios - Comunicação síncrona e assíncrona

> Faz por ordem. A ideia é ires do “ver na consola” para “usar em React”.

1. **Síncrono vs bloqueio**

- Faz um `while` que bloqueia 1 segundo e observa como a página reage.
- Escreve 2 frases a explicar o que significa “bloquear” no browser.

2. **Ordem de execução (Event Loop)**

- Copia o exemplo com `console.log("A")`, `setTimeout`, `Promise.resolve` e `console.log("D")`.
- Antes de correr, escreve a ordem que achas que vai acontecer.
- Depois confirma e explica porquê em 3 linhas.

3. **Promise encadeada**

- Cria `Promise.resolve(2)`.
- Faz `.then` para multiplicar por 10.
- Faz outro `.then` para somar 1.
- Mostra o resultado final na consola.

4. **Erro numa Promise**

- Cria uma Promise e dentro de um `then` faz `throw new Error("x")`.
- Garante que o `catch` apanha e mostra a mensagem.

5. **`async/await`**

- Reescreve o exercício 3 usando `async/await`.
- Faz um `try/catch` e garante que lidas com um erro (podes forçar com `throw`).

6. **`fetch` com `res.ok`**

- Faz `fetch` para `https://jsonplaceholder.typicode.com/users`.
- Valida `res.ok`, faz `res.json()` e mostra quantos users vieram.
- Troca a URL para uma inválida e confirma que o `catch` apanha (porque tu lançaste erro).

7. **Paralelo com `Promise.all`**

- Faz `fetch` a `/users` e `/posts` ao mesmo tempo (jsonplaceholder).
- Usa `Promise.all` e mostra os tamanhos dos dois arrays.

8. **React: botão Carregar**

- Cria um componente como o `BotaoCarregar` desta ficha.
- Usa `status` (`idle/loading/success/error`) e mostra a UI correta.

9. **React: carregar ao abrir**

- Cria uma lista que carrega ao montar (usa `useEffect`).
- Garante que tens loading/erro/sucesso.

---

<a id="changelog"></a>

## Changelog

- 2026-01-11: criação do ficheiro.
- 2026-01-26: reescrita completa para nível mais profissional e previsível:
    - modelo mental (síncrono/assíncrono)
    - Event Loop (Call Stack, microtarefas e tarefas)
    - Promises e propagação de erros
    - `async/await` (sequencial vs paralelo)
    - `fetch` com `res.ok` e exemplos GET/POST
    - ponte direta para React (`status`, handler vs `useEffect`)
    - exercícios mais progressivos
