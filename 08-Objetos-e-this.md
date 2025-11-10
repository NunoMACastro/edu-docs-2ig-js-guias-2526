# [9] Objetos (criar, ler/escrever, `this`, utilitários `Object.*`, clones)

> **Objetivo**: entender **objetos** em JavaScript como coleções de pares **chave → valor**, saber **criar**, **ler**, **alterar**, **iterar** e **clonar** com segurança (imutável quando útil). No fim tens exercícios.

---

## 1) O que é um objeto?

-   Estrutura **dinâmica** de pares `chave: valor`.
-   Chaves são **strings** ou **`Symbol`**; números são convertidos para string ao definir (`obj[1]` ≡ `obj["1"]`).
-   Acesso a uma chave inexistente devolve **`undefined`** (não lança erro).
-   Comparação é por **referência**: dois objetos com o mesmo conteúdo **não** são `===`.

```js
const obj = { nome: "Ana", idade: 18 };
console.log(obj.nome); // "Ana"
console.log(obj["idade"]); // 18
console.log(obj.idade + 2); // 20
console.log(obj.altura); // undefined (não existe)

const a = { x: 1 };
const b = { x: 1 };
if (a === b) {
    console.log("iguais");
} else {
    console.log("diferentes"); // isto acontece
}

// Acontece o else porque a e b são referências diferentes, mesmo tendo o mesmo conteúdo.
```

---

## 2) Criar objetos (formas modernas)

### 2.1 Literal (preferida)

```js
const aluno = {
    nome: "João",
    idade: 20,
    ativo: true,
};
```

### 2.2 Chaves calculadas (dinâmicas)

```js
const campo = "nota";
const aluno = { nome: "Bruno", [campo]: 17 }; // { nome:"Bruno", nota:17 }
```

### 2.3 `Object.create(proto)`

Cria um objeto definindo explicitamente o **protótipo**.

```js
const semProto = Object.create(null); // “dicionário puro” (sem herdar nada)
semProto.chave = 1;
```

> Evita `new Object()`. Prefere literal `{}`.

---

## 3) Ler, escrever e apagar propriedades

-   **Dot notation**: `obj.chave` (quando a chave é um identificador válido).
-   **Bracket notation**: `obj["chave-especial"]` ou `obj[variavel]` (dinâmica).

```js
const pessoa = { nome: "Marta", idade: 22 };
pessoa.idade = 23; // escrever/mudar
pessoa.escola = "EPMS"; // adicionar
delete pessoa.idade; // remover
console.log(pessoa["nome"]); // ler com bracket
```

---

## 4) `this` em métodos (resumo didático)

-   this é uma referência dinâmica ao “dono da chamada” naquele momento.
-   O valor de this não depende de onde a função foi escrita, mas de como é invocada (o call-site).

Exemplos básicos:

```js
function f() {
    console.log(this);
}
f(); // no modo estrito, 'this' é undefined (função normal chamada sozinha)

const obj = {
    nome: "Objeto",
    mostrarThis() {
        console.log(this);
    },
};
obj.mostrarThis(); // 'this' é 'obj' (método chamado no objeto)
```

-   Em **funções normais** chamadas como `obj.metodo()`, o **`this`** é o **objeto à esquerda do ponto**.
-   **Não** uses **arrow functions** para métodos que precisam de `this`, porque **arrow** não cria `this` próprio (captura o do **exterior**).

```js
const conta = {
    saldo: 100,
    debitar(valor) {
        this.saldo -= valor;
    }, // OK
    // debitar: (valor) => { this.saldo -= valor; } // NÃO FAZER: 'this' não é 'conta'
};
conta.debitar(10);
// conta.saldo → 90
```

**Controlar `this` manualmente (avançado):**

-   `fn.call(ctx, ...args)` / `fn.apply(ctx, args)` para invocar com `this=ctx`.
-   `const f = fn.bind(ctx)` para devolver nova função com `this` fixo.

---

## 5) Iterar propriedades (e enumerabilidade)

-   `for...in` percorre **propriedades enumeráveis** **próprias e herdadas** → usa com filtro `hasOwn`.
-   `Object.keys(obj)` → **próprias + enumeráveis** (array de **strings**).
-   `Object.values(obj)` → valores correspondentes.
-   `Object.entries(obj)` → `[[chave, valor], ...]`.
-   `Object.getOwnPropertyNames(obj)` → próprias **mesmo que não enumeráveis**.
-   `Object.getOwnPropertySymbols(obj)` → símbolos próprios.

```js
const obj = { a: 1, b: 2, c: 3 };
for (const k in obj) {
    // Faz qualquer coisa com k e obj[k]
}

for (const [k, v] of Object.entries(obj)) {
    console.log(k, v); // Mostra chave e valor
}
```

> **Dica**: para “tabelas” usa `Object.entries`/`for...of` — mais claro e não apanha herdadas.

---

## 6) Copiar, mesclar e atualizar (shallow)

### 6.1 Cópia **superficial** (shallow)

-   **Spread**: `{ ...orig }`
-   **Assign**: `Object.assign({}, orig)`  
    Ambos copiam **apenas o 1.º nível** (referências internas são partilhadas).

```js
const orig = { pessoa: { nome: "Ana" }, ativo: true };
const copia = { ...orig };
orig.pessoa.nome = "Rita";
console.log(copia.pessoa.nome); // "Rita" (mesmo objeto interno)
```

### 6.2 Mesclar e atualizar imutavelmente

```js
const base = { nome: "Ana", endereco: { cidade: "Viseu", rua: "A" } };
const novo = {
    ...base,
    endereco: { ...base.endereco, cidade: "Porto" }, // atualiza aninhado
};
```

### 6.4 Congelar (evitar alterações acidentais)

```js
const cfg = Object.freeze({ porta: 3000, modo: "dev" });
// cfg.porta = 4000; // falha silenciosa (ou erro em modo estrito)
```

---

## 7) Protótipos (introdução suave)

-   Cada objeto tem um **protótipo** (outro objeto) de onde **herda** propriedades/métodos.
-   A resolução de propriedades procura primeiro no objeto, depois **sobe a cadeia**.
-   Usa `Object.getPrototypeOf(obj)` e `Object.setPrototypeOf(obj)` para inspeção (evita `__proto__`).
-   No dia a dia, vais usar **Classes** (que por baixo configuram a cadeia de protótipos).

```js
const arr = []; // arr herda métodos de Array.prototype
console.log(Object.getPrototypeOf(arr) === Array.prototype); // true
```

> Para “dicionários puros” (sem colisões com `toString`, etc.), usa `Object.create(null)`.

---

## 8) JSON (guardar/transferir dados)

-   Converter objeto → string JSON: `JSON.stringify(obj, null, 2)` (“2” para identação).
-   Converter string JSON → objeto: `JSON.parse(texto)`.
-   **Limitações**: funções, `undefined`, `Symbol` **não** são serializados; `Date` vira string; `Map/Set` perdem estrutura.

```js
const dados = { nome: "Ana", quando: new Date() };
const txt = JSON.stringify(dados, null, 2);
const obj = JSON.parse(txt);
```

---

## 9) Exercícios rápidos

1. **Leitura segura**: lê `user.endereco.cidade` em segurança (usa `?.` e `??`). Se não existir, `"N/D"`.
2. **Atualização imutável**: dado `user = { nome:"Ana", morada:{ cidade:"Viseu", rua:"A" } }`, cria `user2` com **cidade = "Porto"** sem alterar `user`.
3. **Clonagem profunda**: faz um **deep clone** de um objeto com aninhados usando `structuredClone` (ou JSON\* com nota das limitações).
4. **Filtrar propriedades**: escreve `pick(obj, chaves)` que devolve um **novo objeto** só com as chaves pedidas.
5. **Transformar valores**: multiplica todos os números de `{ a:1, b:2, c:3 }` por 10 usando `Object.entries` + `fromEntries`.
6. **hasOwn vs in**: explica a diferença e dá um exemplo onde `in` é `true` mas `hasOwn` é `false`.
7. **Getter/Setter**: cria um objeto `termometro` com `get celsius()`/`set celsius(v)` e `get fahrenheit()` que convertem corretamente.
8. **Dicionário puro**: cria um “mapa simples” com `Object.create(null)` que conta ocorrências de palavras de um array.

---

**Resumo**: preferir literais `{}`, usar **dot** vs **bracket** consoante o caso, dominar `Object.keys/values/entries/fromEntries`, copiar/mesclar com **spread** e pensar em **imutabilidade** quando partilhas dados. Lembrar que **arrow** não tem `this` próprio (evita em métodos), e usar `structuredClone` para **deep clone** moderno.
