# [1] Variáveis e Tipos (11.º ano)

> **Objetivo**: perceber porque existe `"use strict"`, quando usar `var`/`let`/`const`, o que significa “tipo” em JavaScript e como evitar surpresas com coerção e igualdade.

---

## 0) Ligar o "modo seguro"

```js
"use strict";
```

- Acrescenta esta linha no topo de cada ficheiro ou `<script>`.
- O motor deixa de aceitar variáveis criadas "por acidente" e avisa mais cedo quando algo corre mal.

---

## 1) Três formas de criar variáveis (e qual escolher)

| Palavra-chave | Pode mudar o valor? | Onde vive? | Quando usar                                                         |
| ------------- | ------------------- | ---------- | ------------------------------------------------------------------- |
| `const`       | ❌ (valor fixo)     | Bloco `{}` | Usa por defeito; deixa claro que a referência não muda              |
| `let`         | ✅                  | Bloco `{}` | Quando precisas de atualizar a variável (contadores, acumuladores…) |
| `var`         | ✅                  | Função     | Evita em novo código → ignora blocos e traz bugs difíceis           |

- **TDZ** (_Temporal Dead Zone_): intervalo entre o início do bloco e a linha da declaração. Se leres a variável antes de `let/const`, recebes `ReferenceError`.
- `const` impede mudar a referência, **não** o conteúdo interno. Objetos/arrays podem ter campos alterados.

```js
{
    // console.log(x); // ReferenceError (ainda na TDZ)
    let x = 10;
}

const aluno = { nome: "Ana" };
aluno.nome = "Rita"; // OK
// aluno = {}; // ERRO (não podes apontar para outro objeto)
```

---

## 2) Escopos e shadowing

- **Global**: tudo o que declaras fora de funções/blocos (evita acumular globais).
- **Função**: cada `function ... { }` cria um "mundo" novo.
- **Bloco `{}`**: `let/const` vivem apenas aqui (if, for, while, ...).

```js
let mensagem = "fora";
{
    let mensagem = "dentro"; // shadowing → a exterior continua intacta
    console.log(mensagem); // "dentro"
}
console.log(mensagem); // "fora"
```

> Usa `let/const` e o escopo resolve-se sozinho; `var` ignora blocos e pode "vazar" para fora do `if/for`.

---

## 3) Tipos primitivos (e como descobrir qual tens)

Primitivos em JS: `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`.

```js
const n = 42; // number (inteiros e decimais)
const s = "Nuno"; // string
const ok = true; // boolean
const nada = null; // ausência intencional
let indef; // undefined (não inicializada)
const chave = Symbol("id"); // symbol (identificadores únicos)
const grande = 9007199254740993n; // bigint (inteiros gigantes)
```

Ferramentas úteis:

- `typeof valor` → devolve uma string com o tipo (`typeof null` devolve `"object"` por motivos históricos).
- `Number.isNaN(x)` → confirma se o valor é **precisamente** `NaN`.
- Para números com vírgulas, lembra-te do erro clássico: `0.1 + 0.2` não é exatamente `0.3`. Compara sempre com tolerância quando trabalhas com floats.

---

## 4) Truthy/falsy e coerção (quando JS "faz magia")

Valores **falsy**: `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Tudo o resto é **truthy** (incluindo `"0"`, `"false"`, `[]`, `{}`...).

```js
if ("") {
    // não entra (string vazia é falsy)
}
if ("0") {
    // entra (string com caracteres é truthy)
}
```

- **Coerção implícita**: o motor tenta converter automaticamente (`"2" * 3` → `6`).
- **Coerção explícita**: tu decides (`Number("2")`). Prefere esta opção.

```js
"2" + 3; // "23" (concatena strings)
"2" * 3; // 6   (coerção para number)
Number("2"); // 2 (conversão explícita)
```

> Regra didática: quando comparares valores, converte primeiro (se necessário) e usa os operadores estritos.

---

## 5) Igualdade segura: `===` e `!==`

- `===` e `!==` **não** fazem coerção → comparam tipo + valor.
- `==` e `!=` fazem coerção automática → evitamos para não termos surpresas (`"" == 0` é `true`).

```js
2 === "2"; // false
2 == "2"; // true (coerção) ← evita
```

Para objetos/arrays, a comparação é por **referência**. Dois arrays com o mesmo conteúdo não são iguais entre si, apenas se apontarem para o mesmo sítio na memória.

```js
const a = { x: 1 };
const b = { x: 1 };
a === b; // false
const c = a;
a === c; // true
```

> Curiosidade: `Object.is(NaN, NaN)` devolve `true` e distingue `0` de `-0`. Útil quando queres ser super rigoroso.

---

## 6) Guião rápido de boas práticas

- Usa `"use strict"` e corre o código no modo módulo (`<script type="module">` ou ficheiros `.mjs`).
- Começa sempre com `const`; troca para `let` apenas quando fizer sentido.
- Nomes descritivos em `camelCase`. Guarda maiúsculas (`UPPER_SNAKE_CASE`) para constantes verdadeiramente globais.
- Converte entradas (prompt, formulários) **antes** de fazer contas.
- Quando precisares de valores por defeito, usa `??` em vez de `||` se quiseres preservar `0`, `""` ou `false`.

---

## 7) Exercícios

1. Cria `const escola = "EPMS"; let ano = 11;` e escreve no `console` uma frase como `"Estou no 11.º ano na EPMS"`. Atualiza `ano` para `12` e mostra a nova mensagem.
2. Usa `prompt` para ler a idade. Converte com `Number`, valida com `Number.isNaN` e escreve `"Maior"` ou `"Menor"` usando `const`/`let` adequados.
3. Declara três variáveis num bloco `{ ... }`, duas com `const` e uma com `let`. Mostra como o `shadowing` funciona declarando outra variável com o mesmo nome dentro de um bloco interno.
4. Implementa `function ehVazio(v)` que devolve `true` apenas para `null` e `undefined`. Testa a função com valores truthy/falsy e regista os resultados.
5. Escreve uma pequena tabela no `console` onde comparas `==` vs `===` para os pares `""/0`, `"0"/0`, `false/0` e `null/undefined`. Explica em comentários cada resultado.
6. Cria um array com valores mistos (`[0, "0", null, undefined, []]`). Percorre-o com `for...of` e, para cada elemento, mostra `typeof`, se é truthy e a conversão explícita para `Number`.
7. Desenvolve uma função `converteParaNumero(texto)` que devolve um número válido ou `null`. Usa-a para converter entradas de `prompt` e mostrar mensagens claras ao utilizador.

## Changelog

- **v1.1.0 — 2025-11-10**
    - Secção de Exercícios expandida para sete propostas práticas.
    - Adicionada a primeira entrada de changelog para registar futuras alterações.
