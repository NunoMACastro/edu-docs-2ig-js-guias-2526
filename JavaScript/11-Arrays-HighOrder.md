# [11] Funções de Alto Nível em Arrays (11.º ano)

> **Objetivo**: deixar os ciclos manuais de lado e usar métodos como `map`, `filter`, `reduce` e `find` para escrever código mais declarativo e fácil de ler.

---

## 0) O que são HOFs?

HOF significa _Higher-Order Functions_. São métodos de array que recebem uma **função callback**. Tu explicas o que queres fazer e o método trata do ciclo.

Assinatura genérica:

```js
array.metodo((valor, indice, arrayCompleto) => resultado, valorInicialOpcional);
```

A maior parte destes métodos devolve **novo array** ou um novo valor, sem alterar o original (a não ser que a tua callback mude objetos internos de propósito).

---

## 1) `map` - transformar

Aplica a callback a cada elemento e devolve um novo array com os resultados.

```js
const notas = [10, 12, 18];
const comBónus = notas.map((nota) => nota + 1);
```

- Mantém o mesmo tamanho.
- Ótimo para extrair campos (`aluno => aluno.nome`).

---

## 2) `filter` - selecionar

Mantém apenas os elementos cuja callback devolve `true`.

```js
const aprovados = notas.filter((nota) => nota >= 10);
```

Usa quando queres remover valores nulos, procurar pares, etc.

---

## 3) `reduce` - acumular

Recebe um acumulador (`acc`) e o elemento atual (`valor`). Serve para somas, contagens, médias, objetos agregados…

```js
const soma = notas.reduce((acc, nota) => acc + nota, 0);
const media = notas.length ? soma / notas.length : 0;
```

- Passa **sempre** um valor inicial (`0`, `{}`, `[]`, ...). Evita surpresas com arrays vazios.
- Pensa no `acc` como o "estado" que vais atualizando.

---

## 4) `find` e `findIndex` - primeiro que passa

```js
const alunos = [
    { nome: "Ana", nota: 18 },
    { nome: "Bruno", nota: 9 },
];
const primeiroReprovado = alunos.find((a) => a.nota < 10); // objeto ou undefined
const indiceReprovado = alunos.findIndex((a) => a.nota < 10); // índice ou -1
```

Quando só queres saber se existe, `some` pode ser mais direto.

---

## 5) `some` e `every`

- `some` → `true` se **algum** elemento passar.
- `every` → `true` se **todos** passarem.

```js
notas.some((nota) => nota === 20); // procura nota máxima
notas.every((nota) => nota >= 10); // verifica se todos aprovam
```

---

## 6) `flat` e `flatMap`

- `flat(n)` → achata `n` níveis de arrays aninhados.
- `flatMap` → faz `map` seguido de `flat(1)`.

```js
const grupos = [["Ana", "Bia"], ["Carlos"]];
const todos = grupos.flat(); // ["Ana","Bia","Carlos"]

const duplicado = ["a", "b"].flatMap((letra) => [letra, letra.toUpperCase()]);
```

---

## 7) `forEach` - efeitos colaterais

Quando queres apenas **fazer algo** para cada elemento (escrever no ecrã, guardar na base de dados), usa `forEach`. Não devolve nada.

```js
alunos.forEach((aluno) => console.log(aluno.nome));
```

Se precisares de um novo array/valor, prefere `map`, `filter` ou `reduce`.

---

## 8) Encadear com clareza

Podes usar vários métodos seguidos. Formata em linhas diferentes para manter a leitura.

```js
const mediaAprovados = alunos
    .filter((a) => a.nota >= 10)
    .map((a) => a.nota)
    .reduce((acc, nota, _, arr) => acc + nota / arr.length, 0);
```

Quando a cadeia crescer demasiado, guarda resultados intermédios em variáveis com nomes claros (`const aprovados = ...`).

---

## 9) Mini desafios

1. Com `[1, 2, 3, 4, 5]`, usa `map` para devolver um array com o dobro de cada valor.
2. Cria a lista com `[15, 8, 20, 9, 18]` e usa `filter` para ficar apenas com notas ≥ 10.
3. A partir de `[{ nome: "Ana", nota: 18 }, ...]`, usa o `filter` para ficar só com os alunos aprovados.
4. Com `["Ana", "Álvaro", "Bruno"]`, mostra qual o primeiro nome que começa por "A" usando `find` (ignora acentos com `toLowerCase`).
5. Verifica se há algum valor maior que 50 com `some` e se todos são positivos com `every` num array à tua escolha.
6. Escreve um pequeno programa com `filter` + `map` que recebe palavras e devolve só as que têm mais de 4 letras em maiúsculas.

## Changelog

- **v1.2.0 - 2025-11-10**
    - Mini desafios simplificados para focar em `map`, `filter`, `reduce`, `find`, `some/every` sem padrões avançados.
- **v1.1.0 - 2025-11-10**
    - Mini desafios reforçados com duas novas propostas (`groupBy` e pipeline encadeado).
    - Nova secção de changelog para documentar revisões futuras.
