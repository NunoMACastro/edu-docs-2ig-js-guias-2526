# [4] Strings — Versão Didática (11.º ano)

> **Objetivo**: trabalhar textos em JavaScript de forma simples: criar, formatar, procurar, recortar e substituir sem te perderes em detalhes demasiado técnicos.

---

## 0) Ideias base

-   Strings são **primitivos imutáveis**: sempre que “alteras”, na verdade recebes uma **nova** string.
-   Usa `"texto"`, `'texto'` ou crases `` `texto` ``. Evita `new String()`.
-   Internamente o JS usa Unicode (UTF‑16). Basta saber que `length` conta unidades, não emojis completas (ver secção 7).

---

## 1) Concatenar e usar _template literals_

-   Com `+` podes juntar textos.
-   Com crases `` ` ` `` ganhas interpolação `${...}` e multilinha.

```js
const nome = "Ana";
const idade = 16;
console.log("Sou " + nome + " e tenho " + idade + " anos.");
console.log(`Sou ${nome} e tenho ${idade} anos.`); // mais limpo
console.log(`Linha 1
Linha 2`); // mantém quebras
```

Quando tiveres muitas partes, acumula num array e usa `join("")` para evitar misturas confusas.

---

## 2) Tamanho, acesso e cortes

-   `str.length` → número de unidades (não altera a string).
-   `str[i]` → caractere naquela posição (ou `undefined`).
-   `slice(inicio, fimExclusivo?)` → recorta aceitando índices negativos.
-   `substring(inicio, fimExclusivo?)` → não aceita negativos e troca argumentos se vierem invertidos.

```js
const palavra = "banana";
palavra.length; // 6
palavra[0]; // "b"
palavra.slice(1, 3); // "an"
palavra.slice(-2); // "na"
```

Prefere `slice` por ser consistente.

---

## 3) Procurar padrões simples

-   `includes(substr, inicio?)` → devolve `true/false`.
-   `indexOf(substr)` / `lastIndexOf(substr)` → posição ou `-1`.
-   `startsWith` / `endsWith` para verificar prefixos e sufixos.

```js
"JavaScript".includes("Script"); // true
"musica.mp3".endsWith(".mp3"); // true
"banana".indexOf("na"); // 2
```

Para buscas sem distinguir maiúsculas/minúsculas, converte ambos os lados para `toLowerCase()` ou `toLocaleLowerCase("pt")`.

---

## 4) Substituir, dividir, juntar

-   `replace(alvo, novo)` → só a primeira ocorrência.
-   `replaceAll(alvo, novo)` → todas as ocorrências (ou usa `replace` com regex `/.../g`).
-   `split(sep)` → converte em array.
-   `join(sep)` → faz o inverso.

```js
"olá mundo".replace("mundo", "turma"); // "olá turma"
"ana banana".replaceAll("na", "NA"); // "aNA baNANA"
"um,dois".split(","); // ["um","dois"]
["a", "b"].join("-"); // "a-b"
```

---

## 5) Aparar, preencher, repetir

-   `trim()`, `trimStart()`, `trimEnd()` → removem espaços nas pontas.
-   `padStart(tamanho, preenchimento)` / `padEnd(...)` → completam texto.
-   `repeat(n)` → repete a string n vezes.

```js
"  texto  ".trim(); // "texto"
"7".padStart(3, "0"); // "007"
"-".repeat(5); // "-----"
```

---

## 6) Maiúsculas, minúsculas e ordenação com acentos

-   `toUpperCase()` / `toLowerCase()` funcionam para a maioria dos casos.
-   Para ordenar nomes com acentos usa `localeCompare` com o locale português.

```js
["Álvaro", "Ana", "Élio"].sort((a, b) => a.localeCompare(b, "pt"));
```

---

## 7) Nota rápida sobre emojis e Unicode

Emojis e alguns caracteres ocupam 2 unidades de `length`. Quando precisares de tratar "caracteres humanos", usa `Array.from`.

```js
const emoji = "🙂";
emoji.length; // 2
Array.from(emoji).length; // 1 (agora faz sentido)
```

Isto só é relevante quando estiveres a limitar caracteres ou a percorrer texto com emojis/acentos combinados.

---

## 8) Funções práticas para copiar

```js
function slugifyPt(frase) {
    return frase
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function contarVogais(str) {
    const regex = /[aeiouáéíóúàâêîôûãõ]/gi;
    return (str.match(regex) || []).length;
}
```

Explica passo a passo aos alunos antes de copiarem; aproveita para falar de regex a um nível introdutório.

---

## 9) Mini desafios

1. Pede uma frase e devolve-a capitalizada (primeira letra de cada palavra em maiúscula).
2. Pergunta o nome completo e mostra apenas o apelido (usa `lastIndexOf(" ")`).
3. Conta quantas vezes a letra "a" aparece numa palavra (ignora maiúsculas/minúsculas).
