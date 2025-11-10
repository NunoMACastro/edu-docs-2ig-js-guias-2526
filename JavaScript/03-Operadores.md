# [3] Operadores Essenciais — Versão Didática (11.º ano)

> **Objetivo**: dominar as operações básicas de matemática, comparação e decisão em JavaScript usando uma linguagem clara e evitando armadilhas de coerção.

---

## 0) Dica geral

Quando a expressão ficar comprida, usa **parênteses** para mostrar a intenção. Torna o código mais legível e evita erros de precedência.

---

## 1) Aritmética do dia a dia

Operadores principais: `+`, `-`, `*`, `/`, `%` (resto), `**` (potência).

```js
5 + 2; // 7
5 - 2; // 3
5 * 2; // 10
5 / 2; // 2.5
7 % 3; // 1 (resto)
2 ** 3; // 8
```

Notas rápidas:

-   `+` também concatena strings: `"5" + 2` → `"52"`.
-   `-`, `*`, `/` obrigam a coerção numérica: `"5" - 1` → `4`.
-   Potência é **associativa à direita**: `2 ** 3 ** 2` = `2 ** (3 ** 2)`.
-   Para números negativos com potência, usa parênteses: `(-3) ** 2`.

Incrementos:

```js
let i = 0;
i += 1; // preferido (mais legível)
// ++i ou i++ também existem, mas evita em expressões complicadas.
```

---

## 2) Atribuição com açúcar sintático

-   `=, +=, -=, *=, /=, %=, **=`
-   Lógicos modernos:
    -   `||=` → só atribui se o valor atual for **falsy**.
    -   `&&=` → só atribui se o valor atual for **truthy**.
    -   `??=` → só atribui se for `null` ou `undefined`.

```js
let paginas = 0;
paginas ||= 1; // passa a 1 (0 é falsy)
let nome;
nome ??= "anónimo"; // undefined → "anónimo"
```

Usa `??=` quando quiseres preservar `0`, `""` e `false`.

---

## 3) Comparações (`<`, `>`, `===`, ...)

-   `===` e `!==` → comparação **estrita** (tipo + valor). Usa sempre que possível.
-   `==` e `!=` fazem coerção → evitamos.
-   Strings são comparadas alfabeticamente (`"Ana" < "Bruno"`).

```js
2 === "2"; // false
2 == "2"; // true (coerção) ← evita
"maçã" > "banana"; // false (ordem alfabética)
```

Para comparar números especiais:

```js
Number.isNaN(valor); // melhor forma de testar NaN
Object.is(-0, 0); // true se quiseres distinguir o sinal (curiosidade)
```

---

## 4) Lógicos (`&&`, `||`, `!`) e curto-circuito

-   `A && B` devolve o primeiro falsy ou, se ambos forem truthy, devolve `B`.
-   `A || B` devolve o primeiro truthy; caso contrário devolve `B`.
-   `!A` inverte um booleano.

```js
const nome = entrada || "anónimo"; // se entrada for falsy, usa "anónimo"
const paginas = entrada ?? 1; // preserva 0 e ""
condicao && fazAlgo(); // só chama se condicao for truthy
```

> Guarda resultados em variáveis com nomes claros (`temAutorizacao`, `temSaldo`) para manter condições legíveis.

---

## 5) Operador ternário

Sintaxe: `condicao ? valorSeVerdade : valorSeFalso`.

```js
const nota = 14;
const estado = nota >= 10 ? "Aprovado" : "Reprovado";
```

Ótimo para retornar um valor simples. Quando precisares de mais passos, volta ao bom e velho `if/else`.

---

## 6) Precedência (quem vem primeiro?)

1. Parênteses `()`
2. Potência `**`
3. Negação `!` e sinais `+`/`-` unários
4. Multiplicação/divisão/resto
5. Soma/subtração
6. Comparações
7. Lógicos `&&` → depois `||`
8. Ternário

Usa parênteses sempre que a expressão possa gerar dúvidas.

```js
2 + 3 * 4; // 14
(2 + 3) * 4; // 20
(a || b) && c; // força a tua ordem
```

---

## 7) Mini desafios

1. Qual o resultado de `"7" - 2` e porquê?
2. Escreve uma função que devolve "par" ou "ímpar" usando o operador `%` e um ternário.
3. Usa `??=` para preencher propriedades em falta num objeto `config` (`porta`, `host`).
