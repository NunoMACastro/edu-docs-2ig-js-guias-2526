# React.js (11.º Ano) - 04 · Estado e eventos

> **Objetivo deste ficheiro**
> Entender o conceito de estado e porque ele é necessário no React.
> Aprender a usar `useState` e reagir a eventos do utilizador.
> Atualizar o estado de forma segura e previsível.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Estado com useState](#sec-1)
-   [2. [ESSENCIAL] Eventos e handlers](#sec-2)
-   [3. [ESSENCIAL] Atualização correta de estado](#sec-3)
-   [4. [EXTRA] Estado derivado e evitação de duplicação](#sec-4)
-   [Exercícios - Estado e eventos](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** aprende `useState` e eventos antes de explorar [EXTRA].
-   **Como estudar:** cria pequenos exemplos e testa os cliques.
-   **Ligações:** revê props e componentes em `03_props_e_composicao.md`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Estado com useState

### Modelo mental

Estado é um valor que **muda ao longo do tempo** e que o React usa para voltar a desenhar o componente. Pensa no estado como a "memória" do componente: o React guarda o valor entre renders.

O ponto mais importante para um aluno perceber é este:

-   **Variáveis normais** (`let`, `const`) não fazem o React atualizar a página.
-   **Estado** (com `useState`) faz o React atualizar a página quando muda.

Exemplo mental: tens um contador. Se fizeres `count = count + 1`, a variável muda, mas o ecrã **não** muda. Se usares `setCount(count + 1)`, o React volta a desenhar e o ecrã **muda**.

Também é útil lembrar: **props vêm de fora**, **estado vive dentro do componente**.

### Sintaxe base (passo a passo)

-   **Importa o hook:** `import { useState } from "react";`
-   **Chama `useState` no topo do componente:** nunca dentro de `if` ou `for`.
-   **Define um valor inicial:** pode ser `0`, `""`, `false`, `[]`, `{}`.
-   **Desestrutura o par:** `const [valor, setValor] = useState(inicial);`
-   **Atualiza com a função:** `setValor(novoValor)`.
-   **Nunca alteres diretamente:** não faças `valor = novoValor`.
-   **Mudança de estado = re-render:** o componente é redesenhado com o novo valor.

### Exemplo

```jsx
import { useState } from "react";

function Contador() {
    // count guarda o valor atual, setCount muda o valor
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Valor: {count}</p>
            {/* Ao clicar, atualizamos o estado */}
            <button onClick={() => setCount(count + 1)}>Somar</button>
        </div>
    );
}

export default Contador;
```

> **Nota sobre setState:** `setCount` não atualiza imediatamente. O React pode agrupar atualizações (batching), por isso um `console.log` logo a seguir ainda mostra o valor antigo.

```jsx
function ExemploLog() {
    const [count, setCount] = useState(0);

    function somar() {
        setCount(count + 1);
        console.log("Valor ainda antigo:", count);
    }

    return <button onClick={somar}>Somar</button>;
}
```

### Erros comuns

-   **Mudar o estado diretamente:** `count = count + 1` não provoca re-render.
-   **Esquecer de importar `useState`:** o código não compila.
-   **Assumir mudança imediata:** a atualização é assíncrona e pode ser agrupada.
-   **Usar `useState` fora do componente:** só funciona dentro de componentes React.

### Boas práticas

-   Começa com estados simples (número, texto, booleano).
-   Usa nomes claros: `[valor, setValor]`.
-   Mantém o estado mínimo; não guardes valores que podes calcular.

### Checkpoint

-   Porque é que `count = count + 1` não atualiza o ecrã?
-   O que significa “atualização assíncrona” no estado?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Eventos e handlers

### Modelo mental

Eventos são a forma de reagir a ações do utilizador: cliques, teclas, mudanças num input, submissão de formulário. Um **handler** é uma função que o React chama quando o evento acontece.

Pensa assim: o JSX "ouve" eventos e, quando acontecem, chama a função que tu escolheste.

### Sintaxe base (passo a passo)

-   **Eventos usam `camelCase`:** `onClick`, `onChange`, `onSubmit`.
-   **Passa uma função, não o resultado:** `onClick={alternar}`, não `onClick={alternar()}`.
-   **Handlers podem ser inline ou separados:** inline para ações simples, função separada para manter o JSX limpo.
-   **Podes receber o evento:** `function onChange(e) { ... }`.
-   **Evita lógica complexa no JSX:** coloca a lógica dentro do handler.

### Exemplo

```jsx
import { useState } from "react";

function BotaoToggle() {
    const [ligado, setLigado] = useState(false);

    // Handler separado para manter o JSX limpo
    function alternar() {
        setLigado(!ligado);
    }

    return (
        <div>
            <p>Estado: {ligado ? "Ligado" : "Desligado"}</p>
            {/* O onClick chama a função alternar */}
            <button onClick={alternar}>Alternar</button>
        </div>
    );
}

export default BotaoToggle;
```

```jsx
import { useState } from "react";

function CaixaTexto() {
    const [texto, setTexto] = useState("");

    function atualizarTexto(evento) {
        // O valor do input está em evento.target.value
        setTexto(evento.target.value);
    }

    return (
        <div>
            <input type="text" value={texto} onChange={atualizarTexto} />
            <p>Escreveste: {texto}</p>
        </div>
    );
}
```

### Erros comuns

-   **Escrever `onClick={alternar()}`:** a função é executada logo no render.
-   **Usar nomes de eventos em minúsculas (`onclick`):** o React não reconhece.
-   **Esquecer `event.target.value` no input:** ficas sem o texto escrito.

### Boas práticas

-   Se o handler cresce, move-o para fora do JSX.
-   Usa nomes que descrevem a ação: `abrirModal`, `alternarTema`.
-   Para inputs, liga sempre `value` e `onChange` (input controlado).

### Checkpoint

-   Qual é a diferença entre `onClick={funcao}` e `onClick={funcao()}`?
-   Que informação está em `event.target.value`?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Atualização correta de estado

### Modelo mental

Quando o novo estado depende do anterior, deves usar a **forma funcional**. Isto evita erros quando há várias atualizações seguidas ou quando o React agrupa atualizações.

Além disso, quando o estado é um **objeto** ou um **array**, tens de criar uma **cópia** antes de alterar. Se mexeres diretamente no objeto original, o React pode não perceber a mudança.

### Sintaxe base (passo a passo)

-   **Forma direta:** `setCount(count + 1)` (usa quando o valor não depende do anterior).
-   **Forma funcional:** `setCount((prev) => prev + 1)` (segura quando dependes do valor anterior ou fazes várias atualizações seguidas).
-   **Arrays:** cria novo array com `map`, `filter`, `concat` ou spread.
-   **Objetos:** cria cópia com spread e altera só o que precisas.

### Exemplo

```jsx
import { useState } from "react";

function DuploClique() {
    const [count, setCount] = useState(0);

    function somarDois() {
        // A forma funcional garante que usas o valor mais recente
        setCount((prev) => prev + 1);
        setCount((prev) => prev + 1);
    }

    return (
        <div>
            <p>Valor: {count}</p>
            {/* Um clique soma dois de forma segura */}
            <button onClick={somarDois}>Somar 2</button>
        </div>
    );
}

export default DuploClique;
```

```jsx
import { useState } from "react";

function Perfil() {
    const [aluno, setAluno] = useState({ nome: "Inês", idade: 16 });

    function fazerAniversario() {
        // Copiamos o objeto e alteramos apenas a idade
        setAluno((prev) => ({ ...prev, idade: prev.idade + 1 }));
    }

    return (
        <div>
            <p>
                {aluno.nome} - {aluno.idade} anos
            </p>
            <button onClick={fazerAniversario}>Fazer anos</button>
        </div>
    );
}
```

```jsx
import { useState } from "react";

function ListaTarefas() {
    const [tarefas, setTarefas] = useState([]);

    function adicionar(texto) {
        const nova = { id: Date.now(), texto };
        // Não uses push: cria sempre um array novo
        setTarefas((prev) => [...prev, nova]);
    }

    return <button onClick={() => adicionar("Nova tarefa")}>Adicionar</button>;
}
```

### Erros comuns

-   Atualizar objetos/arrays sem criar uma cópia.
-   Usar `push`/`splice` e depois `setState` com o mesmo array (mutação direta).
-   Guardar no estado valores que podem ser calculados.
-   Usar a forma direta quando dependes do valor anterior.

### Boas práticas

-   Para arrays, usa `map`, `filter` e `concat`.
-   Para objetos, usa o spread: `{ ...obj, chave: novo }`.
-   Quando fizeres várias alterações seguidas, prefere a forma funcional.

### Checkpoint

-   Quando é obrigatório usar a forma funcional?
-   Porque é que `push` não é recomendado no estado?

<a id="sec-4"></a>

## 4. [EXTRA] Estado derivado e evitação de duplicação

### Modelo mental

Estado derivado é algo que podes **calcular a partir de outro estado**. Se guardares o mesmo dado duas vezes, vais ter de atualizar os dois e é fácil criar inconsistências.

Regra simples: **guarda o mínimo** e calcula o resto.

### Sintaxe base (passo a passo)

-   Guarda o estado base (o que realmente muda).
-   Calcula valores derivados dentro do componente.
-   Usa variáveis locais para mostrar esses valores no JSX.

### Exemplo

```jsx
import { useState } from "react";

function Carrinho() {
    const [precoUnitario] = useState(10);
    const [quantidade, setQuantidade] = useState(1);

    // O total é derivado, não precisa de estado próprio
    const total = precoUnitario * quantidade;

    return (
        <div>
            <p>Total: {total} EUR</p>
            <button onClick={() => setQuantidade(quantidade + 1)}>
                Adicionar
            </button>
        </div>
    );
}

export default Carrinho;
```

```jsx
import { useState } from "react";

function NomeCompleto() {
    const [nome, setNome] = useState("Rita");
    const [apelido, setApelido] = useState("Silva");

    // fullName é derivado, não precisa de useState
    const fullName = `${nome} ${apelido}`;

    return (
        <div>
            <p>Nome completo: {fullName}</p>
            <button onClick={() => setNome("Ana")}>Mudar nome</button>
        </div>
    );
}
```

### Erros comuns

-   Criar `total` como estado e depois esquecer de atualizar.
-   Duplicar estado (ex.: guardar `nome` e `nomeCompleto`).

### Boas práticas

-   Mantém o estado mínimo e deriva o resto.

### Checkpoint

-   O que é estado derivado num exemplo simples?
-   Porque é melhor calcular do que guardar?

<a id="exercicios"></a>

## Exercícios - Estado e eventos

1. Cria um componente `Contador`. Usa `useState(0)`, mostra o valor e adiciona um botão "Somar" que incrementa.
2. No mesmo `Contador`, adiciona um botão "Subtrair" que diminui o valor em 1.
3. Adiciona um botão "Reset" que volta o contador a 0.
4. Cria um componente `Toggle`. Usa `useState(false)`, mostra "Ligado/Desligado" e um botão para alternar.
5. Cria um componente `CaixaTexto`. Usa `useState("")`, liga `value` e `onChange` e mostra o texto escrito.
6. Cria um contador que soma 2 de cada vez usando a forma funcional (`prev => prev + 1` duas vezes).
7. Cria um componente que mostra "Par" ou "Ímpar" conforme o valor do contador e um botão para incrementar.
8. Atualiza um objeto no estado (ex: `{ nome, idade }`).
9. Atualiza um array no estado (ex: adicionar item).
10. Cria dois botões: "Dobrar" e "Metade" para um valor numérico.

<a id="changelog"></a>

## Changelog

-   2026-01-11: criação do ficheiro.
-   2026-01-12: explicações detalhadas, exemplos extra e exercícios em formato passo a passo.
-   2026-01-12: nota sobre batching e reforço de imutabilidade em arrays/objetos.
