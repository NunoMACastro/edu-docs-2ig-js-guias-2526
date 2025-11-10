# [12] Módulos ES (import/export)

## Teoria
- Cada ficheiro é um **módulo ES** (ESM). `export` expõe, `import` consome.
- Em browser, `<script type="module">` é **deferred** por defeito.
- **Live bindings**: importações refletem atualizações do módulo origem.
- Suporta **top‑level await**.

## Exemplos
```js
// math.js
export const PI=3.14159;
export function soma(a,b){ return a+b; }
export default function quadrado(x){ return x*x; }

// main.js
import quadrado, { PI, soma as add } from "./math.js";
console.log(PI, add(2,3), quadrado(5));

// Dinâmico
const { default: quad, soma } = await import("./math.js");
console.log(quad(6), soma(7,8));
```
