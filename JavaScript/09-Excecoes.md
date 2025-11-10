# [9] Exceções — Versão Didática (11.º ano)

> **Objetivo**: perceber como o JavaScript reage a erros, como lançar (`throw`) e apanhar (`try/catch`) exceções e como tratar erros assíncronos com `Promises` ou `async/await` de forma simples.

---

## 0) Porque precisamos disto?

Quando algo corre mal (por exemplo, dividir por zero ou fazer `JSON.parse` de texto inválido), o motor lança uma **exceção**. Se ninguém a apanhar, o programa pára naquela pilha e mostra um stack trace. Por isso usamos `try/catch`.

---

## 1) `try / catch / finally`

```js
try {
    // código que pode falhar
} catch (erro) {
    console.error("Ups:", erro.message);
} finally {
    // executa sempre: limpar recursos, fechar ficheiros, etc.
}
```

Exemplo:

```js
function dividir(a, b) {
    if (typeof a !== "number" || typeof b !== "number") {
        throw new TypeError("Preciso de números");
    }
    if (b === 0) throw new RangeError("Divisão por zero");
    return a / b;
}

try {
    console.log(dividir(10, 2));
} catch (erro) {
    console.error(erro.name, erro.message);
} finally {
    console.log("Fim do cálculo");
}
```

---

## 2) `throw` corretamente

-   Lança objetos `Error` ou subclasses (`TypeError`, `RangeError`, `ReferenceError`, ...).
-   Evita lançar strings soltas (perdes stack trace consistente).
-   Podes anexar informação extra no objeto (`erro.dados = {...}`).

```js
throw new Error("Algo falhou");
throw new TypeError("Esperava string");
```

Em ES2022 podes encadear causas:

```js
try {
    JSON.parse("{ inválido }");
} catch (erroOriginal) {
    throw new Error("Configuração inválida", { cause: erroOriginal });
}
```

---

## 3) Erros personalizados

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
```

No `catch` podes distinguir facilmente:

```js
try {
    classificar(42);
} catch (erro) {
    if (erro instanceof NotaInvalidaError) {
        console.warn("Corrige a nota:", erro.message);
    } else {
        throw erro; // algo inesperado → volta a lançar
    }
}
```

---

## 4) `finally` para limpar

Corre sempre, mesmo que haja `return` dentro do `try` ou `catch`.

```js
let recursoAberto = false;
try {
    recursoAberto = true;
    // usar recurso
} catch (erro) {
    console.error(erro);
} finally {
    recursoAberto = false; // garantir fecho
}
```

---

## 5) Erros em código assíncrono

### Promises com `.then/.catch/.finally`

```js
fetch("/api/dados")
    .then((resp) => {
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        return resp.json();
    })
    .then((dados) => console.log("OK", dados))
    .catch((erro) => console.error("Falhou:", erro.message))
    .finally(() => console.log("pedido terminado"));
```

### `async/await`

```js
async function carregarDados() {
    try {
        const resp = await fetch("/api/dados");
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        return await resp.json();
    } catch (erro) {
        console.error("Erro a carregar:", erro.message);
        return null; // ou volta a lançar: throw erro;
    }
}
```

> Atenção: `try/catch` não apanha erros que acontecem noutro "tick" sem `await`, como dentro de `setTimeout`. Nesse caso o `try/catch` tem de estar **lá dentro**.

---

## 6) Padrões úteis

### Função segura que devolve `{ ok, valor }`

```js
function executarComSeguranca(fn) {
    try {
        return { ok: true, valor: fn() };
    } catch (erro) {
        return { ok: false, erro };
    }
}
```

### Defaults claros em APIs

```js
function lerJSONSeguro(texto, fallback = {}) {
    try {
        return JSON.parse(texto);
    } catch (erro) {
        console.warn("JSON inválido, a usar fallback");
        return fallback;
    }
}
```

---

## 7) Mini desafios

1. Cria uma função `lerNumero(promptMsg)` que usa `prompt`, converte para número e lança `TypeError` se for inválido. Apanha o erro fora da função.
2. Implementa `fetchAluno(id)` que simula `fetch` com `setTimeout` e trata erros dentro da Promise.
3. Faz uma mini utilidade que recebe uma função `async` e volta a tentar até 3 vezes antes de desistir (com mensagens no `console`).
