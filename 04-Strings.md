# [4] Strings (imutabilidade, métodos, templates)

> **Objetivo**: dominar o essencial de **strings em JavaScript** — como são representadas, porque são **imutáveis**, como **procurar**, **recortar**, **substituir**, **formatar** e **construir** textos de forma clara e segura. No fim tens exercícios.

---

## 1) O que é uma string em JS? (e porquê “imutável”)

-   **Primitivo**: `"abc"` é do tipo primitivo `string` (não confundir com `new String("abc")`, que cria um **objeto wrapper** — evita).
-   **Imutável**: qualquer operação que “mude” uma string **devolve uma nova**; a original não altera.
-   **Unicode**: JS usa **UTF‑16** internamente. `length` conta **unidades de código**, não “caracteres visuais”. Emojis e alguns acentos podem ocupar 2 unidades.

```js
const s = "Olá"; // primitivo string
// new String("Olá")  // objeto (evita)
```

> Regra prática: trata strings como **valores** (faz cópias novas quando transformas).

---

## 2) Criar, concatenar e _template literals_

-   Concatenar com `+` funciona, mas **template literals** (crases \`) são mais legíveis:
    -   **Interpolação**: `${expr}`
    -   **Multilinha**: mantém quebras e espaços
    -   **Expressões** completas dentro de `${ ... }`

```js
const a = 5,
    b = 7;
console.log("Soma: " + (a + b)); // concatenação
console.log(`Soma: ${a + b}`); // template (preferível)
console.log(`Multilinha
com quebras`);
```

> Para **muitas** concatenações num ciclo grande, podes acumular em array e `join("")`. Em exercícios normais, `+` ou templates são suficientes.

---

## 3) Comprimento, acesso e fatiar

-   `length` → número de **unidades UTF‑16** (pode não bater com perceção visual).
-   Acesso por índice devolve **strings de 1 unidade** (ou `undefined`).
-   **Recortar**:
    -   `slice(inicio, fimExcl?)` — aceita **índices negativos**; preferida.
    -   `substring(inicio, fimExcl?)` — troca argumentos se `inicio > fim` e **não aceita negativos**.
    -   `substr(inicio, comprimento)` — **obsoleto**; evita.

```js
const t = "banana";
t.length; // 6
t[0]; // "b"
t.slice(1, 3); // "an"
t.slice(-2); // "na"
t.substring(1, 3); // "an" (sem negativos)
```

**Quando usar**: usa **`slice`** por ser consistente e aceitar negativos; `substring` só se quiseres explicitamente o seu comportamento.

---

## 4) Procurar e testar

-   `includes(substr, fromIdx=0)` → booleano (mais simples).
-   `indexOf(substr, fromIdx=0)`/`lastIndexOf(substr)` → posição ou `-1`.
-   Início/fim: `startsWith(prefix, fromIdx=0)`, `endsWith(sufixo, comprimentoTotal?)`.

```js
"JavaScript".includes("Script"); // true
"banana".indexOf("na"); // 2
"banana".lastIndexOf("na"); // 4
"arquivo.txt".endsWith(".txt"); // true
"restaurar".startsWith("res"); // true
```

### Pesquisas sem distinguir maiúsculas/minúsculas

```js
const texto = "Aprender JavaScript";
const q = "javascript";
texto.toLowerCase().includes(q.toLowerCase()); // true
```

> Para comparação e ordenação que respeite **pt‑PT**, usa `localeCompare` (ver abaixo).

---

## 5) Substituir, dividir, juntar

-   `replace(busca, novo)` substitui **apenas a 1.ª ocorrência** (padrão do lado esquerdo pode ser string ou regex).
-   `replaceAll(busca, novo)` substitui **todas** as ocorrências (string ou regex global `/.../g`).
-   `split(sep)` quebra em array; `join(sep)` volta a juntar.

```js
"hello world".replace("world", "mundo"); // "hello mundo"
"ana banana".replaceAll("na", "NA"); // "aNA baNANA"
"um,dois,tres".split(","); // ["um","dois","tres"]
["a", "b", "c"].join("-"); // "a-b-c"
```

> Nota: `replace` com **regex** dá muito poder (capítulos avançados).

---

## 6) Aparar, repetir e preencher

-   `trim()` remove espaços **no início e fim**. `trimStart()` / `trimEnd()` para lados específicos.
-   `padStart(len, fill=" ")` e `padEnd(len, fill=" ")` preenchem até atingir tamanho.
-   `repeat(n)` repete um padrão.

```js
"  texto  ".trim(); // "texto"
"7".padStart(3, "0"); // "007"
"-".repeat(10); // "----------"
```

---

## 7) Maiúsculas/minúsculas e ordenação com acentos

-   `toUpperCase()` / `toLowerCase()` — **sem locale** (funciona bem na maioria dos casos).
-   **Ordenar/Comparar respeitando pt‑PT**: `localeCompare` com `"pt"` e opções.

```js
["Álvaro", "Ana", "Élio"].sort((a, b) => a.localeCompare(b, "pt"));
// Comparação
"Ana".localeCompare("Álvaro", "pt", { sensitivity: "base" }); // 1, 0 ou -1
```

Para **caseless search** fiável (português), simplifica com `.toLocaleLowerCase("pt")` dos dois lados.

---

## 8) Atenção a Unicode (emojis, acentos combinados)

-   `"🙂".length === 2` (surrogate pair). `length` **não** conta “caracteres visuais”.
-   Alguns acentos são **caracteres combinantes** (ex.: `"á"` é `á`). Visualmente iguais, binariamente diferentes.
-   Para iterar “por caracteres de utilizador”, usa **`Array.from(str)`** (percorre _code points_).

```js
const e = "🙂";
e.length; // 2
Array.from(e).length; // 1  (melhor perceção de “caractere”)

// Iterar por “caracteres”:
for (const ch of Array.from("Olá 🙂")) {
    // ...
}
```

---

## 9) Padrões práticos (copiar/colar)

### 9.1 _Slug_ simples para URL/tokens

```js
function slugifyPt(str) {
    return str
        .normalize("NFD") // separa acentos
        .replace(/[̀-ͯ]/g, "") // remove marcas de acento
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-") // troca blocos não alfanum por "-"
        .replace(/(^-|-$)/g, ""); // tira "-" do início/fim
}
```

### 9.2 _Title case_ simples (palavras principais)

```js
function titleCase(s) {
    return s
        .toLowerCase()
        .split(/\s+/)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");
}
```

### 9.3 Contar vogais (pt) — versão simples

```js
function contarVogais(s) {
    const re = /[aeiouáéíóúàâêîôûãõ]/gi;
    return (s.match(re) || []).length;
}
```

### 9.4 Extrair extensão de ficheiro

```js
function extensao(nome) {
    const i = nome.lastIndexOf(".");
    return i === -1 ? "" : nome.slice(i + 1).toLowerCase();
}
```

### 9.5 Truncar com reticências

```js
function truncar(s, max = 20) {
    if (s.length <= max) return s;
    return s.slice(0, max - 1) + "…";
}
```

### 9.6 Substituir **todas** as ocorrências (compatível amplo)

```js
function replaceAllCompat(s, alvo, novo) {
    return s.split(alvo).join(novo);
}
```

---

## 10) Boas práticas rápidas

-   **Prefere templates** (crases) a concatenação com `+` — mais legível.
-   Para **procuras sem case**, normaliza ambos os lados (`toLowerCase`/`toLocaleLowerCase("pt")`).
-   Usa **`slice`** em vez de `substring`/`substr` (consistente e aceita negativos).
-   Para **ordenar com acentos**: `localeCompare("pt")`.
-   Atenção a `length` com emojis/acentos; para iterar por “caracteres”, usa `Array.from`.
-   Quando transformares, lembra-te: **strings são imutáveis** (guarda o retorno).

---

## 11) Exemplos comentados

```js
const s = "   JavaScript   ";
console.log(s.length); // 16
console.log(s.trim()); // "JavaScript"
console.log("abc".includes("b")); // true
console.log("banana".slice(1, 3)); // "an"

// Templates
const a = 5,
    b = 7;
console.log(`A soma de ${a} + ${b} = ${a + b}`);

// Case-insensitive
"Aprender JavaScript".toLowerCase().includes("javascript");

// Ordenação com acentos
["Álvaro", "Ana", "Élio"].sort((x, y) => x.localeCompare(y, "pt"));

// Unicode: iterar por “caracteres”
for (const ch of Array.from("Olá 🙂")) {
    /* ... */
}
```

---

## 12) Exercícios rápidos

1. Pede ao utilizador um texto e mostra:
    - comprimento **sem espaços extremos**, versão **maiúscula** e **minúscula**.
2. Implementa `contarVogais(s)` (considera acentos comuns pt) e testa.
3. Cria `primeirasLetras(frase)` que devolve as iniciais de cada palavra (ex.: `"Escola Profissional"` → `"EP"`).
4. Implementa `mascararTelefone("912345678")` → `"91******8"` (mantém 2 primeiros e último).
5. Ordena `["maçã", "pêra", "uva", "abacaxi"]` de forma correta para pt-PT.
6. Escreve `slugifyPt` como acima e aplica à frase `"Olá, mundo! Programar é fixe."`.
7. Cria `truncar(s, max)` que não corte a meio de palavras quando possível (extra).

---

**Resumo**: strings em JS são **imutáveis**; usa **templates** para construir, **slice** para recortar, **replace/replaceAll** para substituir, **includes/indexOf** para procurar, e **localeCompare** para ordenar corretamente em português.
