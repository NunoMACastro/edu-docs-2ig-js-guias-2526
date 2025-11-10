# [5] Estruturas de Controlo — Versão Didática (11.º ano)

> **Objetivo**: tomar decisões claras com `if`, `else`, `switch`, operadores lógicos e guard clauses sem cair em armadilhas de `truthy/falsy`.

---

## 0) Como o JavaScript decide?

Sempre que escreves `if (condicao)`, o motor converte o valor em **booleano**. Se for `true`, executa o bloco; caso contrário, ignora.

Valores falsy: `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Todo o resto é truthy.

---

## 1) `if / else if / else`

```js
const nota = 14;

if (nota >= 18) {
    console.log("Excelente");
} else if (nota >= 10) {
    console.log("Aprovado");
} else {
    console.log("Reprovado");
}
```

Boas práticas:

-   Usa `{}` mesmo em blocos curtos (evita erros quando adicionas linhas).
-   Divide condições complexas em variáveis auxiliares (`const maiorIdade = idade >= 18`).
-   Compara com `===` quando esperas valores específicos.

---

## 2) `switch` para muitos casos do mesmo valor

Perfeito quando compares um único valor com várias opções.

```js
const fruta = "maçã";
switch (fruta) {
    case "maçã":
    case "pera":
        console.log("Fruta comum");
        break; // impede que continue a executar os outros casos
    case "kiwi":
        console.log("Exótico");
        break;
    default:
        console.log("Outra fruta");
}
```

> Agrupa casos seguidos sem `break` para partilharem o mesmo resultado.

Quando precisas de intervalos, podes usar `switch(true)` como alternativa a vários `if/else`, mas mantém o código simples.

---

## 3) Lidar com `truthy` e `falsy`

Nunca uses apenas `if (valor)` se `0`, `""` ou `false` forem válidos nos teus dados.

```js
const paginas = 0;
const pagInseguro = paginas || 1; // dá 1, porque 0 é falsy
const pagSeguro = paginas ?? 1; // dá 0, porque só troca quando é null/undefined
```

Quando validas entradas, prefere verificações explícitas:

```js
if (valor === null || valor === undefined) {
    console.log("Valor em falta");
}
```

---

## 4) Guard clauses (saídas rápidas)

Evita criar escadas de `if` aninhados. Valida cedo e faz `return` quando algo não cumpre os requisitos.

```js
function classificarIdade(idade) {
    if (idade == null) return "Sem idade";
    if (typeof idade !== "number" || Number.isNaN(idade)) return "Não numérico";
    if (idade < 0) return "Idade inválida";
    if (idade < 18) return "Menor";
    return "Maior";
}
```

Lê-se como uma lista de regras, fácil de seguir.

---

## 5) Compor condições com `&&` e `||`

```js
const temAut = encarregado?.assinou === true;
const maior = idade >= 18;

if ((maior && escolaAberta) || (temAut && acompanhado)) {
    console.log("Pode entrar");
}
```

-   `&&` precisa que **tudo** seja verdadeiro.
-   `||` aceita que **pelo menos um** seja verdadeiro.
-   Usa parênteses para clarificar o agrupamento.

---

## 6) Ternário (quando devolver um valor)

```js
const nota = 18;
const conceito =
    nota >= 18 ? "Excelente" : nota >= 10 ? "Aprovado" : "Reprovado";
```

Dica: se o ternário tiver de fazer duas ou mais instruções, volta ao `if/else`. Vários ternários alinhados funcionam, mas usa quebras de linha para manter a leitura.

---

## 7) Exercícios

1. Constrói um programa que lê a média de um aluno e imprime "Excelente", "Aprovado" ou "Reprovado" usando `if/else if/else`. Depois reescreve com ternário.
2. Cria um `switch` que recebe o número do mês e devolve a estação do ano. Mostra exemplo com dois meses diferentes.
3. Pede duas notas via `prompt`, valida se são números e usa guard clauses numa função `classificarMedia` para devolver mensagens diferentes.
4. Implementa um programa que pede a temperatura da água e diz se está congelada, fria, morna, quente ou a ferver usando `if/else if` e depois com `switch(true)`.
5. Escreve `avaliarFormulario(campos)` que recebe um objeto com `nome`, `idade`, `email` e devolve a primeira mensagem de erro usando guard clauses.
6. Cria um `switch(true)` que classifica temperaturas: `<0`, `0-15`, `16-25`, `>25`. Relata resultados com `console.log`.
7. Simula um menu textual (`prompt`) onde o utilizador escolhe `1` para consultar saldo, `2` para depositar, `3` para sair. Usa `switch` e repete até escolher sair.

## Changelog

-   **v1.1.0 — 2025-11-10**
    -   Exercícios reformulados com sete propostas progressivas sobre decisões e guard clauses.
    -   Changelog introduzido para documentar atualizações no capítulo.
