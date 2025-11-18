# [8] Objetos e `this` (11.º ano)

> **Objetivo**: representar dados com pares `chave → valor`, alterar e ler propriedades, entender `this` em métodos simples e copiar/mesclar objetos sem surpresas.

---

## 0) O que é um objeto?

<a id="objetos"></a>

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

> Exercícios: [1], [2], [3], [10]

---

## 1) Criar objetos

<a id="criar-objetos"></a>

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

> Exercícios: [1], [2], [3], [10]

---

## 2) Ler, escrever e remover

<a id="ler-escrever"></a>

-   `obj.chave` → quando a chave é um identificador simples.
-   `obj[expressao]` → quando tens espaços, hífen ou queres usar variáveis.
-   `delete obj.chave` → remove.

```js
const pessoa = { nome: "Marta" };
pessoa.idade = 22; // adicionar
pessoa["cidade"] = "Viseu";
delete pessoa.nome;
```

> Exercícios: [2], [9], [10]

---

## 3) `this` em métodos

<a id="this-metodos"></a>

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

> Exercícios: [4], [8], [9]

---

## 4) Iterar propriedades

<a id="iterar-propriedades"></a>

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

> Exercício: [5], [12], [13]

---

## 5) Copiar e atualizar

<a id="copiar-atualizar"></a>

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

> Exercícios: [6], [7]

---

## 6) JSON rápido

-   Podemos converter objetos para strings JSON e vice-versa.
-   Depois de converter para string, o objeto original e a string são independentes.
-   Útil para guardar dados ou enviar via rede.

<a id="json-rapido"></a>

-   `JSON.stringify(obj)` → transforma em string (para guardar/envio).
-   `JSON.parse(texto)` → volta a objeto (desde que o texto seja JSON válido).

```js
const aluno = { nome: "Ana", nota: 18 };
const texto = JSON.stringify(aluno); // "{\"nome\":\"Ana\",...}"
const outraVez = JSON.parse(texto);

// Por exemplo, guardar no localStorage
localStorage.setItem("aluno", JSON.stringify(aluno)); // guardar
const salvo = JSON.parse(localStorage.getItem("aluno")); // ler

> O localStorage é uma API do navegador para guardar dados localmente.
> Os dados podem depois ser recuperados pelas aplicações web.


```

JSON usa aspas duplas e não aceita comentários.

---

## 7) Exercícios

1. <a id="ex1"></a>Cria `const aluno = { nome: "Franciscano", curso: "IG", idade: 16 };` e usa `console.log` para mostrar o nome, a idade e o valor de `aluno.cidade` (que deverá dar undefined).

   Consultar: [O que é um objeto?](#objetos) · [Criar objetos](#criar-objetos)

---

2. <a id="ex2"></a>No mesmo objeto `aluno`, adiciona a propriedade `notaFinal` com a sintáxe de ponto, altera `curso` usando `[]` com uma string e remove `idade` com `delete`. Mostra o resultado final.

   Consultar: [Criar objetos](#criar-objetos) · [Ler, escrever e remover](#ler-escrever)

---

3. <a id="ex3"></a>Cria a variável `const campo = "media";` e cria um objeto `avaliacao` com a chave `media` (usando `[campo]`) e outra chave `disciplina`. Mostra ambas as chaves com `console.log`.

   Consultar: [Criar objetos](#criar-objetos)

---

4. <a id="ex4"></a>Completa o objeto abaixo preenchendo o método `resumo` para que devolva a string indicada usando `this`: Tenta explicar porque `this.titular` e `this.saldo` funcionam aqui.

   Consultar: [this em métodos](#this-metodos)

```js
const contaBancaria = {
    titular: "Carlos Silva",
    saldo: 2500,
    resumo() {
        // Completa aqui
    },
};
console.log(contaBancaria.resumo());
```

---

5. <a id="ex5"></a>Cria um loop `for...in` para imprimir todas as chaves e valores do objeto `contaBancaria` do exercício anterior. Se o saldo for 0 ou negativo, imprime "ATENÇÃO: saldo insuficiente" em vez do valor do saldo.

   Consultar: [Iterar propriedades](#iterar-propriedades)

---

6. <a id="ex6"></a>Cria uma cópia do objeto `contaBancaria` chamada `contaAtualizada`, mas com o saldo aumentado em 500 (primeiro copia o objeto e depois altera o valor). Mostra ambos os objetos para comprovar que o original não foi alterado. Depois, no objeto `contaAtualizada`, altera o titular para "Carla Pereira" e mostra o resultado final.

   Consultar: [Copiar e atualizar](#copiar-atualizar)

---

7. <a id="ex7"></a>Ainda no objeto `contaBancaria`, usa `Object.freeze` (linha 164 deste ficheiro) para impedir alterações. Tenta alterar o saldo para 3000 e mostra o objeto para comprovar que não mudou.

   Consultar: [Copiar e atualizar](#copiar-atualizar)

---

8. <a id="ex8"></a>Cria um objeto `produto` com propriedades `nome`, `preco` e um método `descricao` que retorna uma string com o nome e o preço do produto usando `this`. Testa o método.

   Consultar: [this em métodos](#this-metodos)

---

9. <a id="ex9"></a>Ainda no exercicio anterior, adiciona a chave `stock` ao objeto `produto`e define o seu valor para 100. No final mostra o objeto completo.

   Consultar: [Ler, escrever e remover](#ler-escrever) · [this em métodos](#this-metodos)

---

## Exercícios por seção

- **O que é um objeto?** → Exercícios: [1](#ex1), [2](#ex2), [3](#ex3)
- **Criar objetos** → Exercícios: [1](#ex1), [2](#ex2), [3](#ex3)
- **Ler, escrever e remover** → Exercícios: [2](#ex2), [9](#ex9)
- **`this` em métodos** → Exercícios: [4](#ex4), [8](#ex8), [9](#ex9)
- **Iterar propriedades** → Exercício: [5](#ex5)
- **Copiar e atualizar** → Exercícios: [6](#ex6), [7](#ex7)
- **JSON rápido** → Exercícios: nenhum por enquanto

## Changelog

-   **v1.1.1 — 2025-11-11**
    -   Exercícios reorganizados com progressão suave, evitando funções independentes e focando numa tarefa por conceito.
-   **v1.1.0 — 2025-11-10**
    -   Secção de Exercícios ampliada com sete atividades sobre criação, cópia, `this` e utilitários `Object.*`.
    -   Changelog incluído para registar evoluções do capítulo.
