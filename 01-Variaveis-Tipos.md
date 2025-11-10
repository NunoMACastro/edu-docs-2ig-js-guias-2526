# [1] Variáveis, Tipos e Conceitos Importantes

## Teoria
- **Tipagem dinâmica**: o tipo pode mudar ao longo do tempo.
- **Declaração**: `let` (mutável, escopo de bloco), `const` (identificador não reatribuído, escopo de bloco), `var` (escopo de função; evitar em projetos modernos).
- **Escopos**: global, função, bloco (`{}`).
- **Primitivos**: `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`.
- **`typeof`**: inspeção de tipo (nota histórica: `typeof null === "object"`).
- **Coerção & truthy/falsy**: `==` faz coerção, `===` não. falsy: `0, -0, 0n, "", null, undefined, NaN`.

## Exemplos
```js
"use strict";

let idade = 17;        // let: pode mudar
const PAIS = "Portugal"; // const: não pode ser reatribuído

// Tipos primitivos
let numero = 42;
let preco = 3.99;
let nome = "Nuno";
let ativo = true;
let nada = null;
let indefinido;
let idSimbolo = Symbol("id");
let inteiroGrande = 123n;

console.log(typeof numero);       // "number"
console.log(typeof nome);         // "string"
console.log(typeof ativo);        // "boolean"
console.log(typeof nada);         // "object" (peculiaridade histórica)
console.log(typeof indefinido);   // "undefined"
console.log(typeof idSimbolo);    // "symbol"
console.log(typeof inteiroGrande);// "bigint"

// NaN / Infinity
console.log(Number("abc"));       // NaN
console.log(Number.isNaN(NaN));   // true
console.log(isNaN("abc"));        // true (faz coerção; cuidado)
console.log(1 / 0);               // Infinity

// Truthy/falsy e igualdade
console.log(Boolean(""));         // false
console.log(Boolean("0"));        // true
console.log(Boolean([]));         // true
console.log(2 == "2");            // true  (coerção)
console.log(2 === "2");           // false (preferível)
```
