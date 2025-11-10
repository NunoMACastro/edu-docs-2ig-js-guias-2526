# [8] Funções de Alto Nível em Arrays (map, filter, reduce, find, …)

> **Objetivo**: usar funções que **iteram por ti** e devolvem resultados de forma **clara, expressiva e (normalmente) imutável**. Vais aprender a escolher a função certa, evitar armadilhas e encadear operações com segurança.

---

## 1) O que são “funções de alto nível” (HOF)?

-   São **métodos** do `Array` que recebem **callbacks** (funções passadas como argumento) para **transformar**, **selecionar**, **agregar** ou **procurar** dados.
-   Normalmente **não precisas escrever o ciclo manual** — o método faz isso internamente.
-   Vantagem: **menos código**, **sem efeitos colaterais** se escreveres callbacks **puras** (não alteram o exterior).

**Assinaturas úteis (forma simplificada)**

```js
arr.map((item, index, array) => novoItem);
arr.filter((item, index, array) => boolean);
arr.reduce((acc, item, index, array) => novoAcc, valorInicial);
arr.find((item, index, array) => boolean); // 1.º que passa (ou undefined)
arr.findIndex((item, index, array) => boolean); // índice (ou -1)
arr.some((item) => boolean); // algum cumpre?
arr.every((item) => boolean); // todos cumprem?
arr.flat((n = 1)); // achatar n níveis
arr.flatMap((item) => arrayOuItem); // map + flat(1)
arr.forEach((item, index, array) => {
    efeito;
}); // só efeitos (não retorna)
```

> **Importante**: `map`, `filter`, `reduce`, `find`, `some`, `every`, `flat`, `flatMap` devolvem **novos valores** sem alterar o original (exceto se a tua callback **mutar** os itens!). `forEach` **não** devolve — usa-se apenas para **efeitos colaterais** (ex.: `console.log`, escrever no DOM).

---

## 2) `map` — transformar cada elemento

-   Aplica a callback a **cada item** e devolve um **novo array** com os resultados.
-   Não altere o original (**imutável**).

```js
const notas = [10, 18, 14];
const dobradas = notas.map((n) => n * 2); // [20, 36, 28]
// O que fizeste: para cada n em notas, calculaste n*2 e puseste no novo array
```

**Dicas**

-   Usa nomes claros na callback (`aluno => aluno.nota`).
-   **Anti‑padrão**: usar `map` e ignorar o retorno (nesse caso, era `forEach`).

---

## 3) `filter` — manter apenas os que passam no teste

-   Devolve **novo array** com os itens para os quais a callback devolve `true`.

```js
const notas = [10, 18, 14, 9];
const aprovadas = notas.filter((n) => n >= 10); // [10,18,14]
// O que fizeste: para cada n em notas, se n>=10, mantiveste n no novo array
```

**Dicas**

-   Usa bem os operadores: `>=`, `!==`, `includes`, etc.
-   Filtragem por “existência”:

```js
const semNulos = valores.filter((v) => v != null); // remove null/undefined
```

---

## 4) `reduce` — acumular num único valor

-   Percorre o array e **acumula** num valor (`acc`) usando a callback.
-   **Sempre** passa um **`valorInicial`** (evita armadilhas com arrays vazios).

```js
const notas = [10, 18, 14];
const soma = notas.reduce((acc, n) => acc + n, 0); // 42
const media = notas.length ? soma / notas.length : 0;
// O que fizeste: começaste em 0 e para cada n somaste a acc
```

---

## 5) `find` / `findIndex` — procurar o primeiro

-   `find` devolve o **primeiro elemento** que cumpre a condição (ou `undefined`).
-   `findIndex` devolve o **índice** (ou `-1`).

```js
const lista = [5, 12, 8, 130, 44];
const primeiroGrande = lista.find((n) => n > 10); // 12
const indiceGrande = lista.findIndex((n) => n > 10); // 1
```

> **Dica**: para “existe ou não”, considera `some`/`every` (abaixo).

---

## 6) `some` / `every` — testes de existência

-   `some(fn)` → `true` se **algum** item passar no teste.
-   `every(fn)` → `true` se **todos** passarem.

```js
const notas = [10, 18, 14];
notas.some((n) => n >= 18); // true
notas.every((n) => n >= 10); // true
```

---

## 7) `flat` e `flatMap` — achatar e transformar

-   `flat(n=1)` “achata” `n` níveis de arrays aninhados.
-   `flatMap(fn)` é `map` seguido de `flat(1)` (muito útil para **explodir** elementos).

```js
[
    [1, 2],
    [3, [4]],
].flat(2); // [1,2,3,4]

["a", "b"].flatMap((ch) => [ch, ch.toUpperCase()]);
// ["a","A","b","B"]
```

---

## 8) `forEach` — apenas efeitos colaterais

-   Executa a callback para cada item, **não devolve** nada.
-   Usa quando precisas **fazer algo** (ex.: `console.log`, alterar o DOM).

```js
alunos.forEach((a) => console.log(a.nome));
```

> **Regra de ouro**: se queres **novo array**, usa `map`/`filter`; se queres apenas **fazer algo**, `forEach`.

---

## 9) Encadear (chaining) com clareza

Podes encadear várias funções de alto nível.
Encadeia operações de forma **legível**; quebra por linhas e nomeia variáveis intermédias quando necessário.

```js
const mediaAprovados = alunos
    .filter((a) => a.nota >= 10)
    .map((a) => a.nota)
    .reduce((acc, n, _, arr) => acc + n / arr.length, 0);
```

**Performance**: encadear cria arrays intermédios (`filter` + `map`). Para N pequeno/médio (aulas e prática), **otimiza só se precisares**. Quando necessário, podes fazer tudo num único `reduce` — mas **só** se não prejudicar a leitura.

---

## 10) Exercícios rápidos

1. **Dobrar e filtrar**: a partir de `[1,2,3,4,5]`, devolve os **pares** já **dobrados** (usa encadeamento).
2. **Média de aprovados**: com `[{nome,nota}]`, calcula a média **apenas** dos que têm `nota >= 10`.
3. **Contagem por letra inicial**: recebe `["Ana","Álvaro","Élio","Bruno"]` e devolve `{ A:2, B:1, E:1 }` (ignora acentos e usa maiúsculas).
4. **Primeiro ≥ 100**: com `find`, devolve o primeiro valor ≥ 100 (ou `null` se não houver).
5. **`flatMap` de pares `(k,v)`**: transforma `[{k:"nome",v:"Ana"},{k:"nota",v:18}]` em `["nome","Ana","nota",18]`.
6. **`groupBy`**: escreve uma função `groupBy(arr, chaveFn)` (como acima) e aplica-a a uma lista de produtos por categoria.
7. **`reduce` completo**: obtém `{min,max,media}` num único `reduce` (como no exemplo), a partir de um array de números.
8. **Lookup por id**: com `[{id, nome}]`, cria um objeto `{ [id]: aluno }` e acede ao aluno com `id=3` em segurança.
9. **Pipeline legível**: reescreve um encadeamento longo de `filter/map` quebrando em **variáveis intermédias** com nomes claros.

---

## 11) Resumo

-   `map` transforma; `filter` seleciona; `reduce` agrega; `find`/`findIndex` procuram; `some`/`every` testam; `flat`/`flatMap` achatam/expandem; `forEach` é só para efeitos colaterais.
-   Escreve callbacks **puras** e evita mutações inesperadas.
-   Encadeia com **clareza**; otimiza apenas quando for **necessário**.
