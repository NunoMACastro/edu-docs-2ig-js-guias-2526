# [10] Exceções (try/catch/finally, throw, erros personalizados)

> **Objetivo**: saber **detetar**, **lançar** e **tratar** erros de forma limpa. Vais aprender `try/catch/finally`, quando usar `throw`, como criar **erros personalizados**, e como lidar com erros **assíncronos** com `Promises` e `async/await`.

---

## 1) Conceito rápido

-   Um **erro** interrompe o fluxo normal do programa. Em JS, quando algo falha, o motor **lança uma exceção**.
-   Se **não** apanhares a exceção, o programa **rebenta** (termina a execução daquela pilha) e verás um **stack trace**.
-   Usa `try/catch` para **capturar** e **tratar**; usa `throw` para **lançar** intencionalmente um erro.

```js
try {
    // código que pode falhar
} catch (e) {
    // lidar com o erro (e.message, e.name, e.stack)
} finally {
    // corre sempre (erro ou não): útil para libertar recursos
}
```

---

## 2) `try / catch / finally` em detalhe

-   **`try`**: bloco onde pode ocorrer erro.
-   **`catch(e)`**: executa se for lançada exceção. A variável `e` é o **objeto de erro**.
-   **`finally`**: executa **sempre** no fim (tenha havido erro ou não). Útil para **limpeza** (fechar ligação, limpar temporizador, etc.).

```js
function dividir(a, b) {
    if (typeof a !== "number" || typeof b !== "number") {
        throw new TypeError("Argumentos têm de ser números.");
    }
    if (b === 0) {
        throw new RangeError("Divisão por zero.");
    }
    return a / b;
}

try {
    console.log(dividir(10, 2)); // 5
} catch (e) {
    console.error("Erro:", e.name, e.message);
} finally {
    // libertar recursos / fechar coisas
}
```

> **Regra prática**: usa exceções para **situações anormais**; para fluxos esperados (ex.: validar formulário), devolve estados/valores claros quando preferires simplicidade.

---

## 3) `throw` — lançar erros corretamente

-   Lança um **objeto `Error`** (ou subclasse). Evita lançar **strings** ou números, para manter consistência.
-   **Erros nativos** comuns:
    -   `Error` (genérico)
    -   `TypeError` (tipo inválido)
    -   `RangeError` (valor fora do intervalo)
    -   `ReferenceError` (variável inexistente)
    -   `SyntaxError` (erro de sintaxe; aparece ao **avaliar** código, p.ex. `JSON.parse`/`eval`)
    -   `URIError`, `EvalError` (mais raros)
    -   `AggregateError` (várias causas, p.ex. em `Promise.any`)

```js
throw new Error("Falhou.");
throw new TypeError("Esperava string.");
throw new RangeError("Índice inválido.");
```

**Propriedades úteis**: `e.name`, `e.message`, `e.stack`.  
**ES2022**: `new Error("msg", { cause: erroOriginal })` para **encadear** causas.

---

## 4) Erros personalizados (classes próprias)

Cria uma **hierarquia** de erros para o teu domínio (mais clareza no `catch`).

```js
class NotaInvalidaError extends Error {
    constructor(nota) {
        super(`Nota inválida: ${nota}`);
        this.name = "NotaInvalidaError";
    }
}

function classificar(nota) {
    if (typeof nota !== "number" || nota < 0 || nota > 20) {
        throw new NotaInvalidaError(nota);
    }
    return nota >= 10 ? "Aprovado" : "Reprovado";
}

try {
    classificar(42);
} catch (e) {
    if (e instanceof NotaInvalidaError) {
        console.error("Erro de nota:", e.message);
    } else {
        console.error("Erro inesperado:", e);
    }
}
```

**Encadear causa (wrap)**:

```js
try {
    JSON.parse("{ inválido }");
} catch (err) {
    throw new Error("Falha a carregar configuração", { cause: err });
}
```

---

## 5) `finally` — limpeza garantida

Executa sempre, tenha havido erro ou não.

```js
let recursoAberto = true;
try {
    // usar recurso
} finally {
    recursoAberto = false; // garantir fecho/limpeza
}
```

> Mesmo que faças `return` dentro do `try`/`catch`, o `finally` **ainda corre**.

---

## 6) Assíncrono: Promises e `async/await`

### 6.1 Promises (com `.then/.catch/.finally`)

```js
fetch("/api/dados")
    .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
    })
    .then((data) => console.log("OK", data))
    .catch((err) => console.error("Falhou:", err.message))
    .finally(() => console.log("feito"));
```

### 6.2 `async/await` (mais legível)

```js
async function carregar() {
    try {
        const r = await fetch("/api/dados");
        if (!r.ok) throw new Error("HTTP " + r.status);
        const data = await r.json();
        return data;
    } catch (e) {
        console.error("Erro:", e.message);
        return null; // ou relança: throw e;
    }
}
```

> **Importante**: `try/catch` **não** apanha erros de **callbacks futuras** que não uses com `await`. Ex.: erros dentro de `setTimeout` precisam de `try/catch` **lá dentro**.

```js
try {
    setTimeout(() => {
        throw new Error("fora do try");
    }, 0);
} catch (e) {
    // NÃO apanha — a função executa mais tarde noutra pilha
}
```

Para Promises **não apanhadas**, existem eventos globais (avançado):

-   Browser: `window.addEventListener("unhandledrejection", e => ...)`
-   Node: `process.on("unhandledRejection", e => ...)`

---

## 7) Padrões úteis de tratamento

### 7.1 Função “segura” que devolve `{ ok, valor/erro }`

```js
function seguro(fn) {
    try {
        return { ok: true, valor: fn() };
    } catch (e) {
        return { ok: false, erro: e };
    }
}
const r = seguro(() => JSON.parse('{"a":1}'));
```

### 7.2 Validação de argumentos (fail-fast)

```js
function areaRetangulo(l, a) {
    if (typeof l !== "number" || typeof a !== "number") {
        throw new TypeError("l e a têm de ser números");
    }
    if (l <= 0 || a <= 0) throw new RangeError("Medidas > 0");
    return l * a;
}
```

### 7.3 Normalizar erros HTTP (`fetch` não lança por 404)

```js
async function getJSON(url, { signal } = {}) {
    const r = await fetch(url, { signal });
    if (!r.ok) throw new Error(`HTTP ${r.status} em ${url}`);
    return r.json();
}
```

### 7.4 Cancelar com `AbortController` e distinguir o erro

```js
async function getComTimeout(url, ms = 3000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
        return await getJSON(url, { signal: ctrl.signal });
    } catch (e) {
        if (e.name === "AbortError") {
            console.warn("Pedido cancelado por timeout");
            return null;
        }
        throw e; // relança outros
    } finally {
        clearTimeout(t);
    }
}
```

---

## 8) Boas práticas

-   **Lança sempre instâncias de `Error`** (ou subclasses). Evita `throw "string"`.
-   **Mensagens claras** para humanos; **nunca** exponhas dados sensíveis em mensagens/logs.
-   Usa **tipos de erro** adequados (`TypeError`, `RangeError`, etc.).
-   Decide entre **tratar** o erro (recuperar, valor por defeito) ou **relançar** (`throw`).
-   Em `async/await`, envolve `await` em `try/catch` e lida com `r.ok` em `fetch`.
-   Testa **caminhos de erro** (inputs inválidos, timeouts, 404/500, etc.).

---

## 9) Exercícios rápidos

1. **Dividir com validação**: melhora `dividir(a,b)` para aceitar `number` e strings numéricas (`"10"`) convertendo com `Number()`, mas lançar `TypeError` se o resultado for `NaN`.
2. **Erro personalizado**: cria `class JSONMalFormadoError` e usa‑a em `parseSeguro(txt)` que tenta `JSON.parse(txt)` e, se falhar, lança o teu erro com `cause`.
3. **HTTP seguro**: escreve `carregarAlunos(url)` que faz `fetch` e lança `Error("HTTP ...")` quando `!ok`. Com `async/await`.
4. **Timeout**: adapta `getComTimeout` para receber um **mensagem de erro** opcional; se exceder o tempo, devolve `null` e faz `console.warn(msg)`.
5. **Reencaminhar**: num `try/catch`, transforma um `TypeError` qualquer num `Error` genérico com uma mensagem amigável e `cause` preservada.
6. **Finally**: cria um contador com `setInterval` e garante que é sempre parado (com `clearInterval`) usando `finally`, mesmo se ocorrer um erro a meio.

---

## 10) Resumo

-   Usa `try/catch/finally` para **proteger** blocos que podem falhar e **limpar** recursos.
-   Lança erros com **`throw new Error(...)`** (ou subclasses) e **mensagens claras**.
-   Em assíncrono, trata erros com **`.catch`** ou **`try/catch` + `await`** e lembra‑te que `fetch` **não lança** por 404.
-   Cria **erros personalizados** para o teu domínio e, quando fizer sentido, encadeia causas com `{ cause }`.
