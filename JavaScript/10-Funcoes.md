# [10] Funções — Versão Didática (11.º ano)

> **Objetivo**: criar funções claras, escolher a forma certa (declaração, expressão ou arrow), trabalhar com parâmetros, entender escopos/closures e saber quando usar `return` cedo.

---

## 0) Porque usar funções?

-   Agrupam passos que pertencem juntos.
-   Podem receber **parâmetros** e devolver **valores**.
-   Evitam repetir código e facilitam testes.

```js
function somar(a, b) {
    return a + b;
}
console.log(somar(2, 3)); // 5
```

---

## 1) Formas de declarar

### Declaração (Function Declaration)

-   Içada (podes chamar antes da linha em que está escrita).
-   Ótima para utilitários principais do ficheiro.

```js
saudar("Ana"); // funciona
function saudar(nome) {
    console.log(`Olá, ${nome}`);
}
```

### Expressão (Function Expression)

-   Guardada numa variável `const` ou `let`.
-   Só fica disponível depois da linha onde é criada.

```js
const dobro = function (n) {
    return n * 2;
};
```

### Arrow function (`=>`)

-   Sintaxe curta, ideal para callbacks.
-   Não cria `this` nem `arguments` próprios.

```js
const soma = (a, b) => a + b;
const triplo = (n) => {
    const resultado = n * 3;
    return resultado;
};
```

> Usa arrow para funções pequenas, especialmente dentro de `map`, `filter`, `then`, etc. Para métodos de objetos ou quando precisas de hoisting, fica com declaração/expressão.

---

## 2) Parâmetros e `return`

### Valores por defeito

```js
function saudar(nome = "aluno", prefixo = "Olá") {
    return `${prefixo}, ${nome}!`;
}
```

### `rest` (`...`)

```js
function somaTudo(...numeros) {
    return numeros.reduce((total, n) => total + n, 0);
}
```

### Desestruturação direta

```js
function mostrarAluno({ nome, nota = 0 }) {
    console.log(`${nome} tem ${nota}`);
}
```

### Guard clauses

```js
function dividir(a, b) {
    if (typeof a !== "number" || typeof b !== "number") return NaN;
    if (b === 0) return Infinity;
    return a / b;
}
```

---

## 3) Hoisting

-   Declarações de função ficam disponíveis em todo o escopo onde vivem.
-   `var` é içada mas inicializada com `undefined`.
-   `let/const` ficam na **TDZ** até à linha onde aparecem (não podes usar antes).

```js
hoisted(); // OK
function hoisted() {}

// console.log(valor); // ReferenceError (TDZ)
let valor = 5;
```

---

## 4) Escopo e closures

-   Cada função cria o seu próprio **escopo**.
-   Funções internas conseguem “lembrar-se” de variáveis externas → isto é um **closure**.

```js
function criarContador(inicial = 0) {
    let atual = inicial;
    return function () {
        atual++;
        return atual;
    };
}

const proximo = criarContador(10);
proximo(); // 11
proximo(); // 12 (continua a lembrar-se de "atual")
```

Armadilha clássica: usar `var` em ciclos com funções que correm mais tarde. Prefere `let` para ter uma cópia por iteração.

---

## 5) Recursão (quando uma função chama a si própria)

Usa em problemas que se dividem naturalmente em partes menores (fatorial, percorrer pastas, etc.). Precisamos sempre de um **caso base**.

```js
function fatorial(n) {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    return n * fatorial(n - 1);
}
```

---

## 6) Funções puras vs impuras

-   **Pura** → depende só dos argumentos, não altera nada fora dela.
-   **Impura** → escreve/usa algo externo (ficheiros, consola, rede, variáveis globais).

```js
const soma = (a, b) => a + b; // pura

let total = 0;
function adicionar(n) {
    total += n; // impura (depende de total)
}
```

Prefere funções puras sempre que possível: mais fáceis de testar e repetir.

---

## 7) `this` e arrow

Se precisares de `this`, usa funções normais.

```js
const conta = {
    saldo: 100,
    debitar(valor) {
        this.saldo -= valor;
    },
};
```

Arrow functions capturam o `this` exterior, portanto são ótimas para callbacks onde não queres um `this` novo.

---

## 8) Mini desafios

1. Escreve `criarTabuada(numero)` que devolve uma função. Essa função, quando chamada com `ate`, imprime a tabuada até esse limite.
2. Implementa `memoizar(fn)` simples: guarda o último resultado (`entrada → saída`) numa variável e volta a usá-lo.
3. Converte um conjunto de `function ...` tradicionais para arrow quando não precisarem de `this`.
