# [15] Assíncrono e Event Loop (11.º ano)

> **Objetivo**: perceber, com linguagem simples e exemplos práticos, o que é **síncrono** e **assíncrono**, quem comunica com quem no JavaScript, o que é uma **Promise**, o que faz o **Event Loop** e por que razão `Promise` e `setTimeout` nem sempre correm na ordem que imaginas.

---

## 0) Antes de mais: **Quem fala com quem?**

O que é comunicação em JavaScript?

Uma aplicação JavaScript não corre sozinha: ela vive num **ambiente** (browser ou Node.js) que lhe dá **APIs** (ver mais à frente) para fazer coisas que o JS puro não sabe fazer (tempo, rede, base de dados, disco, rato/teclado).

Quando o teu JavaScript precisa de fazer algo “fora”, ele **pede ajuda** ao ambiente (browser ou Node).
E esse pedir ajuda não é imediato: o ambiente demora algum tempo a fazer o que lhe pediste (ex.: esperar 2 segundos, ir buscar dados à internet). Durante esse tempo, o teu JavaScript **continua a correr**.
Pensa assim:

```
[ O teu código JS ]
      ↓ pede ajuda
[ APIs do ambiente ]  ← (no browser: Web APIs; no Node: Node APIs)
      ↓ usam
[ Sistema Operativo ]  → rede, disco, rato/teclado, relógio
      ↑ devolvem resposta
(voltamos ao teu JS mais tarde)
```

- **API** (lê-se “ei-pi-ai”): conjunto de **botões** e **alavancas** que o browser/Node te dão para pedires coisas (ex.: `setTimeout`, `fetch`, eventos de clique). De uma forma genérica, uma API é uma forma de **interagir com algo** (ex.: rede, disco, rato/teclado). É a forma de comunicação entre 2 sistemas, neste caso o teu código JS e o ambiente onde ele corre.

---

## 1) Síncrono vs Assíncrono (com analogia da cozinha)

Existem 2 formas de trabalhar com código em JavaScript, síncrono e assíncrono. Isto define a forma como o JavaScript lida com tarefas que demoram tempo a completar (ex.: esperar 2 segundos, ir buscar dados à internet). O que faz enquanto espera?

Imagina um cozinheiro a preparar uma pizza:

- **Síncrono** (bloqueante): o cozinheiro pára tudo e **fica a olhar** para o forno até a pizza ficar pronta. O restaurante **para**.
    - Em código: chamar uma função que **calcula já** e só **depois** devolve o resultado.
- **Assíncrono** (não bloqueante): o cozinheiro **mete a pizza no forno**, **marca um alarme** e **continua** a fazer saladas. Quando o alarme toca, ele volta à pizza.
    - Em código: `setTimeout` (alarme), `fetch` (pedido à internet), eventos de clique (o cliente levanta a mão).

Se dependes de **tempo, rede, disco ou interação do utilizador**, usa **assíncrono**.

---

## 2) As peças com nomes simples

- **Call Stack** (“pilha de trabalho”): lista do que o JS está a **executar agora** (a pilha vai ficando vazia e cheia com funções).
- **Evento**: algo que **aconteceu** (o tempo passou, chegou resposta da internet, alguém clicou).
- **Callback** (“função‑para‑chamar‑depois”): função que **entregas** para ser chamada quando o evento acontecer.
- **Promise** (“promessa”): um **papel** que diz “no futuro vais ter um valor ou um erro”. Tem 3 estados: _pendente_ → _resolvida_ **ou** _rejeitada_.
- **Event Loop**: o **maestro** que coordena quando é que as funções‑para‑chamar‑depois entram outra vez no teu JS.
- **Filas** (caixas de espera):
    - **Fila Rápida** (microtarefas): Promises (`then/catch/finally`), `queueMicrotask`.
    - **Fila Normal** (tarefas): `setTimeout`, `setInterval`, eventos de clique, I/O.

**Regra:** sempre que a pilha fica **vazia**, o Event Loop **esvazia primeiro a Fila Rápida toda**; só depois pega **uma** da Fila Normal.

---

## 3) A ordem real — microtarefas primeiro, depois tarefas

```js
console.log("A");
setTimeout(() => console.log("B - timeout 0"), 0);
Promise.resolve().then(() => console.log("C - promise"));
console.log("D");
```

**Resultado**: `A`, `D`, `C - promise`, `B - timeout 0`  
**Porquê?** `Promise.then` vai para a **Fila Rápida** (corre já a seguir), `setTimeout` vai para a **Fila Normal** (corre a seguir).

---

## 4) Promises

Uma **Promise** é como uma **senha de atendimento**: “volta mais tarde e verás o resultado”.
Imagina que vais fazer análises ao sangue:

1. Vais ao laboratório e pedes as análises (crias a Promise).
2. Eles dão‑te uma senha com um número (a Promise fica pendente).
3. Vais fazer outras coisas (o teu código continua a correr).
4. Quando as análises ficam prontas, o laboratório chama o teu número (a Promise é resolvida ou rejeitada).
5. Vais buscar o resultado (o callback do `then` ou do `catch` é chamado).

Para isso, usamos o construtor `Promise`:

```js
const p = new Promise((resolve, reject) => {
    // faz algo assíncrono
    if (/* correu bem */) {
        resolve(valor); // promessa cumprida
    } else {
        reject(erro); // promessa falhada
    }
});
```

**Consumir uma Promise**

Consumir uma Promise significa dizer o que fazer quando ela for resolvida ou rejeitada. Para isso, usamos os métodos:

- **`then`** recebe o valor;
- **`catch`** recebe o erro;
- **`finally`** corre sempre (para limpezas).

```js
function esperar(ms, valor) {
    return new Promise((resolve) => setTimeout(() => resolve(valor), ms));
}

esperar(300, "Olá")
    .then((v) => v + " mundo") // encadeia valores
    .then((v) => v.toUpperCase()) // "OLÁ MUNDO"
    .catch((err) => console.error("Erro:", err))
    .finally(() => console.log("acabou"));
```

**Várias ao mesmo tempo**

```js
const p1 = esperar(200, 10);
const p2 = esperar(300, 20);
Promise.all([p1, p2]) // espera as duas
    .then(([a, b]) => console.log(a + b)); // 30
```

**Regras práticas**

- Usa **`then/catch`** se estiveres confortável; caso contrário…

---

## 5) `async/await` — ler código assíncrono como se fosse “passo a passo”

- Marca a função com `async` → ela **devolve uma Promise**.
- Usa `await` para **esperar** pela Promise **sem bloquear a app**.
- Envolve em `try/catch` para tratar erros.

```js
async function exemplo() {
    try {
        const a = esperar(200, 10); // lançadas em paralelo
        const b = esperar(200, 20);
        const [ra, rb] = await Promise.all([a, b]); // espera as duas
        return ra + rb; // 30
    } catch (e) {
        console.error("Falhou:", e.message);
        return null;
    }
}
```

**Sequencial vs Paralelo (importante!)**

```js
// SEQUENCIAL (demora mais)
async function somaLenta() {
    const a = await esperar(200, 10); // 200ms
    const b = await esperar(200, 20); // +200ms = ~400ms
    return a + b;
}

// PARALELO (melhor)
async function somaRapida() {
    const pa = esperar(200, 10);
    const pb = esperar(200, 20);
    const [a, b] = await Promise.all([pa, pb]); // ~200ms total
    return a + b;
}
```

---

**Anti-erro obrigatório: `try/catch` e callbacks assíncronos**

```js
try {
    setTimeout(() => {
        throw new Error("Falhou");
    }, 0);
} catch (e) {
    console.log("Nunca chega aqui");
}
```

O `try/catch` só apanha erros **síncronos** do bloco onde está.  
O callback do `setTimeout` corre mais tarde, por isso o erro não é apanhado.

Forma correta: trata o erro **dentro** do callback **ou** usa `Promise`/`async` com `reject/catch`.

```js
setTimeout(() => {
    try {
        throw new Error("Falhou");
    } catch (e) {
        console.warn(e.message);
    }
}, 0);
```

```js
function falharDepois() {
    return new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Falhou")), 0),
    );
}
falharDepois().catch((e) => console.warn(e.message));
```

## 6) `fetch` (buscar dados na internet) de forma segura

- `fetch(url)` pede ao browser que **vá buscar** dados. Quando vier a resposta, tu continuas.
- `response.ok` é `true` entre 200–299. Se não for, **lança um erro** para os teus `catch` apanharem.

```js
async function getJSON(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
}

async function carregarAlunos() {
    try {
        const alunos = await getJSON("/api/alunos");
        console.table(alunos);
    } catch (e) {
        console.warn("Não foi possível carregar:", e.message);
    }
}
```

**Timeout com `AbortController` (boa prática)**

Quando fazes `fetch`, define um tempo limite para não deixar a app presa indefinidamente.

```js
async function getComTimeout(url, ms = 4000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
        const r = await fetch(url, { signal: ctrl.signal });
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
    } finally {
        clearTimeout(t);
    }
}
```

---

## 7) Timers: `setTimeout` e `setInterval`

- **`setTimeout(fn, ms)`**: corre **uma vez** passado `ms` milissegundos.
- **`setInterval(fn, ms)`**: corre **várias vezes**, de `ms` em `ms`. Usa `clearInterval(id)` para parar.

```js
const id = setInterval(() => console.log("tic"), 1000);
setTimeout(() => clearInterval(id), 3500); // pára após ~3 tics
```

> Lembra-te: o **tempo é aproximado**. O callback só corre quando a pilha está livre e depois das **microtarefas**.

---

## 8) O Event Loop em 4 passos

O event loop é o maestro que decide quando é que as funções‑para‑chamar‑depois entram outra vez no teu JS.

Imagina que tens uma fila de pessoas (callbacks) à espera de serem atendidas. O Event Loop seria o funcionário que chama as pessoas da fila para serem atendidas (executadas) quando o cozinheiro (Call Stack) está livre.

1. Executa o **teu código** (Call Stack).
2. Quando a pilha fica **vazia**, corre **todas** as **microtarefas** (Promessas).
3. Depois, corre **uma** tarefa da **Fila Normal** (timeouts, cliques, I/O).
4. Volta ao passo 1.

---

## 9) Mini desafios

1. **Tempo de espera** — cria `esperar(ms)` que devolve uma Promise resolvida após `ms`. Usa `then` para escrever “Já passou!” ao fim de 1 segundo.
   Observa: o `console.log` só deve aparecer depois de ~1s.
2. **Mensagem sequencial** — escreve uma função `async` que lança duas Promises em paralelo com `Promise.all` e mostra a soma dos valores quando ambas terminarem.
3. **Relógio simples** — usa `setInterval` para atualizar um `<span>` com horas:min:seg. Adiciona um botão “Parar” que usa `clearInterval`.
   Observa: guardas o `id` do intervalo e paras com `clearInterval`.
4. **Ordem dos logs** — corre o snippet do capítulo (A, D, C, B) e descreve num parágrafo a ordem observada e o motivo.
   Observa: a ordem depende de microtarefas (Promise) e tarefas (timeout).
5. **Loading fictício** — mostra “A carregar…” num `<p>`, chama `esperar(1500)` e depois troca o texto para “Pronto”. Em caso de erro (simula lançando `throw`), mostra “Ups”.
6. **Fetch simulado** — cria `fakeFetch(url)` que devolve uma Promise resolvida com `{ ok: true, dados: [...] }` após 700 ms e usa `async/await` para tratar sucesso e erro (lança manualmente um erro para praticar o `catch`).
   Observa: testa o caminho de sucesso e o caminho de erro.

## 10) Dicionário rápido

- **API**: “botões” que o ambiente te dá para pedires coisas (tempo, internet, ficheiros).
- **Callback**: função que entregas para ser chamada **mais tarde**.
- **Promise**: promessa de um **resultado futuro** (valor ou erro).
- **Event Loop**: o **maestro** que decide quando entram as próximas funções.
- **Microtarefas**: fila **rápida** (Promises).
- **Tarefas**: fila **normal** (`setTimeout`, cliques, I/O).
- **Call Stack**: o que está a ser executado **agora**.

---

## 11) Resumo final

- Usa **assíncrono** sempre que atravessas **tempo/rede/disco/UI**.
- **Promises** e **`async/await`** tornam fácil trabalhar com resultados que **chegam depois**.
- O **Event Loop** dá **prioridade** às **Promises** (microtarefas) antes dos **timeouts/cliques** (tarefas).
- Pensa se queres fazer **em paralelo** (`Promise.all`) para não perder tempo.

## Changelog

- **v1.2.0 — 2025-11-10**
    - Mini desafios simplificados para focar em esperas simples, `Promise.all`, `setInterval` e simulações sem APIs externas.
- **v1.1.0 — 2025-11-10**
    - Mini desafios atualizados (agora com sete propostas). Inclui exercícios de retry, timeout e ordem de execução.
    - Changelog introduzido para acompanhar evoluções futuras do capítulo.
