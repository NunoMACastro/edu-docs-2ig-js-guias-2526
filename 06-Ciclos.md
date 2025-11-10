# [6] Estruturas de Repetição (for, while, do...while, for...of, for...in)

## Teoria
- `for` clássico para contadores.
- `while`/`do...while` quando a condição manda.
- `for...of` para **valores** de iteráveis; `for...in` para **chaves** (objetos).

## Exemplos
```js
for (let i=0;i<3;i++) { /* ... */ }

let c=0; while(c<3){ c++; }
let n=0; do { n++; } while(n<1);

const arr=[10,20,30];
for (const v of arr) { /* valores */ }

const obj={a:1,b:2};
for (const k in obj) { /* chaves */ }
```
