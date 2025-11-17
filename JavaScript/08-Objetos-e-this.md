# [8] Objetos e `this` (11.º ano)

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
    console.log(chave, conta[chave]);
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

1. Cria `const aluno = { nome: "Franciscano", curso: "IG", idade: 16 };` e usa `console.log` para mostrar o nome, a idade.
2. No mesmo objeto `aluno`, adiciona a propriedade `notaFinal` com a sintaxe de ponto, altera `curso` usando `[]` com uma string e remove `idade` com `delete`. Mostra o resultado final.
3. Declara `const campo = "media";` e cria um objeto `avaliacao` que aproveita `[campo]` para guardar a média do aluno. Acrescenta também uma propriedade `disciplina` e mostra ambas as chaves com `console.log`.
4. Completa o objeto abaixo preenchendo o método `resumo` para que devolva a string indicada usando `this`:
    ```js
    const conta = {
        titular: "João",
        saldo: 150,
        resumo() {
            // devolve "João tem 150 EUR"
        },
    };
    console.log(conta.resumo());
    ```
    Explica porque `this.titular` e `this.saldo` funcionam aqui.
5. Com `const inventario = { canetas: 12, cadernos: 5, mochilas: 2 };`, percorre as chaves com `for...in` e ignora propriedades herdadas usando `Object.prototype.hasOwnProperty.call`. Mostra cada par `chave → valor` no ecrã.
6. Copia `const perfil = { nome: "Sara", contactos: { email: "sara@epms.pt" } };` usando `const clone = { ...perfil, contactos: { ...perfil.contactos } };` e altera apenas `clone.contactos.email`. Confirma que `perfil` continua igual e explica o motivo.
7. Junta `const padrao = { tema: "claro", notificacoes: true };` com `const preferenciaAluno = { notificacoes: false };` através de `const final = { ...padrao, ...preferenciaAluno };` e descreve quais valores foram sobrepostos.
8. Transforma o array `const pares = [["id", 7], ["nome", "Ana"]];` em objeto com `Object.fromEntries`, converte-o para JSON com `JSON.stringify` e volta ao objeto original com `JSON.parse`. Mostra as três etapas.

## Changelog

-   **v1.1.1 — 2025-11-11**
    -   Exercícios reorganizados com progressão suave, evitando funções independentes e focando numa tarefa por conceito.
-   **v1.1.0 — 2025-11-10**
    -   Secção de Exercícios ampliada com sete atividades sobre criação, cópia, `this` e utilitários `Object.*`.
    -   Changelog incluído para registar evoluções do capítulo.
