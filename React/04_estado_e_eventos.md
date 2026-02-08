# React.js (12.º Ano) - 04 · Estado e eventos

> **Objetivo deste ficheiro**
>
> - Perceber o que é **estado** e porque existe em React.
> - Usar `useState` para guardar informação que muda ao longo do tempo.
> - Reagir a **eventos** do utilizador (cliques, inputs, submit).
> - Atualizar estado de forma **segura e previsível** (batched updates, atualização funcional, imutabilidade).
> - Evitar bugs comuns: **loops**, **estado duplicado**, **mutação** de arrays/objetos e **valores desatualizados**.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] O que é estado e como funciona o useState](#sec-1)
- [2. [ESSENCIAL] Eventos e handlers (onClick, onChange, onSubmit)](#sec-2)
- [3. [ESSENCIAL] Atualização correta de estado (prevState, imutabilidade)](#sec-3)
- [4. [ESSENCIAL+] Estruturar estado (arrays/objetos) sem dores de cabeça](#sec-4)
- [5. [EXTRA] Estado derivado e “fonte de verdade”](#sec-5)
- [6. [EXTRA] Armadilhas comuns e diagnóstico rápido](#sec-6)
- [Exercícios - Estado e eventos](#exercicios)
- [Changelog](#changelog)

---

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **Ordem recomendada:** faz as experiências pequenas logo a seguir a cada secção.
- **O que observar:** sempre que muda o estado, o componente **volta a renderizar**.
- **Ligações úteis:**
    - Props e composição (para passares dados e callbacks): `03_props_e_composicao.md`
    - Formulários controlados (para inputs a sério): `06_formularios_controlados.md`
    - useEffect (para tarefas externas e dados): `08_useEffect_e_dados.md`

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] O que é estado e como funciona o useState

### 1.1 A ideia central (modelo mental)

Em React, um componente é uma **função** que devolve JSX.

O problema é: uma função normal não “guarda memória” entre chamadas.

Mas numa app, há coisas que mudam:

- um contador aumenta,
- um menu abre/fecha,
- um formulário vai sendo preenchido,
- uma lista ganha itens.

Para isso, React dá-te **estado**: a memória do componente.

Regra essencial:

- **Estado** é informação que pode mudar ao longo do tempo e que, quando muda, faz o React **voltar a desenhar** o componente.

Mini-diagrama:

```
estado muda (setState)
   ↓
React volta a chamar o componente (re-render)
   ↓
novo JSX é calculado
   ↓
a UI atualiza
```

Se guardares um valor numa variável normal (`let`), o React não sabe que tem de atualizar o ecrã.
Se guardares em **estado**, o React sabe.

---

### 1.2 Árvore de decisão: “Preciso de estado ou de uma variável normal?”

Antes de criares `useState`, responde a estas perguntas:

1. **Este valor vai mudar enquanto a página está aberta?**

- Não → variável normal basta.
- Sim → vai para 2.

2. **Quando o valor mudar, a UI deve atualizar?**

- Sim → usa **estado**.
- Não → pode ser variável normal (ou `useRef`, mais tarde).

3. **Este valor é calculável a partir de estado/props?**

- Sim → não guardes em estado. Calcula no render (estado derivado, secção 5).
- Não → estado faz sentido.

---

### 1.3 Sintaxe do useState (passo a passo)

1. Importa o hook:

```jsx
import { useState } from "react";
```

2. Cria o estado:

```jsx
const [count, setCount] = useState(0);
```

O que significa:

- `count` é o valor atual do estado.
- `setCount` é a função para atualizar o estado.
- `0` é o valor inicial (quando o componente monta).

3. Usa o estado no JSX:

```jsx
<p>Count: {count}</p>
```

4. Atualiza o estado com `setCount(...)` (normalmente dentro de handlers):

```jsx
setCount(count + 1);
```

---

### 1.4 Exemplo 1: contador básico (o clássico)

```jsx
import { useState } from "react";

/**
 * Contador
 * Demonstra o uso básico de useState com um botão.
 *
 * @returns {JSX.Element}
 */
function Contador() {
    const [count, setCount] = useState(0);

    function somar() {
        setCount(count + 1);
    }

    function reset() {
        setCount(0);
    }

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={somar}>Somar</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}

export default Contador;
```

O que aprender aqui:

- o handler (`somar`) é chamado quando clicas,
- o handler faz `setCount(...)`,
- o React volta a renderizar com o novo valor.

---

### 1.5 Experiência rápida: “render vs estado”

Este exemplo serve para veres que o componente é chamado de novo (re-render).

```jsx
import { useState } from "react";

/**
 * DebugRender
 * Mostra logs em cada render e confirma que setState provoca re-render.
 *
 * @returns {JSX.Element}
 */
function DebugRender() {
    const [count, setCount] = useState(0);

    console.log("RENDER: componente correu, count =", count);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Somar</button>
        </div>
    );
}

export default DebugRender;
```

O que observar:

- aparece “RENDER…” na consola a cada clique.
- isto não é “erro”: é o React a recalcular a UI.

---

### 1.6 Estado é um “snapshot” do render atual

Uma ideia que evita muitos bugs:

- Em cada render, `count` é um **valor fixo** (a fotografia daquele momento).
- Quando chamas `setCount`, estás a pedir ao React para renderizar novamente com outro valor.

Isto explica porque `console.log` logo a seguir ao `setCount` pode confundir:

```jsx
function somar() {
    setCount(count + 1);
    console.log(count); // ainda é o count do render atual
}
```

O novo valor só aparece no **próximo render**.

---

### 1.7 Erros comuns (para reconhecer rápido)

- **Alterar variáveis em vez de estado** e esperar que a UI mude.
- **Chamar setState no render** (causa loop).
- **Guardar em estado algo que é derivado** (duplicação de informação).
- **Mutar** arrays/objetos de estado (secção 3 e 4).

Checkpoint:

- O que é estado?
- Porque é que `setState` provoca re-render?
- Porque é que uma variável `let` não serve para atualizar UI?

---

<a id="sec-2"></a>

## 2. [ESSENCIAL] Eventos e handlers (onClick, onChange, onSubmit)

### 2.1 Modelo mental

A UI muda por duas razões principais:

- **o utilizador fez algo** (clicou, escreveu, submeteu),
- **chegaram dados** (useEffect, ficheiro 08).

Nesta secção focamos a primeira: eventos do utilizador.

Um **handler** é uma função que o React chama quando um evento acontece.

Mini-diagrama:

```
utilizador clica/escreve
   ↓
React dispara um evento (onClick/onChange/...)
   ↓
handler corre
   ↓
handler pode fazer setState
   ↓
UI atualiza
```

---

### 2.2 onClick (cliques)

A forma correta é passar a função:

```jsx
<button onClick={somar}>Somar</button>
```

Erro muito comum:

```jsx
<button onClick={somar()}>Somar</button> // ERRADO: executa logo no render
```

Regra simples:

- `onClick={somar}` → passa a função
- `onClick={somar()}` → executa já

---

### 2.3 Passar parâmetros ao handler

Às vezes queres chamar a mesma função com valores diferentes.

Exemplo: botões “+1”, “+5”, “+10”.

```jsx
import { useState } from "react";

/**
 * Incrementos
 * Demonstra como passar parâmetros em handlers.
 *
 * @returns {JSX.Element}
 */
function Incrementos() {
    const [count, setCount] = useState(0);

    function adicionar(valor) {
        setCount(count + valor);
    }

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => adicionar(1)}>+1</button>
            <button onClick={() => adicionar(5)}>+5</button>
            <button onClick={() => adicionar(10)}>+10</button>
        </div>
    );
}

export default Incrementos;
```

Porquê a arrow `() => adicionar(5)`?

- porque precisas de passar parâmetros,
- e não queres executar no render.

---

### 2.4 onChange (inputs)

Quando o utilizador escreve num input, o React dispara `onChange`.
O handler recebe um objeto `event` com informação sobre o que aconteceu.

Exemplo simples:

```jsx
import { useState } from "react";

/**
 * NomeAoVivo
 * Mostra o texto que o utilizador escreve num input.
 *
 * @returns {JSX.Element}
 */
function NomeAoVivo() {
    const [nome, setNome] = useState("");

    function onNomeChange(event) {
        setNome(event.target.value);
    }

    return (
        <div>
            <label>
                Nome:
                <input value={nome} onChange={onNomeChange} />
            </label>
            <p>Olá, {nome || "..."}</p>
        </div>
    );
}

export default NomeAoVivo;
```

Este padrão chama-se “input controlado” e é aprofundado no ficheiro 06.

---

### 2.5 onSubmit (formulários) e preventDefault

Quando tens um `<form>`, ao submeter, o browser tenta “recarregar” a página.
Numa SPA, não queres isso.

Então fazes:

```jsx
function onSubmit(event) {
    event.preventDefault();
    // lógica de submit aqui
}
```

Exemplo:

```jsx
import { useState } from "react";

/**
 * FormSimples
 * Demonstra onSubmit + preventDefault.
 *
 * @returns {JSX.Element}
 */
function FormSimples() {
    const [texto, setTexto] = useState("");

    function submeter(event) {
        event.preventDefault();
        alert(`Submeteste: ${texto}`);
        setTexto("");
    }

    return (
        <form onSubmit={submeter}>
            <input value={texto} onChange={(e) => setTexto(e.target.value)} />
            <button type="submit">Enviar</button>
        </form>
    );
}

export default FormSimples;
```

Checkpoint:

- Qual a diferença entre `onClick={f}` e `onClick={f()}`?
- Como se lê o texto de um input num `onChange`?
- Porque é que usamos `event.preventDefault()` num form?

---

<a id="sec-3"></a>

## 3. [ESSENCIAL] Atualização correta de estado (prevState, imutabilidade)

Nesta secção vais aprender os dois “pontos críticos” que evitam bugs:

1. atualizações baseadas no valor anterior (prevState)
2. não mutar arrays/objetos de estado (imutabilidade)

---

### 3.1 Batched updates: React pode agrupar updates

Às vezes, num mesmo handler, fazes várias atualizações.
React pode agrupá-las para performance.

Isto liga a um bug clássico: “tentei somar 2 mas só somou 1”.

Exemplo que confunde:

```jsx
function somarDuasVezes() {
    setCount(count + 1);
    setCount(count + 1);
}
```

Ambas as linhas usam o `count` do **mesmo render** (snapshot).
Resultado: pode ficar só +1.

---

### 3.2 Solução: atualização funcional (prevState)

Quando o novo estado depende do estado anterior, usa esta forma:

```jsx
setCount((prev) => prev + 1);
```

Agora dá para somar duas vezes corretamente:

```jsx
function somarDuasVezes() {
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
}
```

Exemplo completo:

```jsx
import { useState } from "react";

/**
 * ContadorSeguro
 * Demonstra atualização funcional quando o novo valor depende do anterior.
 *
 * @returns {JSX.Element}
 */
function ContadorSeguro() {
    const [count, setCount] = useState(0);

    function somar2() {
        setCount((prev) => prev + 1);
        setCount((prev) => prev + 1);
    }

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={somar2}>Somar 2</button>
        </div>
    );
}

export default ContadorSeguro;
```

Regra de ouro:

> Se o novo valor depende do anterior → usa `setX(prev => ...)`.

---

### 3.3 Imutabilidade: não alterar diretamente o estado

Estado em React deve ser tratado como “só de leitura”.
Não quer dizer que o valor nunca muda. Quer dizer que:

- tu crias **uma cópia** com as alterações,
- e passas essa cópia ao `setState`.

Isto é essencial em arrays/objetos porque o React deteta mudanças por **referência**.

Exemplo errado (mutação):

```jsx
// ERRADO: altera o mesmo array
todos.push(novoTodo);
setTodos(todos);
```

O correto (cópia):

```jsx
setTodos((prev) => [...prev, novoTodo]);
```

A ideia:

- `...prev` cria um novo array
- e adiciona o novo item no fim

---

### 3.4 Atualizar objetos (cópia com spread)

Exemplo: estado com objeto “perfil”:

```jsx
import { useState } from "react";

/**
 * PerfilSimples
 * Demonstra atualização de objeto sem mutação.
 *
 * @returns {JSX.Element}
 */
function PerfilSimples() {
    const [perfil, setPerfil] = useState({ nome: "Rita", idade: 17 });

    function fazerAniversario() {
        setPerfil((prev) => ({
            ...prev,
            idade: prev.idade + 1,
        }));
    }

    return (
        <div>
            <p>
                {perfil.nome} - {perfil.idade}
            </p>
            <button onClick={fazerAniversario}>+1 ano</button>
        </div>
    );
}

export default PerfilSimples;
```

Repara:

- não alteras `prev` diretamente
- crias um objeto novo com `...prev` e mudas só o que interessa

---

### 3.5 Checkpoint

- Porque é que `setCount(count + 1)` duas vezes pode não somar 2?
- Quando é que tens de usar `setX(prev => ...)`?
- Porque é que não se deve fazer `array.push(...)` num estado?

---

<a id="sec-4"></a>

## 4. [ESSENCIAL+] Estruturar estado (arrays/objetos) sem dores de cabeça

Nesta secção vais praticar os padrões mais usados em apps reais:

- adicionar itens
- remover itens
- editar itens
- alternar booleanos (toggle)

---

### 4.1 Arrays: adicionar e remover

Exemplo: lista de tarefas (sem backend).

```jsx
import { useState } from "react";

/**
 * ListaTarefas
 * Demonstra adicionar e remover itens num array de estado.
 *
 * @returns {JSX.Element}
 */
function ListaTarefas() {
    const [texto, setTexto] = useState("");
    const [tarefas, setTarefas] = useState([]);

    function adicionar(event) {
        event.preventDefault();

        const nome = texto.trim();
        if (!nome) return;

        const nova = {
            id: crypto.randomUUID(),
            nome,
            feita: false,
        };

        setTarefas((prev) => [...prev, nova]);
        setTexto("");
    }

    function remover(id) {
        setTarefas((prev) => prev.filter((t) => t.id !== id));
    }

    return (
        <div>
            <h2>Tarefas</h2>

            <form onSubmit={adicionar}>
                <input
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Nova tarefa"
                />
                <button type="submit">Adicionar</button>
            </form>

            {tarefas.length === 0 ? (
                <p>Sem tarefas.</p>
            ) : (
                <ul>
                    {tarefas.map((t) => (
                        <li key={t.id}>
                            {t.nome}{" "}
                            <button onClick={() => remover(t.id)}>
                                Remover
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListaTarefas;
```

Padrões importantes aqui:

- `setTarefas(prev => [...prev, nova])` para adicionar
- `filter` para remover
- `crypto.randomUUID()` para id (mais simples do que contadores)

---

### 4.2 Toggle (alternar true/false) num item

Agora queremos marcar uma tarefa como feita/não feita.

Padrão: `map` e trocar apenas o item certo.

```jsx
function alternarFeita(id) {
    setTarefas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)),
    );
}
```

Se quiseres mostrar o estado no JSX:

```jsx
<li key={t.id}>
    <label>
        <input
            type="checkbox"
            checked={t.feita}
            onChange={() => alternarFeita(t.id)}
        />
        {t.feita ? <s>{t.nome}</s> : t.nome}
    </label>
    <button onClick={() => remover(t.id)}>Remover</button>
</li>
```

O que estás a fazer:

- crias um novo array
- para o item certo, crias um novo objeto com `{ ...t, feita: !t.feita }`

---

### 4.3 Editar texto de um item (padrão de edição)

Editar segue o mesmo padrão do toggle:

- `map`
- alterar apenas o item com `id` certo

```jsx
function renomear(id, novoNome) {
    setTarefas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, nome: novoNome } : t)),
    );
}
```

---

### 4.4 Boas regras para estrutura de estado

- Mantém o estado com **poucos níveis** (2 níveis costuma ser o ideal).
- Se começa a ficar demasiado aninhado, considera dividir estado (vários `useState`) ou repensar o modelo.
- Evita duplicar informação (secção 5).

Checkpoint:

- Como adicionas e removes itens num array sem mutação?
- Porque é que o `map` é útil para editar um item?
- Porque é que o `id` é tão importante em listas?

---

<a id="sec-5"></a>

## 5. [EXTRA] Estado derivado e “fonte de verdade”

Aqui está uma regra que melhora muito a qualidade do código:

> Se um valor pode ser calculado a partir de estado/props, não o guardes em estado.
> Calcula no render.

Isto evita bugs de “um valor mudou mas o outro não”.

---

### 5.1 Exemplo de mau padrão: estado duplicado

```jsx
import { useEffect, useState } from "react";

function Carrinho({ preco, quantidade }) {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setTotal(preco * quantidade);
    }, [preco, quantidade]);

    return <p>Total: {total}</p>;
}
```

Problema:

- `total` é só `preco * quantidade`. É informação repetida.

---

### 5.2 Padrão correto: calcular no render

```jsx
function Carrinho({ preco, quantidade }) {
    const total = preco * quantidade;
    return <p>Total: {total}</p>;
}
```

Isto é mais simples e mais seguro.

---

### 5.3 Fonte de verdade (single source of truth)

Em apps reais, tenta que cada informação tenha um “dono” claro.

Exemplo:

- se tens uma lista de tarefas (`tarefas`), o número de tarefas feitas é derivado:

```jsx
const feitas = tarefas.filter((t) => t.feita).length;
```

Não guardes `feitas` em estado. Calcula.

---

### 5.4 Quando é que faz sentido guardar algo “derivado”?

Raramente, mas há casos:

- o cálculo é muito pesado
- e queres memorizar com `useMemo` (mais tarde, ficheiro próprio ou secção EXTRA)

Para 12.º ano, regra prática:

- calcula no render sempre que for simples (e geralmente é).

Checkpoint:

- O que é estado derivado?
- Porque é que duplicar estado causa bugs?
- O que significa “fonte de verdade”?

---

<a id="sec-6"></a>

## 6. [EXTRA] Armadilhas comuns e diagnóstico rápido

Quando algo “está estranho”, não adivinhes: observa.

---

### 6.1 Checklist de diagnóstico (método rápido)

1. **Quantas vezes renderiza?**

- põe um `console.log("RENDER", estado)` no corpo do componente.

2. **Onde está a atualização de estado?**

- confirma se está em handlers (ok) ou no render (perigo).

3. **Estás a mutar arrays/objetos?**

- procura `push`, `splice`, `sort`, `obj.algo = ...` em estado.

4. **O novo estado depende do anterior?**

- se sim, usa atualização funcional `setX(prev => ...)`.

---

### 6.2 Loop infinito (padrão clássico)

Se fizeres isto no render, tens loop:

```jsx
function Loop() {
    const [x, setX] = useState(0);

    setX(x + 1); // ERRADO: setState no render

    return <p>{x}</p>;
}
```

Porquê?

- render chama `setX` → muda estado → re-render → chama `setX` → ...

Correção:

- atualiza estado em handlers (`onClick`) ou em `useEffect` (quando é tarefa externa, ficheiro 08).

---

### 6.3 “Não atualiza a UI” (variável normal)

Sintoma:

- mudas uma variável, mas o ecrã não muda.

Causa:

- não é estado.

Exemplo:

```jsx
let count = 0; // ERRADO: isto perde-se e não provoca render

function somar() {
    count += 1;
}
```

Solução:

- usar `useState`.

---

### 6.4 Mutação escondida (arrays/objetos)

Algumas funções alteram o array original:

- `push`, `pop`, `splice`, `sort`, `reverse`

Se isso estiver ligado a estado, dá problemas.

Solução:

- usa `map`, `filter`, `slice`, spread (`[...]`) e cria cópias.

---

### 6.5 “Cliquei e somou só 1” (quando era para somar 2)

Causa:

- usaste `setCount(count + 1)` duas vezes.

Solução:

- atualização funcional.

```jsx
setCount((prev) => prev + 1);
```

Checkpoint:

- Como reconheces um loop causado por setState?
- Que sinais mostram que estás a mutar estado?
- Quando tens de usar atualização funcional?

---

<a id="exercicios"></a>

## Exercícios - Estado e eventos

1. **Contador**

- Cria `Contador.jsx` com `count` e botão “Somar”.
- Adiciona também “Reset”.

2. **Duas atualizações**

- Cria um botão “Somar 2”.
- Faz primeiro com `setCount(count + 1)` duas vezes e observa.
- Corrige com atualização funcional.

3. **Toggle**

- Cria `Toggle.jsx` com estado `ligado` (boolean).
- Um botão alterna entre true/false e o texto muda (“Ligado/Desligado”).

4. **Input controlado**

- Cria `NomeAoVivo.jsx` com `nome` e um input.
- Mostra `Olá, {nome}` e limpa com um botão “Limpar”.

5. **Form submit**

- Cria `FormSimples.jsx` com `onSubmit` e `preventDefault`.
- Ao submeter, mostra um `alert` e limpa o input.

6. **Lista de tarefas (parte 1)**

- Cria `ListaTarefas.jsx` com `tarefas` (array) e `texto`.
- Adiciona tarefas com `form` + submit.

7. **Lista de tarefas (parte 2)**

- Adiciona botão “Remover” por tarefa (usa `filter`).

8. **Lista de tarefas (parte 3)**

- Adiciona checkbox para “feita” (usa `map` e copia objeto).

9. **Estado derivado**

- Mostra: “Feitas: X / Total: Y” calculado no render (sem estado extra).

10. **Diagnóstico**

- Faz de propósito um `push` num array de estado e observa o comportamento.
- Corrige usando `setTarefas(prev => [...prev, nova])`.

---

<a id="changelog"></a>

## Changelog

- 2026-01-11: criação do ficheiro.
- 2026-01-26: atualização completa para nível didático mais alto: modelo mental de estado como “memória do componente”, árvore de decisão (estado vs variável), snapshot de render, eventos e handlers, atualização funcional, imutabilidade, padrões para arrays/objetos e checklist de diagnóstico.
