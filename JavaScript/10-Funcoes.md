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

Contar vogais numa palavra:

````js
function contarVogais(palavra) {
    if (palavra.length === 0) return 0;
    const primeira = palavra[0].toLowerCase();
    const resto = palavra.slice(1);
    const ehVogal = "aeiou".includes(primeira) ? 1 : 0;
    return ehVogal + contarVogais(resto);

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
````

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

## 9) Funções de Callback

Funções que são passadas como argumentos para outras funções.

Por exemplo, fazer uma função que recebe uma operação matemática como callback permite flexibilidade para executar diferentes cálculos sem alterar a função principal.

```js
function calcular(a, b, operacao) {
    return operacao(a, b);
}
const soma = (x, y) => x + y;
const produto = (x, y) => x * y;
console.log(calcular(4, 2, soma)); // 6
console.log(calcular(4, 2, produto)); // 8
```

## 8) Mini desafios

1. Escreve uma função `saudacao(nome, hora)` que devolve uma saudação diferente consoante a hora do dia (manhã, tarde, noite). Usa valores por defeito para `hora` (hora atual).
2. Cria uma função `contador(inicio)`que faz uma contagem decrescente desde o argumento `inicio` até 0, imprimindo cada número.
3. Cria uma função que recebe um array de números e diz quantos são pares e quantos são ímpares. Usa `for...of`.
4. Cria uma função que recebe um nome, uma idade e peso e devolve true se a pessoa poder doar sangue (idade entre 18 e 65 e peso ≥ 50kg) e false caso contrário.
5. Cria uma arrow `function` que recebe um array de strings e devolve um novo array com todas as strings em maiúsculas.
6. Cria uma função que recebe 2 números e um callback `operacao`. A função deve aplicar a operação aos dois números e devolver o resultado. Testa com operações de soma, subtração, multiplicação e divisão.
7. Cria uma função recursiva `contarVogais(palavra)` que conta o número de vogais numa palavra.

## Changelog

-   **v1.1.0 — 2025-11-10**
    -   Mini desafios ampliados com mais quatro propostas sobre closures e composição de funções.
    -   Changelog adicionado para acompanhar futuras melhorias do capítulo.

```

```
