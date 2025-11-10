# [7] Arrays (mutáveis vs imutáveis, métodos comuns)

## Teoria
- **Mutáveis**: `push, pop, shift, unshift, splice, sort (muta!)`.
- **Imutáveis**: `slice, concat, spread` criam cópias.
- **Desestruturação** e **spread** facilitam cópias/concat.

## Exemplos
```js
const A=[1,2,3];
A.push(4); A.pop(); A.splice(1,1,"X");    // mutáveis

const B=[3,1,2];
const C=B.slice().sort((a,b)=>a-b);       // cópia + ordenação

const base=[1,2];
const mais=[...base,3,4];
const [cabeca, ...resto]=[1,2,3,4];
```
