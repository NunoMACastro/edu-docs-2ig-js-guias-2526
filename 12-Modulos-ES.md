# [12] Módulos ES (import/export, `type="module"`, default vs named, TLA, dinâmico)

> **Objetivo**: perceber **como separar código em ficheiros** que colaboram entre si de forma segura e organizada. Vais aprender a **exportar** e **importar** valores, quando usar **default** vs **named exports**, como usar módulos **no browser** e **no Node.js**, `top‑level await`, `import()` dinâmico e dicas para evitar erros comuns.

---

## 1) Porque módulos?

-   Ao crescer, um projeto precisa de **dividir** o código por ficheiros com **responsabilidades claras**.
-   **ES Modules (ESM)** é o **padrão oficial** do JavaScript para modularização.
-   Cada ficheiro é um **módulo** com **escopo próprio** (variáveis não “vazam” para o global).

**Vantagens**

-   Organização, reutilização, testes mais fáceis.
-   Carregamento seletivo (só o que precisas).
-   “**Live bindings**”: os importadores veem alterações aos valores exportados (quando aplicável).

---

## 2) Browser: como ativar módulos

No HTML, usa `<script type="module" src="main.js"></script>`:

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="pt-PT">
    <head>
        <meta charset="utf-8" />
        <title>ESM Demo</title>
    </head>
    <body>
        <h1>ES Modules</h1>
        <script type="module" src="./main.js"></script>
    </body>
</html>
```

**Notas importantes**

-   Scripts com `type="module"` são **deferidos por defeito** (correm depois do parse do HTML).
-   Usa **caminhos relativos** com extensão: `./utils/math.js` (o browser precisa da extensão).
-   Por razões de segurança, abrir `index.html` com `file://` pode causar erros de CORS. **Usa um servidor local** (ex.: VS Code **Live Server**) para evitar `Failed to load module script`.
-   Cada módulo tem `this === undefined` ao nível de topo (não é `window`).

---

## 3) Exportar e importar (o essencial)

### 3.1 Named exports (nomeados)

-   Podes exportar **vários** por ficheiro.
-   Ao importar, usas **chaves** com os mesmos nomes (ou `as` para alias).

```js
// math.js
export const PI = 3.14159;
export function soma(a, b) {
    return a + b;
}
export class Vetor {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
```

```js
// main.js
import { PI, soma, Vetor } from "./math.js";
console.log(PI, soma(2, 3), new Vetor(1, 2));
// alias
import { soma as add } from "./math.js";
```

### 3.2 Default export (predefinido)

-   **Um por ficheiro**.
-   Ao importar, **escolhes o nome** livremente (sem chaves).

```js
// cor.js
export default function hex(r, g, b) {
    return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
}
```

```js
// main.js
import hex from "./cor.js"; // nome à tua escolha
console.log(hex(255, 0, 128));
```

### 3.3 Misturar

Podes ter **default + named** no mesmo ficheiro:

```js
// strings.js
export default function title(s) {
    return s.trim().toUpperCase();
}
export const vogais = /[aeiouáéíóúâêîôûãõ]/i;
```

```js
import title, { vogais } from "./strings.js";
```

### 3.4 Re-exportar (barrel)

Cria um “ponto único” de importação:

```js
// utils/index.js  (barrel)
export * from "./math.js";
export { default as title } from "./strings.js";
```

```js
// main.js
import { PI, soma, title } from "./utils/index.js";
```

---

## 4) Live bindings (ligação viva)

Imports **não são cópias**; são **referências** ao valor exportado.

```js
// counter.js
export let n = 0;
export function inc() {
    n++;
}
```

```js
// main.js
import { n, inc } from "./counter.js";
console.log(n); // 0
inc();
console.log(n); // 1  (valor atualizado)
```

> Não podes **reatribuir** um import (`n = 5` dá erro). Quem pode alterar é o próprio módulo que exporta.

---

## 5) Top‑level await (TLA)

Em módulos, podes usar `await` **fora** de funções `async`. Útil para **bootstrapping**.

```js
// config.js
export const cfg = await fetch("./config.json").then((r) => r.json());
```

```js
// main.js
import { cfg } from "./config.js";
console.log("Config carregada:", cfg);
```

> O módulo **só conclui o carregamento** quando o `await` terminar, garantindo ordem correta.

---

## 6) Import dinâmico: `import()` (lazy loading)

Carrega um módulo **quando precisares** (devolve uma **Promise**).

```js
// main.js
document.querySelector("#btn-analise").addEventListener("click", async () => {
    const { analisar } = await import("./analise.js");
    analisar(); // módulo só é carregado agora
});
```

Usa‑o para **dividir** funcionalidades pesadas, poupando tempo de arranque.

---

## 7) Node.js: ESM vs CommonJS (CJS)

### 7.1 Ativar ESM no Node

-   Opção A: usa extensão **`.mjs`**.
-   Opção B: em `package.json`, define `"type": "module"` e usa `.js` como ESM.

```json
{
    "name": "demo",
    "type": "module"
}
```

Agora podes fazer:

```js
// main.js (ESM no Node)
import { readFile } from "node:fs/promises";
const txt = await readFile(new URL("./dados.txt", import.meta.url), "utf-8");
console.log(txt);
```

**Diferenças úteis no Node (ESM):**

-   Não existe `__filename`/`__dirname`; usa `import.meta.url` + `new URL(...)`.
-   `require` é CommonJS; em ESM usa sempre `import`.
-   Podes usar **top‑level await**.

### 7.2 CommonJS (histórico, ainda comum)

```js
// CJS
const fs = require("fs");
module.exports = {
    /* ... */
};
```

Em projetos novos, prefere **ESM**.

---

## 8) Erros comuns e como evitar

1. **“Cannot use import statement outside a module”**  
   → Estás a correr um ficheiro **sem** ESM ativado.

    - Browser: esqueceu‑se de `type="module"`? Caminho/servidor corretos?
    - Node: falta `.mjs` ou `"type": "module"`?

2. **“Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type…”**  
   → O servidor não está a servir `.js` com MIME type adequado. Usa um servidor local (Live Server, `vite`, `http-server`, etc.).

3. **Caminhos relativos errados**  
   → Em `import`, escreve sempre o caminho **a partir do módulo atual** (`./`, `../`) e com **extensão** no browser.

4. **Barrel circular**  
   → Re‑exports em cadeia podem criar **ciclos**. Se surgir `undefined`, quebra a cadeia e importa diretamente do ficheiro original.

5. **Misturar default e named confusamente**  
   → Lembra‑te: **default** sem chaves; **named** com chaves. Usa `as` para alias quando os nomes chocam.

---

## 9) Organização prática (sugestão para projetos escolares)

```
src/
  utils/
    math.js
    strings.js
    index.js        ← barrel (re-exporta)
  features/
    alunos/
      api.js
      ui.js
      index.js      ← barrel do “módulo alunos”
  main.js           ← ponto de entrada (importa o que precisa)
index.html
```

-   Cada pasta tem um **barrel** (`index.js`) para centralizar importações.
-   Evita **imports profundos** (`../../utils/math.js`) ao re‑exportar tudo o que for público no barrel.

---

## 10) Exemplos completos

### 10.1 Pacote `utils` com default + named

```js
// utils/math.js
export const PI = 3.14159;
export function soma(a, b) {
    return a + b;
}
export default function quadrado(x) {
    return x * x;
}
```

```js
// utils/strings.js
export function title(s) {
    return s.trim().toUpperCase();
}
export const isVogal = (ch) => /[aeiouáéíóúâêîôûãõ]/i.test(ch);
```

```js
// utils/index.js (barrel)
export * from "./math.js"; // PI, soma
export { default as quadrado } from "./math.js";
export * from "./strings.js"; // title, isVogal
```

```js
// main.js
import { PI, soma, quadrado, title } from "./utils/index.js";
console.log(PI, soma(2, 3), quadrado(4), title("  Olá  "));
```

### 10.2 `top‑level await` para configuração inicial

```js
// config.js
export const CFG = await fetch("./cfg.json").then((r) => r.json());
```

```js
// main.js
import { CFG } from "./config.js";
console.log("CFG pronta:", CFG);
```

### 10.3 `import()` dinâmico num evento

```js
// main.js
document.querySelector("#btn-mais").addEventListener("click", async () => {
    const modulo = await import("./mais-recursos.js");
    modulo.inicializar();
});
```

---

## 11) Exercícios

1. **Default + named**: cria `tempo.js` com `export default agora()` (devolve `Date.now()`) e `export function formatar(ms)` (devolve string `HH:MM`). Importa ambos e mostra no `console`.
2. **Barrel**: numa pasta `utils/`, cria `math.js` e `str.js`, e agrega tudo num `utils/index.js`. Importa só do barrel.
3. **Live binding**: em `contador.js`, exporta `let n=0` e `inc()`; demonstra em `main.js` que `n` muda após `inc()`.
4. **TLA**: carrega um JSON (`dados.json`) com `top‑level await` num módulo `dados.js` e imprime a contagem de itens em `main.js`.
5. **Dinâmico**: só quando o utilizador clica num botão, faz `import("./graficos.js")` e desenha um gráfico (pode ser `console.log` a simular).
6. **Node ESM**: cria um mini script Node com `"type":"module"` que lê um ficheiro `texto.txt` usando `fs/promises` e `import.meta.url` + `new URL`.

---

## 12) Resumo

-   No **browser**, usa `<script type="module">` e caminhos relativos com **extensão**. Corre num **servidor local**.
-   Usa **named exports** para múltiplos valores; **default** para o “principal” do ficheiro.
-   `top‑level await` simplifica bootstrapping; `import()` dinâmico permite **lazy load**.
-   No **Node**, ativa ESM com `.mjs` ou `"type":"module"`. Evita confusões com `require` (CJS).
-   Organiza pastas com **barrels** e evita caminhos profundos. Cuidado com **ciclos** e mensagens de erro comuns.
