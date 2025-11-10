# [4] Strings (imutabilidade, métodos, templates)

## Teoria
- **Imutáveis**: métodos retornam **novas** strings.
- Métodos úteis: `length, toUpperCase, toLowerCase, trim, includes, indexOf, slice, substring, replace, startsWith, endsWith`.
- **Template literals** (crases) para interpolação e multilinha.

## Exemplos
```js
const s = "   JavaScript   ";
console.log(s.length);           // 16
console.log(s.trim());           // "JavaScript"
console.log("abc".includes("b"));// true
console.log("banana".slice(1,3));// "an"

const a=5, b=7;
console.log(`A soma de ${a} + ${b} = ${a+b}`);
```
