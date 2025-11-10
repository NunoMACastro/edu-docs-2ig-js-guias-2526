# [7] Arrays — Versão Didática (11.º ano)

> **Objetivo**: trabalhar listas ordenadas de valores, saber quando alterar o array original e quando criar cópias imutáveis, além de dominar métodos básicos usados todos os dias.

---

## 0) Relembrar: o que é um array?

-   Lista ordenada onde cada elemento tem um **índice** (começa em 0).
-   Guarda qualquer tipo: números, strings, objetos, outros arrays.
-   `length` diz-te quantos elementos existem (pode ser alterado, mas evita mexer diretamente).

```js
const numeros = [10, 20, 30];
console.log(numeros[0]); // 10
console.log(numeros.length); // 3
```

Comparação é por **referência**: `[] === []` é `false` porque são caixas diferentes.

---

## 1) Criar arrays de forma segura

```js
const vazio = [];
const misto = [1, "dois", true];
const copia = Array.of(1, 2, 3);
const sequencia = Array.from({ length: 5 }, (_, i) => i + 1); // [1..5]
```

Usa sempre o literal `[]` quando possível — é mais claro.

---

## 2) Métodos que **alteram** o array (mutáveis)

> Usa-os quando queres mesmo mudar a lista original.

-   `push` / `pop` → fim.
-   `unshift` / `shift` → início.
-   `splice(inicio, quantos, ...novos)` → remove/insere em qualquer posição.
-   `sort(compareFn)` → ordena (muta!).
-   `reverse()` → inverte (muta!).
-   `fill(valor, inicio?, fim?)` → preenche intervalo.

```js
const alunos = ["Ana", "Bruno"];
alunos.push("Carla"); // ["Ana","Bruno","Carla"]
alunos.splice(1, 1, "Bia"); // ["Ana","Bia","Carla"]
const notas = [12, 5, 18];
notas.sort((a, b) => a - b); // [5,12,18]
```

> Quando ordenares strings com acentos, usa `localeCompare("pt")` na função de comparação.

---

## 3) Métodos que devolvem **cópias** (imutáveis)

> Ótimos quando queres preservar o array original e evitar efeitos inesperados.

-   `slice(inicio, fimExclusivo?)` → recorta sem alterar o original.
-   `concat(...itens)` → junta arrays/valores e devolve novo array.
-   `spread` `[...]` → cria cópias rápidas.
-   Versões modernas (`toSorted`, `toReversed`, `toSpliced`) fazem o mesmo que `sort/reverse/splice` mas devolvem cópia (Node 20+/browsers recentes).

```js
const base = [3, 1, 2];
const ordenado = base.slice().sort((a, b) => a - b); // base intacto
const comExtra = [...base, 4];
```

Se `toSorted` ainda não existir no ambiente dos alunos, explica como usar `slice()` antes de `sort()` para criar uma cópia.

---

## 4) Procurar e verificar

-   `includes(valor)` → `true/false`.
-   `indexOf(valor)` / `lastIndexOf(valor)` → posição ou `-1`.
-   `find(callback)` → devolve o primeiro elemento que passa no teste.
-   `findIndex(callback)` → devolve o índice.
-   `some(callback)` → `true` se **algum** elemento passar.
-   `every(callback)` → `true` se **todos** passarem.

```js
const alunos = [
    { nome: "Ana", nota: 18 },
    { nome: "Bruno", nota: 9 },
];
alunos.find((a) => a.nota < 10); // { nome: "Bruno", nota: 9 }
alunos.some((a) => a.nota >= 18); // true
```

---

## 5) Transformar (provocação para o capítulo seguinte)

-   `map` → cria novo array transformando cada elemento.
-   `filter` → mantém apenas os que cumprem uma condição.
-   `reduce` → acumula num valor.
-   `flat` / `flatMap` → achatam arrays.

Vamos aprofundar isto no capítulo `[8] Funções de Alto Nível`. Usa estes métodos sempre que quiseres evitar `for` manuais para tarefas simples.

---

## 6) Desestruturação, `rest` e `spread`

```js
const [primeiro, segundo, ...resto] = [10, 20, 30, 40];
// primeiro=10, segundo=20, resto=[30,40]
const combinado = [0, ...resto, 50]; // [0,30,40,50]
```

Desestruturação permite extrair valores por posição com sintaxe concisa.

---

## 7) Boas práticas

-   Não uses `for...in` em arrays (pode trazer propriedades inesperadas). Prefere `for`, `for...of` ou métodos de array.
-   Nomeia claramente os arrays: `alunos`, `notas`, `carrinho`. Evita nomes genéricos como `arr` em código final.
-   Se precisares de partilhar um array entre várias funções/componentes, cria cópias imutáveis antes de mexer.
-   Lembra-te que `length = 0` apaga todo o conteúdo — usa apenas se souberes o que fazes.

---

## 8) Exercícios

1. Cria uma função `adicionarAluno(lista, nome)` que devolve **novo** array com o nome no fim (não muta).
2. Usa `splice` para inserir "EPMS" na posição 2 de `["11º", "Turma", "A"]` e explica o resultado passo a passo.
3. A partir de `[5, 8, 12, 3]`, devolve um array com os números pares multiplicados por 10 (podes usar `for` ou já experimentar `filter` + `map`).
4. Escreve um programa que pede 10 números ao utilizador, guarda‑os num array e depois mostra o maior e o menor valor inseridos.
5. Ainda no array de números do exercício anterior, cria uma cópia ordenada sem alterar o original e mostra ambos.
6. Ainda no array de números, verifica se todos são positivos e se algum é maior que 100.
7. Usa `includes`, `indexOf` e `find` para procurar o aluno `"Ana"` numa lista de objetos `{ nome, nota }`. Comenta as diferenças.
8. Desestrutura `["João", "Maria", "Ana", "Rui"]` para extrair o primeiro, o último e ficar com um array `resto` para o meio. Usa `spread` para construir um novo array `novoGrupo` começando por `"Prof."`.

## Changelog

-   **v1.1.0 — 2025-11-10**
    -   Secção de Exercícios expandida para sete desafios sobre mutação, cópia e pesquisa.
    -   Changelog adicionado para manter histórico de alterações do capítulo.
