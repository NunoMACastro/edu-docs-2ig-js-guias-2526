# Guias de JavaScript — 11.º IG

Este repositório reúne **apontamentos práticos** para as aulas de Programação (JavaScript). São guias de **consulta rápida** com teoria sucinta e exemplos curtos, pensados para acompanhar a prática.

---

## Como usar
1. **Lê o capítulo em Markdown** diretamente no GitHub para rever a teoria.
2. **Experimenta o código** no DevTools do browser (Consola) ou em Node.js.
3. Mantém estes guias abertos enquanto praticas: são o teu **apoio de secretária**.

> Dica: começa pelo **Básico** e avança para o **Intermédio** quando te sentires confiante.

---

## Conteúdos

### 01_Guia_js_Basico.md
Guia de **introdução ao JavaScript**. Cobre, de forma direta:

- Variáveis (`let`, `const`) e tipos primitivos
- Operadores e regras de truthy/falsy
- Strings e *template literals*
- Estruturas de controlo (`if`, `switch`) e repetição (`for`, `while`, `for...of`)
- Arrays e métodos essenciais (`map`, `filter`, `reduce`, …)
- Objetos e noções de `this`
- Exceções (`try/catch/throw`)
- Funções (declaração, expressão, arrow, parâmetros, closures)

**Capítulos (Básico):**
- [01 — Variáveis, Tipos e Conceitos](./guias-js-md/01-Variaveis-Tipos.md)
- [02 — Input/Output Básico](./guias-js-md/02-IO-Basico.md)
- [03 — Operadores Essenciais](./guias-js-md/03-Operadores.md)
- [04 — Strings](./guias-js-md/04-Strings.md)
- [05 — Estruturas de Controlo](./guias-js-md/05-Controlo-Fluxo.md)
- [06 — Estruturas de Repetição](./guias-js-md/06-Ciclos.md)
- [07 — Arrays](./guias-js-md/07-Arrays.md)
- [08 — Funções de Alto Nível em Arrays](./guias-js-md/08-Arrays-HighOrder.md)
- [09 — Objetos e noção de `this`](./guias-js-md/09-Objetos-e-this.md)
- [10 — Exceções](./guias-js-md/10-Excecoes.md)
- [11 — Funções](./guias-js-md/11-Funcoes.md)

---

### 02_Guia_js_Intermedio.md
Guia **intermédio** para quem já domina o básico. Inclui:

- **ES Modules** (`import/export`, top‑level `await`)
- **Classes/OOP** modernas (`constructor`, `get/set`, `#privado`, `static`, herança)
- **Assíncrono** (Promises, `async/await`, microtasks vs tasks)
- **DOM** (seletores, criação/injeção, classes, eventos, delegação, formulários)
- **Fetch/AJAX** (GET/POST JSON, erros, `AbortController`/timeout, upload com `FormData`)
- Extras úteis no browser: `URLSearchParams`, History API, `IntersectionObserver`, `Intl`, notas rápidas de A11y/Segurança/Performance

**Capítulos (Intermédio):**
- [12 — Módulos ES](./guias-js-md/12-Modulos-ES.md)
- [13 — Classes e OOP Moderno](./guias-js-md/13-POO-Classes.md)
- [14 — Assíncrono e Event Loop](./guias-js-md/14-Assincrono-EventLoop.md)
- [15 — DOM Básico](./guias-js-md/15-DOM-Basico.md)
- [16 — Fetch / AJAX](./guias-js-md/16-Fetch-AJAX.md)
- [17 — Outros Tópicos Úteis](./guias-js-md/17-Outros-Topicos.md)

---

## Sugestão de estudo
- **Sessão 1–2**: Capítulos 01–06 (fundamentos, fluxo e ciclos).
- **Sessão 3**: Capítulos 07–09 (arrays e objetos).
- **Sessão 4**: Capítulos 10–11 (exceções e funções/closures).
- **Sessão 5–6**: Capítulos 12–17 (módulos, OOP, assíncrono e browser).

---

## Como correr exemplos (opcional)
- **Node.js** (terminal): `node ficheiro.js`
- **Browser**: abre os DevTools → separador **Console** e cola os snippets.

---

## Notas
- Os guias focam **JS moderno (ES6+)**.
- Alguns tópicos são **resumos operacionais**; para estudo aprofundado, consulta a MDN.

---

Boa prática e bons projetos!
