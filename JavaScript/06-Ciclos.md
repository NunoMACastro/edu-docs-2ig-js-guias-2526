# [6] Ciclos — Versão Didática (11.º ano)

> **Objetivo**: repetir ações sem escrever o mesmo código várias vezes, escolhendo o ciclo certo (`for`, `while`, `for...of`, etc.) e evitando armadilhas como loops infinitos.

---

## 0) Qual ciclo escolher?

-   **`for` clássico** → precisas de um contador controlado (`i = 0; i < n; i++`).
-   **`while` / `do...while`** → tens apenas uma condição que decide se continuas.
-   **`for...of`** → percorres **valores** de arrays, strings, `Set`, `Map`…
-   **`for...in`** → percorre chaves de objetos (usa com cuidado).

---

## 1) `for` clássico

```js
for (let i = 0; i < 3; i++) {
    console.log(i); // 0, 1, 2
}
```

Boas práticas:

-   Usa `let` para o contador (escopo só dentro do ciclo).
-   Prefere `i < limite` a `i <= limite - 1`.
-   Se o limite não mudar, podes guardá-lo numa constante. Para exercícios simples não é necessário otimizar.

Armadilhas: `<=` quando querias `<`, ou esquecer de atualizar `i` (loop infinito).

---

## 2) `while` e `do...while`

```js
let tentativas = 0;
while (tentativas < 3) {
    tentativas++;
    // faz algo enquanto a condição for verdadeira
}

let numero;
do {
    numero = Number(prompt("Número positivo:"));
} while (Number.isNaN(numero) || numero <= 0);
```

-   `while` testa **antes** de entrar.
-   `do...while` executa pelo menos **uma vez** e testa no fim.

Certifica-te de que mudas a variável que participa na condição; caso contrário, o ciclo nunca termina.

---

## 3) `for...of` para percorrer valores

```js
const notas = [10, 12, 18];
for (const nota of notas) {
    console.log(nota);
}

for (const ch of "Olá") {
    console.log(ch); // "O", "l", "á"
}
```

Para ter índice e valor em arrays, usa `entries()`:

```js
for (const [indice, valor] of notas.entries()) {
    console.log(indice, valor);
}
```

Funciona também com `Map` e `Set`.

---

## 4) `break` e `continue`

-   `break` sai imediatamente do ciclo.
-   `continue` salta para a próxima iteração.

```js
for (let i = 0; i < 10; i++) {
    if (i === 3) continue; // ignora o 3
    if (i === 6) break; // termina quando chega ao 6
    console.log(i);
}
```

Usa `break` quando encontras o que procuravas e não precisas de continuar a percorrer.

---

## 5) `for...in` (objetos)

`for...in` percorre chaves enumeráveis **próprias e herdadas**. Usa-o apenas com objetos simples e confirma que a chave é realmente tua.

```js
const aluno = { nome: "Ana", nota: 18 };
for (const chave in aluno) {
    if (Object.prototype.hasOwnProperty.call(aluno, chave)) {
        console.log(chave, aluno[chave]);
    }
}
```

Alternativas modernas (mais seguras):

```js
Object.entries(aluno).forEach(([chave, valor]) => {
    console.log(chave, valor);
});
```

---

## 6) Padrões úteis

### Somar valores

```js
let soma = 0;
for (const nota of notas) {
    soma += nota;
}
const media = soma / notas.length;
```

### Encontrar o primeiro elemento que cumpre algo

```js
let primeiroPar = null;
for (const n of [5, 7, 8, 11]) {
    if (n % 2 === 0) {
        primeiroPar = n;
        break;
    }
}
```

### Construir novo array manualmente

```js
const orig = [1, 2, 3, 4, 5];
const paresDobrados = [];
for (const n of orig) {
    if (n % 2 === 0) paresDobrados.push(n * 2);
}
```

Isto ajuda a compreender o que `map`/`filter` fazem nos capítulos seguintes.

---

## 7) Mini desafios

1. Escreve um `for` decrescente que conta de 10 até 0 e imprime apenas múltiplos de 2.
2. Usa `while` para pedir uma palavra até o utilizador digitar "sair".
3. Percorre um objeto `aluno` e constrói uma string `"nome: Ana | nota: 18"` usando `Object.entries`.
