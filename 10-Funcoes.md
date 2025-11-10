# [11] Funções (declaração, expressão, arrow, parâmetros, hoisting, scope, closures, `this`)

> **Objetivo**: escrever funções **claras e seguras**, escolhendo a forma certa (declaração/expressão/arrow), dominando **parâmetros**, **retornos**, **hoisting**, **escopos**, **closures** e o papel de **`this`**.

---

## 1) O que é uma função? (e porquê usar)

-   Uma **função** é um bloco reutilizável de código que recebe **parâmetros**, executa uma **tarefa** e devolve (ou não) um **valor**.
-   Ajuda a **organizar**, **reutilizar**, **testar** e **isolar** lógica.
-   Regras de ouro: 1 função → 1 responsabilidade; nomes **claros**; entradas/saídas bem definidas.

---

## 2) Três formas de definir funções

### 2.1 Declaração de função (Function Declaration)

-   **Içada** (“**hoisted**”): podes chamá‑la **antes** no código.
-   Boa para **utilitários** “globais” do módulo.

```js
console.log(somar(2, 3)); // 5 — funciona antes da declaração
function somar(a, b) {
    return a + b;
}
```

### 2.2 Expressão de função (Function Expression)

-   A função é criada e **atribuída** a uma variável/const.
-   **Não** podes usá‑la antes da linha onde é definida.

```js
// somarExp(2,3); // ERRO se descomentares (ainda não definida aqui)
const somarExp = function (a, b) {
    return a + b;
};

// Mas agora funciona:
console.log(somarExp(2, 3)); // 5
```

### 2.3 Arrow function (`=>`)

-   Sintaxe curta; **não** tem `this`/`arguments` próprios (herda do exterior).
-   Excelente para **callbacks** e funções curtas. Evita como **métodos** que usam `this` dinâmico.

```js
const somarArrow = (a, b) => a + b; // retorno implícito
const dobro = (n) => n * 2; // 1 parâmetro → sem parênteses
const f = (a, b) => {
    // bloco → usa 'return'
    const x = a + b;
    return x * 2;
};
```

**Quando usar o quê?**

-   **Declaração**: utilitários do módulo, quando o hoisting te simplifica a organização.
-   **Expressão**: quando queres controlar a **ordem** e usar como **valor** (passar/retornar funções).
-   **Arrow**: callbacks (p.ex., `map`, `filter`, `then`), funções curtas sem `this` dinâmico.

---

## 3) Parâmetros e retorno (Complexo)

### 3.1 Defaults (valores por defeito)

```js
function saudar(nome = "aluno", prefixo = "Olá") {
    return `${prefixo}, ${nome}!`;
}
```

### 3.2 `rest` (`...`) — número variável de argumentos

```js
function somaTudo(...nums) {
    return nums.reduce((acc, n) => acc + n, 0);
}
```

### 3.3 Desestruturação em parâmetros

```js
function imprimirAluno({ nome, nota = 0 }) {
    console.log(`${nome} tem ${nota}`);
}
imprimirAluno({ nome: "Ana", nota: 18 });
```

### 3.4 `return` e saídas rápidas (guard clauses)

```js
function dividir(a, b) {
    if (typeof a !== "number" || typeof b !== "number") return NaN;
    if (b === 0) return Infinity; // ou lançar erro; depende do contrato
    return a / b;
}
```

---

## 4) Hoisting (comportamento de “elevação”)

> **Definição didática**: _hoisting_ é a fase em que o motor JS **regista declarações** antes de executar o código.
>
> -   **Declarações de função** ficam totalmente disponíveis em todo o escopo.
> -   **`var`** é içada como **declaração** e inicializada a `undefined`.
> -   **`let/const`** **não** ficam utilizáveis antes da linha — entram na **TDZ** (_Temporal Dead Zone_).
> -   **Expressões/arrow** em `let/const` **não** são içadas como valor (só o nome, sujeito à TDZ).

```js
hoisted(); // OK
function hoisted() {}

console.log(y); // undefined (var é içada)
var y = 5;
```

---

## 5) Escopo (scope) e `closure` (fecho)

### 5.1 Tipos de escopo

-   **Global**: visível em todo o ficheiro (ou `window` no browser).
-   **Função**: cada função cria o seu próprio escopo.
-   **Bloco `{}`**: `let/const` vivem só dentro do bloco (if/for/while).

```js
if (true) {
    let local = 1; // só aqui dentro
}
// console.log(local); // ERRO
```

### 5.2 Closures — função “lembra‑se” do ambiente

-   Uma função **capta** variáveis do seu **contexto de criação** e mantém‑nas vivas.

```js
function criarContador(inicial = 0) {
    let valor = inicial; // variável privada
    return function () {
        // função interna “lembra‑se” de valor
        valor++;
        return valor;
    };
}
const proximo = criarContador(10);
proximo(); // 11
proximo(); // 12
```

**Armadilha clássica**: `var` num `for` partilha a mesma variável; usa `let`.

```js
// ERRADO (var): todas fecham sobre a mesma i
// for (var i=0; i<3; i++) setTimeout(()=>console.log(i), 0); // 3,3,3
// CERTO (let): cria uma i por iteração
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i), 0); // 0,1,2
```

---

## 6) Recursão (quando a função chama a si própria)

Boa para problemas que se definem **indutivamente** (árvores, fatorial, percursos). Usa sempre um **caso base**.

```js
function fatorial(n) {
    if (n < 0) return NaN;
    if (n === 0) return 1; // caso base
    return n * fatorial(n - 1); // passo recursivo
}
```

---

## 7) Puras vs impuras (efeitos colaterais)

-   **Pura**: depende só dos argumentos; não altera nada fora; o mesmo input → mesmo output.
-   **Impura**: lê/escreve estado externo, I/O, `Date.now()`, `Math.random()`, etc.
-   Preferir funções **puras** onde possível (mais previsíveis e testáveis).

```js
// Pura
const soma = (a, b) => a + b;
// Impura
let total = 0;
function adicionar(n) {
    total += n;
}
```

---

## 8) Exercícios

1. **Tipos de definição**: cria `max3(a,b,c)` como declaração; `min3` como expressão; `media3` como arrow.
2. **Defaults e rest**: escreve `formata(nome="aluno", ...tags)` que devolve uma string `"nome [tag1, tag2]"` (ou sem tags).
3. **Desestruturação**: `imprimir({nome,nota=0,turma="?"})` que imprime frase com defaults.
4. **Hoisting**: demonstra (num snippet) uma chamada que funciona com declaração e falha com expressão/arrow em `let`.
5. **Closures**: `criarContador(inicial)` que devolve `{ inc, get }` mantendo `valor` privado.
6. **`this`**: mostra por que `obj.arrow()` falha se `arrow` foi definida como arrow no literal, e corrige para método normal.
7. **Recursão**: escreve `sumRange(n)` que soma de `1` a `n` recursivamente (com caso base).
8. **Pura vs impura**: dá 2 exemplos de funções impuras e reescreve‑as para versões puras quando possível.

---

## 9) Resumo

-   Escolhe **declaração/expressão/arrow** conforme a necessidade (hoisting, ordem, `this`).
-   Usa **defaults**, **rest** e **desestruturação** para interfaces limpas.
-   Entende **hoisting**, **TDZ**, **escopos** e **closures** para evitar armadilhas.
-   **Arrow** é ótima para callbacks; **métodos** que usam `this` devem ser **funções normais**.
-   Prefere funções **puras** e sai cedo com **guard clauses** para código mais legível.
