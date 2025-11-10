# [8] Objetos e `this` — Versão Didática (11.º ano)

> **Objetivo**: representar dados com pares `chave → valor`, alterar e ler propriedades, entender `this` em métodos simples e copiar/mesclar objetos sem surpresas.

---

## 0) O que é um objeto?

-   É o mesmo que um dicionário, mapa ou tabela hash noutras linguagens.
-   Coleção dinâmica de pares `chave: valor`.
-   Chaves são sempre **strings** ou `Symbol` (até números são convertidos para string).
-   Se leres uma chave inexistente, recebes `undefined`.
-   Dois objetos com o mesmo conteúdo não são iguais (`===`) porque vivem em sítios diferentes da memória.

```js
const aluno = { nome: "Ana", idade: 17 };
aluno.nome; // "Ana"
aluno["idade"]; // 17
aluno.altura; // undefined
```

### O que é o `this`?

-   Palavra-chave especial que aparece em métodos de objetos.
-   Aponta para o objeto usado na chamada do método.
-   Ou seja, o this representa "o objeto atual" que está a usar o método ou a aceder à propriedade.
-   Imagina uma planta de uma casa. Imagina agora que várias casas estão a ser construídas, ao mesmo tempo, com a mesma planta. O `this` é como se fosse a "casa atual" que está a ser construída, permitindo que cada casa use a planta para construir-se corretamente, sem confundir-se com as outras casas.

```js
const casa = {
    quartos: 3,
    area: 120,
    descricao() {
        return `Casa com ${this.quartos} quartos e ${this.area} m²`;
    },
};

console.log(casa.descricao()); // "Casa com 3 quartos e 120 m²"
```

Neste exemplo, o `this` dentro do método `descricao` refere-se ao objeto `casa`, permitindo aceder às suas propriedades `quartos` e `area`.

---

## 1) Criar objetos

### Literal (preferido)

```js
const escola = {
    nome: "EPMS",
    turmas: 12,
    ativa: true,
};
```

Um objeto pode conter outros objetos, arrays, funções (métodos), etc.

### Chaves calculadas

```js
const campo = "nota";
const aluno = { nome: "Bruno", [campo]: 18 }; // cria a chave "nota"
```

### `Object.create(null)` (quando queres um "dicionário puro")

Remove a herança padrão — útil para guardar pares simples sem métodos herdados.

```js
const dicionario = Object.create(null);
dicionario.codigo = "A1";
```

---

## 2) Ler, escrever e remover

-   `obj.chave` → quando a chave é um identificador simples.
-   `obj[expressao]` → quando tens espaços, hífen ou queres usar variáveis.
-   `delete obj.chave` → remove.

```js
const pessoa = { nome: "Marta" };
pessoa.idade = 22; // adicionar
pessoa["cidade"] = "Viseu";
delete pessoa.nome;
```

---

## 3) `this` em métodos

-   Dentro de um método normal (`metodo() { ... }`), `this` aponta para o objeto usado na chamada (`obj.metodo()`).
-   Arrow functions **não** criam `this` próprio, por isso evita-as em métodos que precisam de `this`.

```js
const conta = {
    saldo: 100,
    depositar(valor) {
        this.saldo += valor; // "this" é o objeto conta
    },
};

conta.depositar(50);
console.log(conta.saldo); // 150
```

Se precisares de forçar `this`, existem `call`, `apply` e `bind`, mas não é necessário para a maioria dos exercícios introdutórios.

---

## 4) Iterar propriedades

### `for...in` (com filtro)

```js
for (const chave in conta) {
    if (Object.prototype.hasOwnProperty.call(conta, chave)) {
        console.log(chave, conta[chave]);
    }
}
```

### `Object.keys/values/entries`

```js
Object.entries(conta).forEach(([chave, valor]) => {
    console.log(chave, valor);
});
```

`entries` é excelente para transformar objetos em tabelas com `console.table` ou para criar versões copiadas.

---

## 5) Copiar e atualizar

### Cópia superficial

```js
const original = { pessoa: { nome: "Ana" }, ativo: true };
const copia = { ...original }; // espalha propriedades
```

Atenção: objetos aninhados continuam a apontar para o mesmo sítio (`copia.pessoa` é o mesmo que `original.pessoa`). Quando precisares de atualizar um nível interno, copia também esse nível.

```js
const atualizada = {
    ...original,
    pessoa: { ...original.pessoa, nome: "Rita" },
};
```

### Misturar objetos

```js
const padrao = { tema: "claro", notificacoes: true };
const user = { notificacoes: false };
const preferencias = { ...padrao, ...user }; // user sobrepõe o padrao
```

### Proteger objetos

```js
const config = Object.freeze({ porta: 3000 });
// config.porta = 4000; // não muda (em strict mode lança erro)
```

---

## 6) JSON rápido

-   `JSON.stringify(obj)` → transforma em string (para guardar/envio).
-   `JSON.parse(texto)` → volta a objeto (desde que o texto seja JSON válido).

```js
const aluno = { nome: "Ana", nota: 18 };
const texto = JSON.stringify(aluno); // "{\"nome\":\"Ana\",...}"
const outraVez = JSON.parse(texto);
```

JSON usa aspas duplas e não aceita comentários.

---

## 7) Exercícios

1. Cria um objeto `aluno` com `nome`, `idade`, `nota`. Atualiza a nota usando `aluno.nota = ...`.
2. Cria um objeto `conta` com métodos `depositar` e `levantar`. Usa `this` corretamente e mostra erros quando o levantamento é maior que o saldo.
3. Usa `Object.freeze` para proteger uma configuração e demonstra, em modo estrito, que reatribuir campos lança erro (ou falha silenciosamente fora dele).
4. Constrói uma função `mergeConfig(...fontes)` que usa `Object.assign` ou `spread` para criar um objeto final com defaults + overrides.
5. Converte um array de pares `[["id", 1], ["nome", "Ana"]]` em objeto usando `Object.fromEntries` (ou recria com `for...of`).

## Changelog

-   **v1.1.0 — 2025-11-10**
    -   Secção de Exercícios ampliada com sete atividades sobre criação, cópia, `this` e utilitários `Object.*`.
    -   Changelog incluído para registar evoluções do capítulo.
