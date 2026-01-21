# React.js (11.º Ano) - 05 · Listas e renderização condicional

> **Objetivo deste ficheiro**
> Renderizar listas de dados com `map` e usar chaves (`key`).
> Mostrar ou esconder elementos com condicionais simples.
> Lidar com listas vazias de forma clara para o utilizador.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Renderizar listas com map e key](#sec-1)
-   [2. [ESSENCIAL] Condicionais no JSX](#sec-2)
-   [3. [ESSENCIAL] Estados vazios e mensagens](#sec-3)
-   [4. [EXTRA] Ordenar e filtrar listas](#sec-4)
-   [Exercícios - Listas e condicionais](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** aprende primeiro `map` e condicionais básicas.
-   **Como estudar:** cria arrays pequenos e altera os dados.
-   **Ligações:** se precisares, revê estado em `04_estado_e_eventos.md`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Renderizar listas com map e key

### Modelo mental

Quando tens vários itens (tarefas, alunos, produtos), o React precisa de uma lista de componentes. Uma lista em React é, na prática, **um array transformado em JSX**.

-   O `map` percorre o array e devolve **um novo array** de elementos JSX.
-   A `key` ajuda o React a **identificar cada item** entre renders. Sem `key`, o React pode confundir itens e atualizar coisas erradas.

Pensa na `key` como o número de aluno numa turma: se dois alunos mudam de lugar, o professor continua a saber quem é quem.

### Sintaxe base (passo a passo)

-   **Começa com um array:** pode ser de strings ou objetos.
-   **Usa `map` para criar JSX:** cada item devolve um `<li>` ou um componente.
-   **Envolve em parênteses** quando o JSX tem várias linhas.
-   **Define `key` no elemento externo:** a `key` deve ser **única e estável**.
-   **Não uses o índice se houver id:** o índice muda quando a lista muda de ordem.
-   **`key` não chega ao componente:** se precisares do id, passa como prop separada.

### Tabela rápida de `key`

| Situação                | Boa `key`       | Má `key`              |
| ----------------------- | --------------- | --------------------- |
| Lista com IDs           | `key={item.id}` | `key={index}`         |
| Lista fixa (nunca muda) | `key={index}`   | `key={Math.random()}` |
| Lista ordenada/filtrada | `key={item.id}` | `key={index}`         |

### Porque o índice falha (exemplo curto)

Se a lista muda (remover, ordenar, inserir no meio), o índice também muda e o React pode reaproveitar o DOM errado.

```jsx
import { useState } from "react";

const tarefasIniciais = [
    { id: 1, texto: "Estudar" },
    { id: 2, texto: "Treinar" },
    { id: 3, texto: "Descansar" },
];

function ListaComIndice() {
    const [tarefas, setTarefas] = useState(tarefasIniciais);

    function removerPrimeira() {
        setTarefas((prev) => prev.slice(1));
    }

    return (
        <>
            <button onClick={removerPrimeira}>Remover primeira</button>
            <ul>
                {/* ERRADO quando a lista muda */}
                {tarefas.map((tarefa, index) => (
                    <li key={index}>{tarefa.texto}</li>
                ))}
            </ul>
        </>
    );
}
```

Troca por `key={tarefa.id}` e o React mantém cada item certo.

### Exemplo

```jsx
const alunos = [
    { id: 1, nome: "Ana" },
    { id: 2, nome: "Bruno" },
    { id: 3, nome: "Carla" },
];

function ListaAlunos() {
    return (
        <ul>
            {/* map transforma cada aluno num <li> */}
            {alunos.map((aluno) => (
                <li key={aluno.id}>{aluno.nome}</li>
            ))}
        </ul>
    );
}

export default ListaAlunos;
```

```jsx
function AlunoItem({ nome }) {
    // Componente simples que mostra o nome de um aluno
    return <li>{nome}</li>;
}

function ListaAlunos() {
    return (
        <ul>
            {/* key fica no elemento da lista, não dentro do componente */}
            {alunos.map((aluno) => (
                <AlunoItem key={aluno.id} nome={aluno.nome} />
            ))}
        </ul>
    );
}
```

### Erros comuns

-   Usar o índice do array como `key` sem necessidade.
-   Esquecer a `key` e receber avisos no terminal.
-   Usar `Math.random()` para `key` (muda sempre e estraga o desempenho).
-   Colocar a `key` no elemento errado (tem de ser no primeiro elemento do `map`).

### Boas práticas

-   Usa IDs reais quando existirem.
-   Mantém o JSX dentro do `map` simples.
-   Se o JSX ficar grande, cria um componente para cada item.

### Checkpoint

-   Porque é que a `key` deve ser estável?
-   Quando é aceitável usar o índice como `key`?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Condicionais no JSX

### Modelo mental

Para mostrar ou esconder algo, usas condicionais. No JSX **não podes usar `if` direto**, mas tens alternativas simples. A ideia é: **decidir antes** o que vais renderizar e depois colocar o resultado no JSX.

### Sintaxe base (passo a passo)

-   **Operador `&&`:** mostra algo apenas se a condição for verdadeira.
-   **Operador ternário:** `condição ? A : B` para duas opções.
-   **Variável antes do `return`:** calcula `const conteudo = ...` e usa no JSX.
-   **`if` fora do JSX:** podes usar `if` antes do `return` quando a lógica é maior.

### Exemplo

```jsx
function Mensagem({ logado }) {
    return (
        <div>
            {/* Se logado for true, mostra a frase */}
            {logado && <p>Bem-vindo!</p>}
            {/* Ternário para duas opções */}
            <p>{logado ? "Conta ativa" : "Visitante"}</p>
        </div>
    );
}

export default Mensagem;
```

```jsx
function Aviso({ idade }) {
    // Mensagem base, pode mudar conforme a idade
    let mensagem = "Visitante";

    if (idade >= 18) {
        // Se for maior de idade, trocamos a mensagem
        mensagem = "Maior de idade";
    }

    return <p>{mensagem}</p>;
}
```

### Erros comuns

-   Tentar usar `if` diretamente no JSX.
-   Esquecer o `:` no ternário.
-   Usar `&&` com valores numéricos e acabar por renderizar `0`.

### Boas práticas

-   Usa `&&` para condições simples.
-   Se a condição for complexa, calcula antes numa variável.
-   Mantém o JSX limpo e legível.

### Checkpoint

-   Quando usar `&&` e quando usar ternário?
-   Porque é que `if` não pode estar dentro do JSX?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Estados vazios e mensagens

### Modelo mental

Se a lista estiver vazia, o utilizador precisa de uma mensagem clara. Um ecrã vazio passa a ideia de erro. Por isso, mostra sempre um texto alternativo quando não há dados.

### Sintaxe base (passo a passo)

-   **Verifica o tamanho:** `lista.length === 0`.
-   **Mostra uma mensagem alternativa** quando a lista está vazia.
-   **Garante que a lista existe:** usa um array vazio por defeito.
-   **Mostra contagem quando faz sentido:** ajuda o utilizador a perceber o estado.

### Exemplo

```jsx
function ListaTarefas({ tarefas = [], filtro = "todas" }) {
    const filtradas = tarefas.filter((tarefa) => {
        if (filtro === "feitas") return tarefa.feita;
        if (filtro === "por-fazer") return !tarefa.feita;
        return true;
    });

    return (
        <div>
            {/* Mensagem quando não há tarefas */}
            {filtradas.length === 0 ? (
                <p>Sem tarefas por agora.</p>
            ) : (
                <ul>
                    {filtradas.map((tarefa) => (
                        <li key={tarefa.id}>{tarefa.texto}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListaTarefas;
```

### Erros comuns

-   Mostrar uma lista vazia sem dizer nada.
-   Usar `length` sem verificar se o array existe.
-   Esquecer de usar uma `key` quando a lista tem itens.

### Boas práticas

-   Define um array vazio por defeito.
-   Usa mensagens curtas e claras.
-   Se houver ação possível, sugere-a (ex.: "Adiciona a primeira tarefa").

### Checkpoint

-   Como verificas se uma lista está vazia?
-   Porque é importante mostrar uma mensagem alternativa?

<a id="sec-4"></a>

## 4. [EXTRA] Ordenar e filtrar listas

### Modelo mental

Podes mostrar apenas parte da lista ou ordenar antes de renderizar. Isto ajuda a criar filtros simples para o utilizador e manter a interface organizada.

O cuidado principal: alguns métodos, como `sort`, **alteram o array original**. Em React, preferimos não alterar o original; criamos uma cópia.

### Sintaxe base (passo a passo)

-   **`filter`** para selecionar itens.
-   **`sort`** para ordenar (faz cópia antes).
-   **`slice`** para copiar parte da lista.
-   **Deriva a lista antes do `return`:** mantém o JSX simples.

### Exemplo

```jsx
const produtos = [
    { id: 1, nome: "Caderno", preco: 3 },
    { id: 2, nome: "Mochila", preco: 25 },
    { id: 3, nome: "Caneta", preco: 1 },
];

function ListaBaratos() {
    // Filtra apenas produtos com preço até 5
    const baratos = produtos.filter((p) => p.preco <= 5);

    return (
        <ul>
            {baratos.map((p) => (
                <li key={p.id}>{p.nome}</li>
            ))}
        </ul>
    );
}

export default ListaBaratos;
```

```jsx
function ListaOrdenada() {
    // Fazemos cópia antes de ordenar para não mexer no original
    const ordenados = [...produtos].sort((a, b) => a.preco - b.preco);

    return (
        <ul>
            {ordenados.map((p) => (
                <li key={p.id}>
                    {p.nome} - {p.preco} EUR
                </li>
            ))}
        </ul>
    );
}
```

### Erros comuns

-   Usar `sort` direto e alterar o array original.
-   Esquecer de devolver no `filter` (fica tudo vazio).
-   Ordenar por texto sem comparar corretamente (ex.: "10" antes de "2").

### Boas práticas

-   Faz uma cópia antes de ordenar: `const copia = [...lista]`.
-   Mantém a lógica de filtro e ordenação fora do JSX.

### Checkpoint

-   Porque é que `sort` pode ser perigoso no estado?
-   Qual a diferença entre `filter` e `map`?

<a id="exercicios"></a>

## Exercícios - Listas e condicionais

1. Cria um array com 5 nomes. Depois, usa `map` para transformar cada nome num `<li>` e mostra tudo dentro de um `<ul>`.
2. Troca o array de nomes por um array de objetos `{ id, nome }`. Em seguida, usa `key={id}` no `<li>`.
3. Cria um array vazio `[]`. Mostra a mensagem "Lista vazia" quando `length === 0`. Depois adiciona um item e confirma que a lista aparece.
4. Cria um componente `EstadoOnline`. Passa a prop `online` e mostra "Online" ou "Offline" com um ternário. Testa com `true` e `false`.
5. Cria uma variável `idade`. Usa `&&` para mostrar um parágrafo apenas se `idade >= 18`. Testa com valores diferentes.
6. Cria uma lista de tarefas com `{ id, texto, feito }`. Renderiza todas e, ao lado de cada tarefa, mostra "Feito" ou "Por fazer" com um ternário.
7. A partir da lista de tarefas, cria uma lista `pendentes` com `filter` e renderiza apenas as não concluídas.
8. Ordena uma lista de números de forma crescente.
9. Usa uma `key` errada de propósito e observa o aviso.
10. Substitui a `key` errada por uma correta.
11. Mostra uma mensagem diferente quando a lista tem mais de 5 itens.

<a id="changelog"></a>

## Changelog

-   2026-01-11: criação do ficheiro.
-   2026-01-12: explicações detalhadas, exemplos extra e exercícios em formato passo a passo.
-   2026-01-12: reforço de `key` estável e exemplo de estado vazio com lista filtrada.
