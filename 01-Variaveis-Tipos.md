# [1] Variáveis, Tipos e Conceitos Importantes

> **Objetivo**: perceber como **declarar e usar variáveis**, o que são **tipos** em JS, como funcionam os **escopos** e **hoisting**, e evitar armadilhas de **coerção** e **truthy/falsy**. Exemplo primeiro em **strict mode**.

```js
"use strict"; // recomenda-se em todos os ficheiros JS
```

## 1) Declaração de variáveis: `var` vs `let` vs `const`

### Diferenças essenciais

| Palavra-chave | Pode reatribuir? | Escopo                          | Hoisting/TDZ                                                              | Usar hoje?       |
| ------------- | ---------------- | ------------------------------- | ------------------------------------------------------------------------- | ---------------- |
| `var`         | ✅               | **Função** (ignora blocos `{}`) | **Hoisting** para o topo da função; inicializa a `undefined`; **sem** TDZ | ❌ Evitar        |
| `let`         | ✅               | **Bloco** `{ ... }`             | Declarada no topo do bloco mas em **TDZ** até à linha de declaração       | ✅               |
| `const`       | ❌               | **Bloco** `{ ... }`             | Como `let` (TDZ), mas **sem reatribuição** do identificador               | ✅ (por defeito) |

-   **TDZ (Temporal Dead Zone)**: intervalo entre o início do bloco e a linha da declaração em que `let/const` **existem** mas **não podem ser usados** (acesso dá `ReferenceError`).
-   **Boa prática**: **`const` por defeito**; usa `let` quando precisas mesmo de reatribuir. Evita `var`.

```js
// Exemplo TDZ
{
    // console.log(x); // ReferenceError (TDZ)
    let x = 10;
}
```

---

## 2) Escopos e shadowing

-   **Global**: visível em todo o módulo/ficheiro.
-   **Função**: criado por `function ... { }`.
-   **Bloco** `{ ... }`: `let/const` vivem aqui (em `if`, `for`, etc.).

**Shadowing**: uma variável **mais interna** com o mesmo nome **“sombra”** a exterior.

```js
let a = 1;
{
    let a = 2; // shadowing (só dentro do bloco)
    // aqui a = 2
}
// aqui a = 1
```

⚠️ `var` **não** respeita bloco – pode “vazar” para fora de `if/for`, causando bugs. Usar `let/const` evita isto.

---

## 3) Tipos primitivos e `typeof`

Primitivos: `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`.

```js
const n = 42; // number (inteiros e reais)
const s = "Nuno"; // string
const b = true; // boolean
const nada = null; // null (ausência intencional)
let indef; // undefined (não inicializada)
const id = Symbol("id"); // symbol (único)
const grande = 9007199254740993n; // bigint (inteiros enormes)
```

**`number` especiais**:

-   `NaN` (Not-a-Number) → operações inválidas (`Number("abc")`).
-   `Infinity`/`-Infinity` → divisão por zero, overflow.
-   **Precisão**: `0.1 + 0.2 !== 0.3`. Para comparar, usa tolerância:

---

## 4) Coerção de tipos e `truthy/falsy`

### `truthy` vs `falsy`

> `truthy` = avaliado como verdadeiro num contexto booleano.  
> `falsy` = avaliado como falso num contexto booleano.

Valores **falsy**: `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`.  
Tudo o resto é **truthy** (inclui `"0"`, `"false"`, `[]`, `{}`, `function(){}`).

```js
Boolean(""); // false
Boolean("0"); // true
Boolean([]); // true

if (0) {
    // não entra (0 é falsy)
}
if ("0") {
    // entra ("0" é truthy)
}
```

> `truthy` é algo que é avaliado como verdadeiro num contexto booleano, mesmo que não seja a definição de verdadeiro. `falsy` é algo que é avaliado como falso num contexto booleano, mesmo que não seja a definição de falso.

### Coerção

> Coerção é a conversão automática ou manual de um valor de um tipo para outro.

-   **Implícita** (automática): o JS tenta converter tipos em certas operações.
-   **Explícita**: converto eu → `Number(x)`, `String(x)`, `Boolean(x)`.

```js
"2" * 3; // 6   (coerção para number)
"2" + 3; // "23" (concatenação de strings)
Number("2"); // 2
parseInt("08", 10); // 8 (passa sempre a base!)
```

**Recomendação**:

-   usa **`===`** (igualdade **estrita**) e **conversões explícitas**;
-   evita confiar em coerções implícitas (surpresas com `==`).

---

## 5) Igualdade: `==` vs `===`

-   `==` → **com coerção** (evitar).
-   `===` → **sem coerção** (preferido).

```js
2 == "2"; // true  (coerção) ❌ Compara o valor e não o tipo
2 === "2"; // false ✅ Compara o valor e o tipo
```

```js
const o1 = { x: 1 },
    o2 = { x: 1 };
o1 === o2; // false (endereços diferentes)
const o3 = o1; // mesma referência
o1 === o3; // true
```

---

## 6) Boas práticas rápidas

-   **`"use strict"`** sempre (impede variáveis globais acidentais, etc.).
-   **`const` por defeito**, `let` quando precisas reatribuir. **Nunca `var`** em novo código.
-   **Nomes**: `camelCase` para variáveis e funções; `UPPER_SNAKE_CASE` para constantes “globais”.
-   **Evita** criar globais: declara sempre com `let/const`.
-   Converte **explicitamente** antes de comparar (e usa `===`).
-   Para arrays/objetos, copia de forma **imutável** quando fizer sentido: `const copia = {...obj}`, `const novo = [...arr]`.

---

## 7) Exemplos práticos comentados

### 7.1 Escopo de bloco e TDZ

```js
"use strict";

let mensagem = "fora";

{
    // console.log(mensagem); // "fora" (ainda estamos a ler a exterior)
    // console.log(x);        // ReferenceError (TDZ de x)
    let x = 10;
    let mensagem = "dentro"; // shadowing
    console.log(mensagem); // "dentro"
}

console.log(mensagem); // "fora"
```

### 7.2 `var` a “vazar” o bloco (porque não usar)

```js
if (true) {
    var antigo = 1; // escopo de função, NÃO de bloco
}
console.log(antigo); // 1  ← vazou (surpresas!)
```

### 7.3 `const` vs mutação interna

```js
const aluno = { nome: "Ana", nota: 17 };
aluno.nota = 18; // ✅ mutação interna
// aluno = { ... }  // ❌ reatribuição do identificador
```

### 7.4 `truthy/falsy` e condicionais seguras

```js
const entradas = [0, "", null, undefined, NaN, "OK", []];

for (const v of entradas) {
    // Evita: if (v) quando 0 e "" são válidos no teu contexto
    const eValido = v !== null && v !== undefined; // valida “preenchido”
    console.log(v, "->", eValido);
}
```

### 7.5 Coerção explícita vs implícita

```js
// Implícita (surpresas):
"5" - 1; // 4
"5" + 1; // "51"

// Explícita (claro e previsível):
Number("5") - 1; // 4
String(5) + "1"; // "51"
```

### 7.6 Igualdade e referências

```js
const a = { x: 1 };
const b = { x: 1 };
console.log(a === b); // false (referências distintas)
const c = a;
console.log(a === c); // true
```

---

## 8) Exercícios rápidos (auto-correção mental)

1. **Escolhe a declaração correta** para cada caso e justifica:
    - contador que incrementa num `for`;
    - configuração carregada uma vez e nunca reatribuída;
    - variável que só existe dentro de um `if`.
2. Diz se é **truthy** ou **falsy**: `0`, `"0"`, `[]`, `{}`, `""`, `null`, `undefined`, `NaN`.
3. O que imprime e porquê?
    ```js
    "use strict";
    console.log(x);
    let x = 3;
    ```
4. Converte **explicitamente** para obter os resultados indicados:
    - `"12"` e `3` → `15`
    - `false` → `"false"`
    - `"  42  "` → `42` (number)
5. Reescreve estas comparações para versões mais seguras:
    - `if (valor == 0) { ... }`
    - `if (entrada) { ... }` (considera que `0` e `""` são válidos)

---

### Apêndice: exemplos de conversão útil

```js
Number("  42  "); // 42
parseInt("08", 10); // 8  (passa sempre a base!)
parseFloat("3.14"); // 3.14
String(false); // "false"
Boolean("false"); // true  (string não vazia é truthy!)
Boolean(0); // false
```
