# [6] Estruturas de Repetição (for, while, do...while, for...of, for...in)

> **Objetivo**: repetir ações de forma **controlada e previsível**. Vais aprender quando usar cada ciclo, diferenças entre eles, boas práticas para evitar _off‑by‑one_, e padrões frequentes (somar, procurar, filtrar, etc.).

---

## 1) `for` clássico — o contador de serviço

**Quando usar**: precisas de um **índice** que começa num valor e avança com um **passo** fixo (ou variável).

**Sintaxe geral**

```js
for (inicialização; condição; atualização) {
    // corpo do ciclo
}
```

**Exemplos**

```js
for (let i = 0; i < 3; i++) {
    // i: 0, 1, 2
}

for (let i = 10; i >= 0; i--) {
    // contagem decrescente
}

for (let i = 0; i < arr.length; i += 2) {
    // saltos de 2 em 2
}
```

**Boas práticas**

-   Usa **`let`** (escopo de bloco); evita `var`.
-   Preferir condição **`i < limite`** em vez de `<= limite-1` — mais claro.
-   Evita recalcular `arr.length` dentro do ciclo se a performance for crítica (guarda numa variável), mas para exercícios normais não é necessário otimizar.

**Armadilhas comuns**

-   **Off‑by‑one**: começar em 1 quando querias 0; usar `<=` em vez de `<`.
-   Alterar o array **enquanto** iteras por índice pode saltar elementos (cuidado com `splice`/`shift`).

---

## 2) `while` e `do...while` — “enquanto” e “faz pelo menos uma vez”

**Quando usar**: a **condição** é o fator principal (não tens um contador óbvio).

```js
let c = 0;
while (c < 3) {
    // testa ANTES de entrar
    c++;
}

let n = 0;
do {
    // executa PELO MENOS UMA vez e só depois testa
    n++;
} while (n < 1);
```

> Dica: garante que a condição **muda** dentro do ciclo e "caminha" para tornar a condição falsa, senão tens **loop infinito**.

---

## 3) `for...of` — valores de iteráveis

**Quando usar**: queres percorrer **valores** de um **iterável** (arrays, strings, `Map`, `Set`, `arguments`, `NodeList` …).

```js
const arr = [10, 20, 30];
for (const valor of arr) {
    // 10, 20, 30
}

for (const ch of "Olá") {
    // "O", "l", "á" (Unicode-friendly)
}
```

**Com índice** (arrays): usa `entries()`

```js
for (const [i, v] of arr.entries()) {
    // i = índice, v = valor
}
```

**Map e Set**

```js
const m = new Map([
    ["a", 1],
    ["b", 2],
]);
for (const [ch, v] of m) {
    /* ... */
}

const s = new Set([1, 2, 2, 3]);
for (const v of s) {
    /* 1,2,3 */
}
```

> Nota: objetos literais `{...}` **não são iteráveis** por defeito — ver secção 5.

---

## 4) `break` e `continue`

-   `break` sai do ciclo **imediatamente**.
-   `continue` **salta** para a próxima iteração.

```js
for (let i = 0; i < 10; i++) {
    if (i === 3) continue; // ignora 3
    if (i === 5) break; // termina no 5
    // ...
}
```

**Avançado (opcional)**: rótulos permitem `break` em ciclos aninhados.

```js
externo: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (i === j) break externo;
    }
}
```

---

## 5) `for...in` — chaves (propriedades enumeráveis)

**Quando usar**: percorrer **chaves** de um **objeto** (e só para isso). **Evita em arrays**: a ordem pode não ser a esperada.

```js
const obj = { a: 1, b: 2, c: 3 };
for (const chave in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, chave)) {
        console.log(chave, obj[chave]);
    }
}
```

**Alternativas modernas (mais claras)**

```js
Object.keys(obj).forEach((k) => {
    /* k */
});
Object.values(obj).forEach((v) => {
    /* v */
});
Object.entries(obj).forEach(([k, v]) => {
    /* k, v */
});

for (const [k, v] of Object.entries(obj)) {
    /* ... */
}
```

> `for...in` percorre **também** propriedades **herdadas**; por isso filtramos com `hasOwnProperty` quando necessário.

---

## 6) Padrões frequentes com ciclos

### 6.1 Somar e média

```js
const nums = [10, 20, 30];
let soma = 0;
for (const n of nums) soma += n;
const media = soma / nums.length;
```

### 6.2 Mínimo/Máximo

```js
let min = +Infinity,
    max = -Infinity;
for (const n of nums) {
    if (n < min) min = n;
    if (n > max) max = n;
}
```

### 6.3 Procurar o primeiro que cumpre a condição

```js
let encontrado;
for (const n of nums) {
    if (n % 2 === 0) {
        encontrado = n;
        break;
    }
}
```

### 6.4 Construir novo array (filtrar/mapear manualmente)

```js
const orig = [1, 2, 3, 4, 5];
const pares = [];
const dobrados = [];
for (const n of orig) {
    if (n % 2 === 0) pares.push(n);
    dobrados.push(n * 2);
}
```

> Em capítulos seguintes, verás `filter`, `map`, `find`… que simplificam estes padrões sem escreveres o ciclo manual.

### 6.5 Iterar objeto como tabela

```js
const aluno = { nome: "Ana", nota: 18, turma: "11.º IG" };
for (const [k, v] of Object.entries(aluno)) {
    console.log(`${k}: ${v}`);
}
```

### 6.6 Reverter string (atenção a Unicode)

```js
function inverterSeguro(s) {
    return Array.from(s).reverse().join("");
}
```

---

## 7) Complexidade e aninhados (noções)

-   Cada ciclo sobre `N` elementos custa **O(N)** (tempo proporcional a `N`).
-   Dois ciclos **aninhados** podem custar **O(N²)** — cresce rapidamente.
-   Otimiza **depois** de funcionar; primeiro escreve código **claro**.

---

## 8) Exercícios rápidos

1. **Somatório**: lê um número `n` e calcula `1 + 2 + ... + n` com `for` e com `while`.
2. **Tabuada** (1 a 10) para um número dado pelo utilizador, usando **do...while**.
3. **Maior valor**: dado `arr = [7,3,10,2,9]`, encontra mínimo e máximo com um único ciclo.
4. **Contar letras**: conta quantas vezes aparece `"a"` em `"banana"` (usa `for...of`).
5. **Contagem decrescente**: Pede um número ao utilizador, verifica se é positivo, e imprime a contagem decrescente até 0 usando o `while`, o `do...while` e o `for`.

---

## 9) Resumo

-   `for` clássico: quando precisas de **índice** e controlo total.
-   `while`/`do...while`: quando a **condição** manda (e “faz pelo menos uma vez”).
-   `for...of`: melhor forma de percorrer **valores** de iteráveis (arrays, strings, Map/Set).
-   `for...in`: para **chaves** de objetos (evita em arrays; confirma `hasOwnProperty`).
-   Lembra-te de `break`/`continue`, atenção a _off‑by‑one_, e dá prioridade a **clareza**.
