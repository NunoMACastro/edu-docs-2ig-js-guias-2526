# [7] Arrays (11.º ano)

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
const comExtra = [...base, 4]; // [3,1,2,4]
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

## 5) Transformar (A dar com mais detalhe no capítulo 11-Arrays-HighOrder.md)

-   `map` → cria novo array transformando cada elemento.
-   `filter` → mantém apenas os que cumprem uma condição.
-   `reduce` → acumula num valor.
-   `flat` / `flatMap` → achatam arrays.

Vamos aprofundar isto no capítulo `[8] Funções de Alto Nível`. Usa estes métodos sempre que quiseres evitar `for` manuais para tarefas simples.

---

## 6) Desestruturação, `rest` e `spread`

Desestruturação: É o acto de "desmontar" um array em variáveis individuais.
`rest`: Permite agrupar o restante dos elementos num novo array.
`spread`: Permite "espalhar" os elementos de um array dentro de outro array ou função.

```js
const [primeiro, segundo, ...resto] = [10, 20, 30, 40];
// primeiro=10, segundo=20, resto=[30,40]
const combinado = [0, ...resto, 50]; // [0,30,40,50]
// Os ... fazem uma cópia do resto do array e colocam os seus elementos individualmente no novo array.
```

Desestruturação permite extrair valores por posição com sintaxe concisa.

-   Exemplo de spread:

```js
const arr1 = [1, 2];
const arr2 = [3, 4];
const combinado = [...arr1, ...arr2]; // [1,2,3,4]

// Fazer cópias rápidas:
const original = [5, 6, 7];
const copia = [...original]; // [5,6,7]
// Assim a copia é independente do original. Se alterarmos uma das cópias, a outra não muda.
```

---

## 7) Percorrer arrays

-   Para percorrer arrays, usa `for`, `for...of` ou métodos como `forEach`, `map`, `filter`. Estes últimos serão abordados em detalhe no capítulo 11-Arrays-HighOrder.md.

-   Com o `for...of`:

```js
const frutas = ["maçã", "banana", "cereja"];
for (const fruta of frutas) {
    console.log(fruta);
}
```

-   Com o `for` tradicional:

```js
for (let i = 0; i < frutas.length; i++) {
    console.log(frutas[i]);
}
```

> Com o `for...of` não podemos alterar diretamente os elementos do array original. Se precisares de modificar os valores, usa o `for` tradicional ou métodos como `map`.

## 8) Boas práticas

-   Não uses `for...in` em arrays (pode trazer propriedades inesperadas). Prefere `for`, `for...of` ou métodos de array.
-   Nomeia claramente os arrays: `alunos`, `notas`, `carrinho`. Evita nomes genéricos como `arr` em código final.
-   Se precisares de partilhar um array entre várias funções/componentes, cria cópias imutáveis antes de mexer.
-   Lembra-te que `length = 0` apaga todo o conteúdo — usa apenas se souberes o que fazes.

---

## 9) Exercícios

1. Cria um array com três disciplinas favoritas e usa `console.log` para mostrar o primeiro elemento, o último (`length - 1`) e o tamanho total.

-   ESTÁ ATENTO MIGUEL!! LARGA O TELEMOVEL!

2. Simula uma fila com `const fila = ["Ana", "Bruno"];`: usa `push`, `unshift`, `pop` e `shift` para adicionar e remover pessoas e, no fim, mostra como ficou a lista e o seu `length`.
3. Parte de `["11º", "Turma", "A"]` e usa `splice` para inserir `"EPMS"` logo após `"11º"`.
4. Copia `[10, 20, 30, 40]` usando `slice()` ou o operador `...` (spread), altera apenas a cópia (por exemplo, removendo o último elemento) e comprova que o array original se manteve igual.
5. Dado `[5, 8, 12, 3, 9, 14]`, percorre os valores com um `for` e constrói manualmente um novo array apenas com os números pares multiplicados por 10. Não recorras a `map`/`filter` ainda.
6. Pede 6 números ao utilizador (por exemplo, com `prompt` num ambiente de browser), guarda-os num array e no final mostra o maior e o menor valor encontrados.
7. Com `const alunos = ["Ana", "Bruno", "Carla", "Ana"];`, usa `includes`, `indexOf` e `lastIndexOf` para responder: a) se "Ana" existe, b) em que posição aparece primeiro e c) em que posição aparece pela última vez.
8. Cria um array com 10 números aleatórios entre -100 e 100. Depois diz quantos são positivos, quantos são negativos e quantos são zeros.
   (Para gerar números aleatórios, podes usar `Math.floor(Math.random() * 201) - 100`.)

Exemplo de gerar 1 número aleatório entre -100 e 100:

```js
const num = Math.floor(Math.random() * 201) - 100;
console.log(num);
```

-   O Math.random() gera um número decimal entre 0 (inclusivo) e 1 (exclusivo).
-   Multiplicamos por 201 para obter um intervalo de 0 a 200,999...
-   O Math.floor() arredonda para baixo, dando um inteiro entre 0 e 200.
-   Subtraímos 100 para ajustar o intervalo para -100 a 100.

## Changelog

-   **v1.1.1 — 2025-11-11**
    -   Exercícios reorganizados com progressão gradual e sem depender de criação de funções.
-   **v1.1.0 — 2025-11-10**
    -   Secção de Exercícios expandida para sete desafios sobre mutação, cópia e pesquisa.
    -   Changelog adicionado para manter histórico de alterações do capítulo.
