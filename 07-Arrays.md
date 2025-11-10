# [7] Arrays (mutáveis vs imutáveis, métodos comuns)

> **Objetivo**: dominar **estruturas de listas** em JavaScript — criar, ler, modificar, copiar sem efeitos colaterais e escolher o método certo para cada tarefa. No fim tens exercícios para praticar.

---

## 1) O que é um array?

-   Uma **lista ordenada** de valores (qualquer tipo: números, strings, objetos, arrays…).
-   Indexação **a partir de 0** (`arr[0]` é o primeiro).
-   Propriedade **`length`**: tamanho (atenção, pode ser alterada manualmente).

```js
const vazio = [];
const numeros = [1, 2, 3];
const misto = [1, "dois", true, { x: 10 }, [7, 8]];

console.log(numeros[0]); // 1
console.log(numeros.length); // 3
```

> **Igualdade**: `[] === []` é `false` (referências diferentes). Para comparar conteúdo, testa elemento a elemento. Senão estás a comparar referências, não valores.

---

## 2) Criar arrays de forma segura

-   **Literal**: `[]` (preferido).
-   **`Array.of(...)`**: cria array a partir de argumentos.
-   **`Array.from(iterável|objSemelhante, mapFn?)`**: copia/transforma iteráveis (string, Set, Map) **ou** objetos do tipo `{ length: N }`.

```js
const A = [1, 2, 3]; // literal (preferido)
Array.of(1, 2, 3); // [1,2,3]
Array.from("Olá"); // ["O","l","á"]
Array.from({ length: 5 }, (_, i) => i + 1); // [1,2,3,4,5]  (gerador simples)
```

---

## 3) Métodos **mutáveis** (alteram o original)

> Usa estes quando **queres** modificar o array. Para manter imutabilidade, vê a secção 4.

> Mutabilidade é a capacidade de um objeto de ser alterado após a sua criação. Em JavaScript, arrays são mutáveis por padrão, o que significa que podes adicionar, remover ou modificar elementos diretamente no array original.

-   **`push(...itens)`**: adiciona ao **fim** → devolve novo `length`
-   **`pop()`**: remove do **fim** → devolve o item removido
-   **`unshift(...itens)`**: adiciona ao **início**
-   **`shift()`**: remove do **início**
-   **`splice(início, deleteCount?, ...itens)`**: remove/substitui/insere em qualquer posição
-   **`sort(compareFn?)`**: **ordena** (por defeito, **lexicográfico** e **muta!**)
-   **`reverse()`**: inverte ordem (**muta!**)
-   **`fill(valor, início=0, fim=this.length)`**: preenche intervalo

```js
const A = [1, 2, 3];
A.push(4); // [1,2,3,4]
A.pop(); // [1,2,3]
A.unshift(0); // [0,1,2,3]
A.shift(); // [1,2,3]
A.splice(1, 1, "X"); // a partir do índice 1, remove 1 e insere "X" → [1,"X",3]

// sort/reverse mutam
const B = [3, 10, 2];
B.sort(); // ["10",2,3] em strings! (evita sem compareFn)
B.sort((a, b) => a - b); // [2,3,10] — numérico
B.reverse(); // [10,3,2]

// fill
const C = new Array(5).fill(0); // [0,0,0,0,0]
```

**Dica sobre `sort`**: para strings com acentos, usa `localeCompare` com `"pt"`:

```js
["Álvaro", "Ana", "Élio"].sort((a, b) => a.localeCompare(b, "pt"));
```

---

## 4) Métodos **imutáveis** (devolvem uma **cópia**)

> Preferidos quando queres **evitar efeitos colaterais** (bom para raciocínio e para UI reativa).
> O array original **não muda**.
> Imutabilidade é a propriedade de um objeto que impede que ele seja alterado após sua criação. Em JavaScript, arrays podem ser tratados como imutáveis ao usar métodos que retornam novos arrays em vez de modificar o array original.

-   **`slice(início=0, fimExcl=this.length)`**: recorta uma **cópia** (sem alterar o original)
-   **`concat(...arrsOuValores)`**: junta arrays/valores e devolve novo array
-   **`spread`** `[...]`: copia/concatena de forma expressiva
-   **(Moderno)** `toSorted(compareFn)`, `toReversed()`, `toSpliced(...)` — versões **não mutáveis** de `sort`/`reverse`/`splice` (Node 20+/browsers recentes)

```js
const B = [3, 1, 2];
const C = B.slice().sort((a, b) => a - b); // cópia + ordenação (B intacto)

const base = [1, 2];
const mais = [...base, 3, 4]; // [1,2,3,4]
const junto = base.concat([5, 6]); // [1,2,5,6]

// toSorted / toReversed (preferível quando disponível)
const ord = B.toSorted((a, b) => a - b); // B não muda
const inv = B.toReversed(); // B não muda
```

> **Compatibilidade**: se `toSorted`/`toReversed` não existirem, usa `slice()` + `sort()` / `slice()` + `reverse()` como acima.

---

## 5) Procurar, verificar e localizar

-   **`includes(valor, fromIdx=0)`** → `true/false`
-   **`indexOf(valor, fromIdx=0)`** / **`lastIndexOf(valor)`** → índice ou `-1`
-   **`find(fn)`** → primeiro elemento que passa no teste (ou `undefined`)
-   **`findIndex(fn)`** → índice do primeiro que passa (ou `-1`)
-   **`some(fn)`** → `true` se **algum** passa
-   **`every(fn)`** → `true` se **todos** passam

```js
const alunos = [
    { nome: "Ana", nota: 17 },
    { nome: "Bruno", nota: 9 },
    { nome: "Carla", nota: 14 },
];

alunos.some((a) => a.nota >= 18); // false
alunos.every((a) => a.nota >= 10); // false
alunos.find((a) => a.nota < 10); // {Bruno,9}
alunos.findIndex((a) => a.nome === "Carla"); // 2
["a", "b", "a"].lastIndexOf("a"); // 2
```

---

## 6) Transformar e reduzir (visão geral rápida)

> Verás em detalhe no capítulo de **funções de alto nível** (08-Arrays-HighOrder.md). Aqui fica a ideia.

-   **`map(fn)`** → transforma cada elemento e **devolve novo array**
-   **`filter(fn)`** → mantém os que passam no teste
-   **`reduce(fn, inicial)`** → acumula num único valor (soma, média, contagens…)
-   **`flat(n=1)`** → “achata” 1 nível (ou `n` níveis) de arrays aninhados
-   **`flatMap(fn)`** → `map` seguido de `flat(1)`

```js
const notas = [10, 18, 14];
const dobradas = notas.map((n) => n * 2); // [20, 36, 28]
const aprovadas = notas.filter((n) => n >= 10); // [10,18,14]
const soma = notas.reduce((acc, n) => acc + n, 0); // 42

[
    [1, 2],
    [3, [4]],
].flat(2); // [1,2,3,4]
["a", "b"].flatMap((ch) => [ch, ch.toUpperCase()]); // ["a","A","b","B"]
```

---

## 7) Desestruturação e rest/spread

-   **Desestruturação** tira elementos por posição.
-   **Rest** (`...resto`) apanha o “resto”.
-   **Spread** (`...arr`) **espalha** elementos numa nova lista.

```js
const [cabeca, ...resto] = [1, 2, 3, 4]; // cabeca=1, resto=[2,3,4]
const arr = [0, ...resto, 5]; // [0,2,3,4,5]
```

---

## 8) Armadilhas e boas práticas

-   `sort()` e `reverse()` **mutam** — copia antes se precisares do original.
-   `splice()` também **muta** — confirma índices/quantidades antes.
-   `length = N` **corta ou expande** com “buracos” (evita manipular `length` diretamente).
-   Não uses `for...in` em arrays (pode iterar propriedades herdadas e a ordem não é garantida). Usa `for`, `for...of` ou métodos de array.
-   Preferir **código imutável** quando fores partilhar arrays entre funções/componentes (mais fácil de raciocinar e testar).

---

## 9) Exemplos completos

### 9.1 Inserir, remover e substituir com `splice`

```js
const arr = [1, 2, 3, 4];
arr.splice(2, 1); // remove 1 a partir do índice 2 → [1,2,4]
arr.splice(1, 0, "X", "Y"); // insere sem remover → [1,"X","Y",2,4]
arr.splice(3, 1, 99); // substitui 1 elemento → [1,"X","Y",99,4]
```

### 9.2 Copiar e ordenar sem mutar

```js
const base = [3, 1, 2];
const ord = base.slice().sort((a, b) => a - b); // base intacto
// ou (moderno) base.toSorted((a,b)=>a-b);
```

### 9.3 Remover por condição (imutável)

```js
const semNulos = valores.filter((v) => v != null); // remove null/undefined
```

### 9.4 Agrupar por chave (contagem)

```js
const notas = [10, 18, 14, 10];
const contagem = notas.reduce((acc, n) => {
    acc[n] = (acc[n] || 0) + 1;
    return acc;
}, {}); // {10:2, 14:1, 18:1}
```

### 9.5 Comparar conteúdos de dois arrays (simples)

```js
function iguais(a, b) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
}
```

---

## 10) Exercícios rápidos

1. **Mutáveis**: começa com `[1,2,3]` e, usando **apenas** `push/pop/shift/unshift/splice`, transforma em `[0,1,"X",2,3,4]`.
2. **Imutáveis**: a partir de `[3,1,2]`, devolve uma versão **ordenada** sem tocar no original.
3. **Remover por condição**: cria `removeNegativos(arr)` que devolve novo array sem negativos.
4. **Primeiro ≥ 100**: devolve o **primeiro** elemento ≥ 100 (ou `null` se não existir).
5. **Flat**: transforma `[1,[2,[3]],4]` em `[1,2,3,4]`.
6. **Gerar sequência**: cria `range(n)` que devolve `[1,2,...,n]` usando `Array.from`.
7. **Agrupar**: a partir de `["maçã","pêra","maçã","uva","pêra"]`, devolve contagem por fruta.
8. **Ordenação PT**: ordena `["Élio","Álvaro","Ana"]` corretamente em pt-PT.
9. **Deep clone**: faz uma cópia profunda de `[{a:1},{b:2}]` e demonstra que alterar o original não altera a cópia.

---

**Resumo**: usa **mutáveis** quando queres alterar o array original, e **imutáveis** (`slice`, `concat`, `spread`, `toSorted`/`toReversed`) quando queres uma **nova versão**. Para procurar/validar, `includes/indexOf/find/findIndex/some/every`. Para transformar, `map/filter/reduce/flat/flatMap`. E lembra-te: **cópias normais são superficiais** — atenção a objetos dentro de arrays.
