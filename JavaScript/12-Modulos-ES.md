# [12] Módulos ES — Versão Didática (11.º ano)

> **Objetivo**: dividir o código por ficheiros (`módulos`), exportar valores e importá-los noutros sítios, percebendo a diferença entre `default` e `named` exports tanto no browser como em Node.js.

---

## 0) Porque módulos?

-   Separas responsabilidades (ex.: `math.js`, `alunos.js`).
-   Evitas poluir o escopo global.
-   Facilita testes e reutilização.

Cada ficheiro com `import` ou `export` passa a ser um módulo com o seu próprio escopo.

---

## 1) Browser: ativar módulos

No HTML usa `type="module"`:

```html
<script type="module" src="./main.js"></script>
```

Notas importantes:

-   Os módulos são carregados de forma assíncrona (como se tivessem `defer`).
-   Usa caminhos relativos com extensão (`./utils/math.js`).
-   Abre o projeto via servidor local (Live Server, Vite, etc.) para evitar erros de CORS ao usar `file://`.

---

## 2) Exportar e importar

### Named exports

```js
// math.js
export const PI = 3.14159;
export function soma(a, b) {
    return a + b;
}
```

```js
// main.js
import { PI, soma } from "./math.js";
```

Podes renomear ao importar: `import { soma as somar } from "./math.js";`.

### Default export

```js
// cores.js
export default function hex(r, g, b) {
    return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}
```

```js
// main.js
import paraHex from "./cores.js"; // nome à tua escolha
```

### Misturar default + named

```js
// texto.js
export default function title(s) {
    return s.trim().toUpperCase();
}
export const vogais = /[aeiouáéíóúãõ]/i;
```

```js
import title, { vogais } from "./texto.js";
```

### Re-exportar (barrel)

```js
// utils/index.js
export * from "./math.js";
export { default as title } from "./texto.js";
```

---

## 3) Live bindings

Imports não são cópias; apontam para o valor exportado.

```js
// contador.js
export let total = 0;
export function inc() {
    total++;
}
```

```js
// main.js
import { total, inc } from "./contador.js";
console.log(total); // 0
inc();
console.log(total); // 1 (reflete a atualização)
```

Não podes fazer `total = 5` fora do módulo original — só o ficheiro que exporta é que pode reatribuir.

---

## 4) Top-level `await`

Dentro de módulos podes usar `await` sem estar numa função `async`.

```js
// config.js
export const cfg = await fetch("./config.json").then((resp) => resp.json());
```

O módulo que importar `cfg` só corre depois de a Promise terminar, garantindo ordem correta de carregamento.

---

## 5) `import()` dinâmico

Carrega módulos apenas quando precisares (retorna uma Promise).

```js
const btn = document.querySelector("#btn-relatorio");
btn.addEventListener("click", async () => {
    const modulo = await import("./relatorio.js");
    modulo.gerar();
});
```

Ótimo para funcionalidades pesadas que não precisas no arranque.

---

## 6) Node.js: ESM vs CommonJS

### Ativar ESM

-   Define `"type": "module"` no `package.json`, **ou** usa extensão `.mjs`.

```json
{
    "name": "aulas",
    "type": "module"
}
```

Depois podes escrever:

```js
import fs from "node:fs";
export function lerFicheiro(...) { ... }
```

Se precisares de importar código CommonJS (`module.exports`), usa `createRequire` ou troca o projeto inteiro para ESM para evitar mistura.

### Caminhos relativos

No Node moderno podes usar `import dados from "./dados.json" assert { type: "json" };` (opcional). Mantém caminhos explícitos (`./`, `../`).

---

## 7) Boas práticas

-   Cada módulo deve ter uma responsabilidade clara.
-   Evita defaults quando exportas muitas coisas do mesmo ficheiro — `named exports` tornam o autocompletar mais fácil.
-   Usa index/barrel apenas quando realmente simplifica (demasiadas camadas podem confundir).
-   Documenta no topo do ficheiro o que ele expõe (`// Exporta: getAluno, salvarAluno`).

## 8) Mini desafios

1. Cria `alunos.js` com `export const alunos = [...]` e `export function media()`; em `main.js`, importa ambos e mostra a média na consola.
2. Faz `cores.js` com um `export default function hex(r, g, b)` e usa-o noutro ficheiro para gerar `#FFA500`.
3. Cria `strings.js` com `export function title(texto)` e `export const vogais`. Depois cria `utils/index.js` que reexporta tudo para poderes importar de um único sítio.
4. No browser, adiciona um botão “Ajuda”. Ao clicar, carrega o módulo `./ajuda.js` com `import()` dinâmico e mostra um `alert` com a mensagem exportada.
5. Cria `config.js` com `export const cfg = { api: "https://exemplo.test" }` e usa-o noutro módulo para montar URLs.
6. Usa `top-level await` num módulo `dados.js` apenas para fazer `await Promise.resolve({ total: 42 })` e exporta o resultado. Importa-o em `main.js` e mostra no `console`.
7. Reescreve um ficheiro que tinha `export default` para passar a exportar vários valores nomeados e ajusta o import respetivo.

## Changelog

-   **v1.2.0 — 2025-11-10**
    -   Mini desafios simplificados e agora focados em cenários de browser (sem Node CLI).
-   **v1.1.0 — 2025-11-10**
    -   Separação entre boas práticas e mini desafios, com quatro novos desafios avançados.
    -   Changelog adicionado para registar alterações ao capítulo.
