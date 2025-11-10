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
const conceito = nota >= 18 ? "Excelente" : nota >= 10 ? "Aprovado" : "Reprovado";
```

Dica: se o ternário tiver de fazer duas ou mais instruções, volta ao `if/else`. Vários ternários alinhados funcionam, mas usa quebras de linha para manter a leitura.

---

## 7) Mini desafios

1. Reescreve um bloco `if` com três níveis de indentação usando guard clauses.
2. Usa `switch` para mostrar o nome do mês a partir de um número (1–12).
3. Pergunta duas notas, calcula a média e classifica com ternário.
