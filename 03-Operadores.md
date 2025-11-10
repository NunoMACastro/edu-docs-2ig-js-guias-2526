# [3] Operadores Essenciais

> **Objetivo**: dominar os operadores mais usados em JavaScript, perceber **o que fazem**, **quando usar**, e **armadilhas comuns**. Sempre que tiveres dúvida, usa **parênteses** para tornar a intenção clara.

---

## 1) Aritméticos `+ - * / % **` (+ unários e ++/--)

### Principais

-   `+` soma (ou concatena strings)
-   `-` subtração
-   `*` multiplicação
-   `/` divisão (atenção a `Infinity` e `NaN`)
-   `%` resto (em JS é _remainder_, pode ser **negativo**)
-   `**` potência (**associativo à direita**: `2 ** 3 ** 2` = `2 ** (3 ** 2)` = `512`)

### Unários e incremento

-   `++x`/`x++` (pré/pós‑incremento) e `--x`/`x--` (decremento). Prefere `x += 1` pela clareza.

```js
console.log(5 + 2);      // 7
console.log("5" + 2);    // "52" (concatenação) ← cuidado!
console.log(5 / 0);      // Infinity
console.log(-5 % 2);     // -1 (resto pode ser negativo)
console.log(2 ** 3 ** 2);// 512 (associativo à direita)

let x = 3;
console.log(++x); // 4 (pré: aumenta e devolve 4)
console.log(x++); // 4 (pós: devolve 4 e só depois x=5)
console.log(x);   // 5

// Atenção ao sinal com potência:
console.log(-3 ** 2);   // -9  → é igual a -(3 ** 2)
console.log((-3) ** 2); // 9   → parênteses mudam o resultado
```

**Boas práticas**: usa `Number(x)` para converter textos numéricos e `x += 1`/`x -= 1` em vez de `++/--` em expressões complexas.

---

## 2) Atribuição e formas úteis

-   Básico: `=, +=, -=, *=, /=, %=, **=`

    -   `+=` soma e atribui: `x += 2` é igual a `x = x + 2`
    -   idem para os outros (`-=` etc).

-   **Atribuição lógica** (muito útil com defaults):
    -   `||=` → atribui se o valor atual for **falsy**
    -   `&&=` → atribui se o valor atual for **truthy**
    -   `??=` → atribui se o valor atual for **null/undefined**

```js
let n = 0;
n ||= 10; // 0 é falsy → n passa a 10
let s = "";
s ??= "default"; // "" NÃO é null/undefined → mantém ""
let nome;
nome ??= "anónimo"; // undefined → passa a "anónimo"
```

> Dica: prefere `??=` a `||=` quando queres **preservar** `0`, `""` e `false` como valores válidos.

Também existe **atribuição por desestruturação** (adiantado para capítulos de arrays/objetos).

---

## 3) Comparação `> >= < <= == === != !==`

-   **Usa `===` e `!==`** por defeito (comparação **estrita**, sem coerção).
-   `==` e `!=` fazem **coerção** automática (evita: produz surpresas).
-   Strings com `>` `<` comparam **lexicograficamente** (ordem alfabética, "Z" < "a").
-   Objetos comparam por **referência**, não por conteúdo.

```js
console.log(3 > 2); // true
console.log("2" == 2); // true  (coerção)
console.log("2" === 2); // false (estrita)

// Casos especiais
console.log(NaN === NaN); // false
console.log(Object.is(NaN, NaN)); // true
console.log(Object.is(-0, 0)); // false (distingue -0 de 0)
```

**Ordenação de strings com acentos**: usa `localeCompare` com `"pt"`.

```js
["Álvaro", "Ana", "Élio"].sort((a, b) => a.localeCompare(b, "pt"));
```

---

## 4) Lógicos `&& || !` (curto‑circuito e retorno do _operando_)

-   `A && B`: se `A` for **falsy** → devolve `A`; senão devolve `B`.
-   `A || B`: se `A` for **truthy** → devolve `A`; senão devolve `B`.
-   `!A`: negação booleana.

```js
console.log(true && "ok"); // "ok"
console.log(false && "ok"); // false
console.log("" || "vazio"); // "vazio"
console.log("texto" || "x"); // "texto"
console.log(!0); // true
```

**Padrões comuns**

```js
// default "à antiga" (cuidado com 0/""):
const pag = entrada || 1; // se entrada for "", 0 ou null → 1

// default robusto (preserva 0 e ""):
const pag2 = entrada ?? 1;

// execução condicional
condicao && fazAlgo(); // só chama se condicao for truthy
```

---

## 5) Ternário `cond ? a : b` (quando e como)

-   Bom para **escolhas simples**. Lê-se: “se cond então A senão B”.
-   Evita **ternários aninhados** — usa `if/else` quando a lógica cresce.

```js
const nota = 14;
const estado = nota >= 10 ? "Aprovado" : "Reprovado";
```

> Dica: se precisares de **efeitos colaterais** (várias linhas), é sinal de que o `if/else` fica mais claro.

---

## 6) Precedência e parênteses (regra de ouro)

-   Potência `**` > multiplicação/divisão > soma/subtração.
-   Unário `-x` aplica-se **antes** da potência como negação do resultado (`-3 ** 2` → `-(3**2)`).
-   `&&` tem precedência sobre `||`.
-   **Quando a leitura não é óbvia, usa parênteses.**

```js
console.log(2 + 3 * 4); // 14
console.log((2 + 3) * 4); // 20
console.log(a || (b && c)); // avalia b&&c primeiro
console.log((a || b) && c); // força outra ordem
```

---

## 7) Exercícios rápidos

1. Calcula `resultado` para cada linha e explica porquê:
    - `2 + 3 * 4`
    - `(-3) ** 2`
    - `-3 ** 2`
    - `"5" + 1`
    - `"5" - 1`

---

**Resumo**: usa `===`, `??` para defaults seguros, `?.` para acesso seguro, e **parênteses** para claridade. Evita `==` e ternários aninhados complexos.
