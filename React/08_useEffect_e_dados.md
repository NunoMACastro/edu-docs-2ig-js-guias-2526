# React.js (12.º Ano) - 08 · useEffect e dados externos

> **Objetivo deste ficheiro**
>
> - Compreender o que são **efeitos (side effects)** e quando usar `useEffect`.
> - Controlar **dependências** para evitar repetições desnecessárias, _stale data_ e loops.
> - Buscar dados de uma API com `fetch` e mostrar **loading / erro / sucesso**.
> - Aprender padrões “profissionais” (mas acessíveis) para evitar bugs comuns: **StrictMode**, **AbortController**, **race conditions**, e **referência vs valor**.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] O que é useEffect](#sec-1)
- [2. [ESSENCIAL] Render, commit e quando o efeito corre](#sec-2)
- [3. [ESSENCIAL] Dependências e ciclo de vida](#sec-3)
- [4. [ESSENCIAL] Buscar dados com fetch](#sec-4)
- [5. [ESSENCIAL+] Padrão de estados com `status`](#sec-5)
- [6. [EXTRA] Limpeza de efeitos (timers, listeners, pedidos)](#sec-6)
- [7. [EXTRA] Armadilhas comuns e diagnóstico rápido](#sec-7)
- [Exercícios - useEffect e dados externos](#exercicios)
- [Changelog](#changelog)

---

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **ESSENCIAL vs EXTRA:** domina `useEffect` com `[]` e com dependências antes de entrares em _cleanup_, abort e padrões mais avançados.
- **Como estudar:** cria exemplos pequenos e observa:
    - quantas vezes o componente renderiza,
    - quando o `useEffect` corre,
    - e o que muda quando mexes nas dependências.
- **Ligações:** se precisares, revê estado e eventos em `04_estado_e_eventos.md` e consumo de APIs em `11_consumo_api_e_backend_node.md`.

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] O que é useEffect

### 1.1 A ideia central (modelo mental)

Um **efeito (side effect)** é código que corre **depois** do React atualizar a interface, para sincronizar o componente com “o mundo exterior”.

Em React, tenta guardar esta regra simples:

- **Render (corpo do componente)**: calcula JSX a partir de estado/props (de forma previsível).
- **Effect (`useEffect`)**: faz trabalho que mexe com coisas fora do React (API, DOM, timers, storage, listeners…).

O `useEffect` existe para manter o render “limpo” e previsível, e para evitar que tarefas externas aconteçam na altura errada (ou vezes a mais).

---

### 1.2 “Ser puro” no render (o que isto quer dizer mesmo)

Quando dizemos que o render deve ser **puro**, queremos dizer:

- Se o estado/props forem iguais, o JSX calculado deve ser igual.
- O render **não deve causar efeitos colaterais** (não deve “disparar” pedidos, timers, escrita no DOM, etc.).

Uma analogia útil:

- Função matemática: `f(x)` para o mesmo `x` dá sempre o mesmo resultado.
- Componente React: `Component(estado, props)` devolve sempre o mesmo JSX **para as mesmas entradas**.

Isto não é para “ser bonito” — é para o React poder renderizar/re-renderizar com segurança.

---

### 1.3 Árvore de decisão: “Preciso mesmo de useEffect?”

Antes de escreveres um `useEffect`, passa por esta árvore (ela evita 80% dos maus usos).

1. **É uma ação causada por um utilizador?** (clique, submit, mudança de input)

- **Sim** → usa um **event handler** (`onClick`, `onSubmit`, etc.).
- **Não** → vai para 2.

2. **É um valor que depende apenas de estado/props?** (valor derivado)

- **Sim** → calcula no **render** (variável normal, `map`, `filter`).
- **Não** → vai para 3.

3. **Precisas de sincronizar com algo externo ao React?**

- **Sim** → usa `useEffect`.
    - Exemplos: `fetch`, `document.title`, `localStorage`, listeners, timers.
- **Não** → provavelmente não precisas de effect.

> **Regra rápida:**  
> Se a tarefa “faz sentido” sem UI (por exemplo, pedir dados a um servidor), isso é exterior → `useEffect`.  
> Se a tarefa é “reagir” a um clique, é evento → handler.

---

### 1.4 Event handler vs useEffect (comparação muito importante)

#### Caso A: certo (ação do utilizador → handler)

```jsx
function BotaoCarregar() {
    async function carregar() {
        // ação do utilizador -> handler
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await res.json();
        console.log("Dados:", data.length);
    }

    return <button onClick={carregar}>Carregar</button>;
}
```

Aqui não precisas de `useEffect` porque:

- a ação acontece **quando o utilizador pede**.

#### Caso B: certo (carregar ao abrir a página → useEffect)

```jsx
import { useEffect } from "react";

function CarregarAoMontar() {
    useEffect(() => {
        // tarefa externa que deve acontecer quando o componente aparece
        console.log("Vou carregar dados ao montar");
    }, []);

    return <p>Carrega ao abrir</p>;
}
```

---

### 1.5 Sintaxe base (passo a passo)

1. Importa o hook:

```jsx
import { useEffect } from "react";
```

2. Usa `useEffect` **no topo do componente** (nunca dentro de `if`, `for`, etc.).

3. Passa uma função: o que está lá dentro corre **depois** do React atualizar a UI.

4. Define dependências:

- `[]` → corre “uma vez ao montar” (caso típico)
- `[x]` → corre quando `x` muda
- `[a, b]` → corre quando `a` ou `b` mudam

5. Opcional: devolve uma função de limpeza (_cleanup_).

```jsx
useEffect(() => {
    // criar efeito (ex.: listener, timer, etc.)

    return () => {
        // limpar efeito (ex.: remover listener, limpar timer, abort do fetch)
    };
}, [dependencias]);
```

---

### 1.6 Porque não usar `async` diretamente no `useEffect`

Uma função `async` devolve sempre uma **Promise**. O `useEffect` espera receber:

- uma função normal, que pode devolver **uma função de limpeza** (ou `undefined`),
- **não** uma Promise.

Por isso, criamos uma função `async` **dentro** do effect e chamamos.

---

### 1.7 Exemplo 1: mudar o título ao montar

```jsx
import { useEffect } from "react";

/**
 * Demonstra um efeito simples:
 * - corre uma vez ao montar (dependências [])
 * - atualiza document.title (mundo exterior)
 */
function Pagina() {
    useEffect(() => {
        document.title = "Minha página";
    }, []);

    return <p>Conteúdo</p>;
}

export default Pagina;
```

---

### 1.8 Exemplo 2: “mau useEffect” (valor derivado)

Muita gente faz isto (e não precisa):

```jsx
import { useEffect, useState } from "react";

function Carrinho({ preco, quantidade }) {
    const [total, setTotal] = useState(0);

    // MAU: total é derivado de props, não é “mundo exterior”
    useEffect(() => {
        setTotal(preco * quantidade);
    }, [preco, quantidade]);

    return <p>Total: {total}</p>;
}
```

O correto é calcular no render:

```jsx
function Carrinho({ preco, quantidade }) {
    const total = preco * quantidade;
    return <p>Total: {total}</p>;
}
```

---

### 1.9 Erros comuns (para evitar logo)

- Colocar `useEffect` dentro de um `if` (quebra as regras dos hooks).
- Criar loops: o effect atualiza um estado que está nas dependências sem condição.
- Usar `useEffect` para coisas que pertencem a eventos (cliques, submits).
- Usar `useEffect` para calcular valores derivados.

---

### 1.10 Checkpoint

- Em que casos é que **não** deves usar `useEffect`?
- Qual a diferença entre “ação do utilizador” (handler) e “sincronizar com exterior” (effect)?
- Porque é que o render deve ser “puro”?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Render, commit e quando o efeito corre

Até aqui dissemos: **“o `useEffect` corre depois do React desenhar a interface”**.

Isto é verdade, mas convém perceber _o mínimo_ do que acontece “por trás”, porque assim **deixa de parecer magia** e começas a prever melhor:

- quando é que um componente volta a correr,
- quando é que um `fetch` pode repetir,
- e porque é que certos bugs (loops, duplicações, valores desatualizados) aparecem.

> **Importante:** não precisas de decorar os nomes “render” e “commit”. O que interessa é o **modelo mental**:
> **1) calcular UI** → **2) aplicar no ecrã** → **3) fazer tarefas externas**.

### 2.1 Primeiro: o que é “render” em React?

Em React, um componente é **uma função**.

Quando o React precisa de mostrar ou atualizar esse componente, ele **chama a função** para obter JSX.

Isto é “renderizar” (render).

Exemplo mental:

- React chama `MeuComponente()`
- a função devolve JSX (ex.: `<p>Olá</p>`)
- o React usa esse JSX para decidir o que deve aparecer no ecrã

No **render**:

- Deves **calcular** o que mostrar (JSX).
- **Não** devias fazer tarefas “externas” (API, timers, escrever no DOM diretamente, etc.).
- **Hooks (`useState`, `useEffect`) só no topo do componente** (nunca dentro de `if`, `for`, ou funções internas).

> Mini-dicionário (para não confundir):
>
> - **Render**: o React chama a função do componente para calcular JSX.
> - **Re-render**: o mesmo render, **outra vez**, porque algo mudou (estado/props/contexto). É normal e esperado.

### 2.2 Porque é que o componente “renderiza” várias vezes?

Um componente pode renderizar várias vezes porque:

- um **estado** mudou (`setState(...)`),
- chegaram novas **props** do pai,
- o componente foi montado pela primeira vez,
- (em alguns projetos) há mudanças no **contexto**,
- (em dev) o StrictMode pode forçar padrões que expõem problemas.

Isto é normal e esperado: React re-renderiza para manter a UI sincronizada com os dados.

### 2.3 As 3 fases (simplificadas)

Agora sim, a sequência mais útil:

1. **Render**

- React chama o componente (função) para **calcular JSX**.
- Aqui, idealmente só “pensa” na UI: `if`, `map`, `filter`, etc.

2. **Commit**

- React aplica as mudanças no **DOM** (o “HTML real” da página).
- É aqui que a interface “muda” no ecrã.

3. **Effect (`useEffect`)**

- Só depois do commit é que o React executa o `useEffect`.
- É aqui que faz sentido sincronizar com o exterior (API, título, listeners, etc.).

Mini-diagrama:

```
estado/props mudam
   ↓
render (calcular JSX)
   ↓
commit (atualizar DOM)
   ↓
useEffect (sincronizar com o exterior)
```

### 2.4 Experiência rápida (para “ver acontecer”)

Este exemplo serve só para perceber a ordem. Repara nos `console.log`.

```jsx
import { useEffect, useState } from "react";

/**
 * Demonstra a ordem:
 * 1) render (a função do componente corre)
 * 2) effect (corre depois do React atualizar o ecrã)
 */
function Ordem() {
    const [count, setCount] = useState(0);

    console.log("RENDER: a função do componente correu");

    useEffect(() => {
        console.log("EFFECT: correu depois do render/commit");
    }, [count]);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Somar</button>
        </div>
    );
}

export default Ordem;
```

O que vais observar:

- Sempre que clicas, aparece primeiro o log do **render**.
- Depois aparece o log do **effect**.

Isto ajuda-te a perceber que o `useEffect` é mesmo “pós-atualização”.

### 2.5 Consequência prática: porque não fazer `fetch` no corpo do componente?

Se fizeres isto:

```jsx
function Lista() {
    fetch("https://exemplo.com/dados"); // ERRADO
    return <p>Olá</p>;
}
```

O `fetch` vai correr:

- quando o componente montar,
- **e em todos os re-renders** (sempre que houver `setState`, novas props, etc.).

Resultado:

- pedidos duplicados,
- UI “a piscar”,
- e bugs difíceis de explicar.

A solução correta é:

- pôr o `fetch` dentro de `useEffect`,
- e controlar _quando_ ele corre com dependências.

```jsx
import { useEffect } from "react";

function Lista() {
    useEffect(() => {
        fetch("https://exemplo.com/dados");
    }, []); // corre uma vez ao montar (caso típico)

    return <p>Olá</p>;
}
```

> **Resumo desta secção:**  
> **Render** calcula JSX; **Commit** atualiza o DOM; **Effect** faz trabalho externo.  
> Por isso, tarefas externas como `fetch` devem estar em `useEffect` (com dependências corretas).

<a id="sec-3"></a>

## 3. [ESSENCIAL] Dependências e ciclo de vida

A pergunta mais importante do `useEffect` é sempre:
**“Quando é que isto deve voltar a correr?”**

A resposta está no array de dependências.

---

### 3.1 Modelo mental (o que o array faz)

O array de dependências é uma lista do que o effect “ouve”.

- **Sem array:** corre depois de **cada render**.
- **Array vazio `[]`:** corre **uma vez** quando o componente monta.
- **Array com valores:** corre quando **qualquer valor mudar**.

Isto liga ao ciclo de vida:

- **Montar:** aparece pela primeira vez.
- **Atualizar:** volta a renderizar (estado/props mudaram).
- **Desmontar:** sai do ecrã (entra a limpeza, na secção 6).

---

### 3.2 Tabela rápida (para decorar)

| Dependências  | Quando corre?                  | Usos típicos                                           |
| ------------- | ------------------------------ | ------------------------------------------------------ |
| _(sem array)_ | Depois de **todos** os renders | Debug rápido (raro)                                    |
| `[]`          | Apenas ao montar               | Pedidos iniciais, setup de listeners (com cleanup)     |
| `[x]`         | Quando `x` muda                | Sincronizar `document.title`, refazer fetch por filtro |
| `[a, b]`      | Quando `a` ou `b` mudam        | Efeitos que dependem de várias coisas                  |

---

### 3.3 A regra das dependências (simples e correta)

> **Tudo o que usas dentro do effect e vem de fora do effect (estado/props/funções) deve estar nas dependências.**

Isto existe para evitar o problema clássico: **stale data** (dados “antigos”).

---

### 3.4 Stale closure (dados desatualizados) — o bug mais comum

Um effect “vê” os valores do momento em que foi criado.

Se fizeres:

```jsx
import { useEffect, useState } from "react";

function ExemploStale() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            console.log("Count visto pelo timeout:", count);
        }, 2000);
    }, []); // <- deps vazias

    return <button onClick={() => setCount(count + 1)}>Somar</button>;
}
```

Se clicares no botão e depois esperares, podes ver logs com valores “antigos”.
Porquê? Porque o effect correu uma vez e “guardou” o `count` daquela altura.

**Soluções típicas:**

- colocar `count` nas dependências (se faz sentido repetir)
- ou usar a forma funcional do setState (quando o objetivo é “incrementar” sem depender do valor capturado)

Exemplo com atualização funcional (muito útil):

```jsx
setCount((c) => c + 1);
```

---

### 3.5 A armadilha “referência vs valor” (objetos, arrays e funções)

Em JavaScript, **objetos, arrays e funções** são comparados por **referência**, não por conteúdo.

Isto significa:

```jsx
const filtro = { type: "fire" }; // novo objeto em cada render
```

Mesmo que pareça igual, é **sempre diferente** na memória. Logo, como dependência, “muda sempre”.

#### Exemplo errado (effect a correr sempre)

```jsx
function Exemplo() {
    const filtro = { type: "fire" };

    useEffect(() => {
        console.log("Vai correr em todos os renders...");
    }, [filtro]);

    return null;
}
```

#### Como resolver (abordagens)

**Opção A (ESSENCIAL, mais simples):** criar dentro do effect (se não precisas dele no render)

```jsx
useEffect(() => {
    const filtro = { type: "fire" };
    console.log(filtro);
}, []);
```

**Opção B (EXTRA):** `useMemo` para estabilizar referência (quando precisas do objeto no render)

```jsx
import { useEffect, useMemo } from "react";

function ExemploMemo({ type }) {
    const filtro = useMemo(() => ({ type }), [type]);

    useEffect(() => {
        console.log(filtro);
    }, [filtro]);

    return null;
}
```

---

### 3.6 Funções nas dependências (o segundo “caos” comum)

Se defines uma função no render, ela também é uma “referência nova” em cada render.

```jsx
function Exemplo() {
    function carregar() {
        console.log("oi");
    }

    useEffect(() => {
        carregar();
    }, [carregar]); // isto pode causar repetição constante
}
```

Tens 3 soluções típicas:

1. **Mover a função para dentro do effect** (ESSENCIAL e simples)
2. **Usar `useCallback`** (EXTRA)
3. **Extrair para uma função utilitária fora do componente**

---

### 3.7 Checklist profissional (o que fazer quando o linter avisa)

Se o linter `react-hooks/exhaustive-deps` avisar, não é para “desligar”:
é para perceberes o motivo.

Passos:

1. Lê o effect e lista tudo o que ele usa: estado, props, funções.
2. Pergunta: “Quero que repita quando isto muda?”
3. Se a resposta for sim → mete nas deps.
4. Se a resposta for não → muda a abordagem (ex.: mover para handler, usar `useRef`, usar atualização funcional, etc.).

---

### 3.8 Exercício rápido (para sentir as dependências)

1. Cria um `useEffect` com `[]` e um `console.log("effect")`.
2. Faz `setState` com um botão e observa:
    - o componente re-renderiza,
    - mas o effect não repete.
3. Agora mete `[count]` e observa:
    - o effect repete quando `count` muda.

---

### 3.9 Checkpoint

- O que acontece quando o array de dependências está vazio?
- O que é _stale data_ e como acontece?
- Porque é que objetos/arrays/funções “mudam sempre” se forem criados no render?
- O que costuma querer dizer um aviso do linter nas dependências?

<a id="sec-4"></a>

## 4. [ESSENCIAL] Buscar dados com fetch

Até aqui já tens o modelo mental:

- o componente **renderiza** (calcula JSX),
- o React atualiza o ecrã,
- e só depois corre o `useEffect` para tarefas externas.

Agora falta a pergunta óbvia:
**“Ok… e o que é o `fetch`? E porque é que isto não pode ficar no render?”**

A ligação com a secção anterior é esta:

- no render, tu estás a **calcular UI**;
- um pedido HTTP é algo **lento e externo**, por isso deve acontecer no `useEffect`.

### 4.1 O que é `fetch` (mesmo)?

`fetch` é uma função (já existente no browser) que serve para fazer **pedidos HTTP** a um servidor (uma API).

Pensa assim:

- Tu tens uma **URL** (ex.: `https://.../users`)
- Fazes um **pedido** (request)
- O servidor responde com uma **resposta** (response)
- A resposta traz:
    - um **status** (200, 404, 500…)
    - **headers**
    - e um **corpo** (body), muitas vezes em **JSON**

Ou seja, o `fetch` é a tua “ponte” entre o frontend e dados externos.

> Nota: Em projetos reais também se usa `axios`, mas para começar, `fetch` é perfeito porque é nativo e obriga-te a perceber bem o fluxo.

> **Nota de organização:** quando o código cresce, é comum extrair o `fetch` para um helper em `src/services/...`  
> (ex.: `services/pokeApi.js` nas Fichas 03/04) para não encher o componente. Aqui mostramos inline para aprender o fluxo.

---

### 4.2 O modelo mental de um pedido HTTP (a “história completa”)

Um pedido típico em apps React é um **GET** (ir buscar dados):

1. **Frontend** pede:
    - “Dá-me a lista de alunos”

2. **Servidor** responde:
    - “Aqui está (status 200) e o JSON com a lista”

Mas também pode responder:

- `404` (não encontrado)
- `401` (não autenticado)
- `403` (sem permissões)
- `500` (erro do servidor)

Isto interessa porque **nem tudo o que corre mal é “erro de rede”**.

---

### 4.3 Porque é que `fetch` é assíncrono?

Porque o pedido pode demorar:

- 20 ms… ou 2 segundos… ou falhar.

Se o JavaScript “parasse tudo” à espera, a página congelava.

Então o `fetch` funciona de forma assíncrona:

- ele começa o pedido,
- o teu código continua,
- e mais tarde chega a resposta.

Por isso é que `fetch` devolve uma **Promise**.

---

### 4.4 Primeira experiência (para veres o que o `fetch` devolve)

Isto é muito útil para perceberes que o `fetch` **não devolve logo os dados**:

```js
const p = fetch("https://jsonplaceholder.typicode.com/users");
console.log(p); // Promise (não é a lista!)
```

Agora com `await` (forma moderna e mais legível):

```js
const res = await fetch("https://jsonplaceholder.typicode.com/users");
console.log(res); // Response (ainda não é o JSON)
```

Repara:

- `res` é um objeto **Response**
- ainda não tens os dados

Para obter os dados (JSON):

```js
const data = await res.json();
console.log(data); // agora sim: array de users
```

---

### 4.5 A armadilha nº1: `fetch` não lança erro em 404/500

Isto apanha quase toda a gente.

**`fetch` só lança erro automaticamente em problemas de rede** (ex.: sem internet).
Se o servidor responder com `404` ou `500`, o `fetch` resolve na mesma a Promise — porque isso é uma **resposta válida** do HTTP.

Por isso é que existe `res.ok`.

- `res.ok === true` → status 200–299
- `res.ok === false` → 400/500/etc.

Logo, em apps “a sério”, faz-se:

```js
if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
}
```

Isto força o erro a ir parar ao `catch`.

---

### 4.6 Regra prática (decorar mesmo)

Quando estás a buscar dados, segue sempre esta sequência:

1. `await fetch(...)` → tens uma **Response**
2. `if (!res.ok) throw ...` → validas o **HTTP**
3. `await res.json()` → tens os **dados**
4. `setState(...)` → atualizas a **UI**

> Nota útil: `res.json()` “consome” o body. Na prática, isso significa que **só o deves chamar uma vez** por resposta.

> Nota útil 2 (para APIs reais): nem todas as respostas são JSON. Se o backend devolver HTML ou corpo vazio, `res.json()` pode falhar. Em APIs reais, confirmamos o `Content-Type` antes de fazer parse (vais ver um template robusto mais abaixo no ficheiro).

---

### 4.7 O fluxo “profissional” no UI: loading / erro / sucesso

Num componente React, quando carregas dados, tens 3 estados visuais possíveis:

1. **Loading**
    - mostras “A carregar…”
2. **Erro**
    - mostras mensagem de erro
3. **Sucesso**
    - mostras a lista

Sem isto, o utilizador vê uma página vazia e não percebe nada.

---

### 4.8 Primeiro exemplo completo (simples e correto)

Agora vamos pôr isto num componente React com estados de ecrã (loading/erro/sucesso).

```jsx
import { useEffect, useState } from "react";

/**
 * Exemplo ESSENCIAL:
 * - usa useEffect para carregar ao montar
 * - controla loading / erro / dados
 * - valida res.ok (porque 404/500 não dão erro automaticamente)
 */
function ListaAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregar() {
            setLoading(true);
            setErro("");

            try {
                const res = await fetch(
                    "https://jsonplaceholder.typicode.com/users",
                );

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: pedido falhou`);
                }

                const data = await res.json();
                setAlunos(data.slice(0, 5));
            } catch (e) {
                const msg =
                    e instanceof Error ? e.message : "Falha ao carregar";
                setErro(msg);
            } finally {
                setLoading(false);
            }
        }

        carregar();
    }, []);

    if (loading) return <p>A carregar...</p>;
    if (erro) return <p>{erro}</p>;

    return (
        <ul>
            {alunos.map((a) => (
                <li key={a.id}>{a.name}</li>
            ))}
        </ul>
    );
}

export default ListaAlunos;
```

O que aprender aqui:

- O `fetch` está dentro do `useEffect` (não no render)
- Validamos `res.ok`
- Fazemos `res.json()` para ter dados reais
- O UI tem feedback (loading/erro)

---

### 4.9 Consequência prática: quando é que isto repete?

Este exemplo usa `[]`, por isso:

- corre **uma vez** ao montar.

Se meteres uma dependência (ex.: `url`), ele repete quando a `url` mudar:

```jsx
useEffect(() => {
    // carrega sempre que url muda
}, [url]);
```

Isto é o que vais usar quando tiveres:

- filtros,
- pesquisa,
- paginação,
- botão “recarregar”.

---

### 4.10 Erros comuns (para evitar logo)

- Fazer `fetch` no corpo do componente (vai repetir em cada render).
- Esquecer `res.ok` (e depois “não percebo porque é que não entra no catch”).
- Esquecer `await res.json()` (e tentar mapear a Response).
- Não mostrar loading/erro (UI “morta” sem feedback).

---

### 4.11 Checkpoint

- O que devolve `fetch(...)`?
- Porque é que precisas de `await res.json()`?
- Porque é que `fetch` não dá erro automaticamente em 404/500?
- Para que serve `res.ok`?

<a id="sec-5"></a>

## 5. [ESSENCIAL+] Padrão de estados com `status`

Nos exemplos iniciais, usámos 3 estados:

- `dados`
- `loading`
- `erro`

Isso funciona, mas em projetos reais aparece um problema:
**combinações incoerentes**.

Exemplos de combinações estranhas (que podem acontecer por bug):

- `loading = false` e `dados = []` e `erro = ""` → isto é “sucesso vazio” ou “ainda não carregou”?
- `loading = true` e `erro = "..."` → estamos a carregar ou deu erro?

O padrão com `status` resolve isto.

---

### 5.1 Modelo mental: “estado do ecrã” (UI state)

O `status` representa _em que fase está o ecrã_:

- `"loading"` → estamos à espera
- `"success"` → temos dados válidos
- `"error"` → falhou (e temos mensagem)

E assim o teu componente fica mais previsível.

---

### 5.2 Tabela de estados (invariantes)

| status  | UI deve mostrar | dados                     | erro     |
| ------- | --------------- | ------------------------- | -------- |
| loading | spinner/texto   | opcional                  | vazio    |
| success | lista/conteúdo  | presente (pode ser vazio) | vazio    |
| error   | mensagem        | opcional                  | presente |

> Nota: “dados vazio” pode ser válido (por exemplo, pesquisa sem resultados). A UI deve ter um estado “lista vazia” quando fizer sentido.

---

### 5.3 Exemplo completo com `status` (e botão Recarregar)

```jsx
import { useEffect, useState } from "react";

/**
 * Padrão recomendado para fetch:
 * - um estado 'status' evita combinações incoerentes
 * - botão recarregar força novo pedido
 */
function ListaPosts() {
    const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
    const [erro, setErro] = useState("");
    const [posts, setPosts] = useState([]);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        async function carregar() {
            setStatus("loading");
            setErro("");

            try {
                const res = await fetch(
                    "https://jsonplaceholder.typicode.com/posts",
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();
                setPosts(data.slice(0, 5));
                setStatus("success");
            } catch (e) {
                const msg =
                    e instanceof Error ? e.message : "Falha ao carregar";
                setErro(msg);
                setStatus("error");
            }
        }

        carregar();
    }, [reloadKey]);

    function recarregar() {
        setReloadKey((k) => k + 1);
    }

    return (
        <div>
            <button onClick={recarregar}>Recarregar</button>

            {status === "loading" && <p>A carregar...</p>}
            {status === "error" && <p>{erro}</p>}
            {status === "success" && (
                <ul>
                    {posts.map((p) => (
                        <li key={p.id}>{p.title}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListaPosts;
```

---

### 5.4 Quando é que faz sentido subir para `useReducer`? (nota curta)

Quando tens muitos estados e muitas transições, `useReducer` começa a compensar.
Mas para 12.º ano, o `status` já dá um salto enorme em organização sem aumentar demasiado a complexidade.

---

### 5.5 Checkpoint

- Que problema é que o `status` resolve?
- Quais são os 3 estados mais comuns de um ecrã com dados externos?
- Como é que um botão “Recarregar” pode forçar o effect a repetir?

<a id="sec-6"></a>

## 6. [EXTRA] Limpeza de efeitos (timers, listeners, pedidos)

Quando um effect cria algo que “fica ativo”, tens de o **limpar**.
Caso contrário, podes ter:

- múltiplos timers a correr
- listeners duplicados
- pedidos a terminar depois do componente sair (warnings)
- consumo desnecessário de recursos

---

### 6.1 Quando é que o cleanup corre? (muito importante)

A função de cleanup (a função que tu `return` dentro do `useEffect`) corre em 2 situações:

1. **Quando o componente desmonta** (sai do ecrã).
2. **Antes do effect correr novamente** (quando dependências mudam).

Mini-diagrama:

```
effect corre
   ↓
(mais tarde) deps mudam
   ↓
cleanup corre
   ↓
effect corre outra vez
```

---

### 6.2 Exemplo 1: `setInterval` (evitar intervalos duplicados)

```jsx
import { useEffect, useState } from "react";

/**
 * Relógio:
 * - cria setInterval
 * - limpa o intervalo ao desmontar
 */
function Relogio() {
    const [agora, setAgora] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => {
            setAgora(new Date());
        }, 1000);

        return () => clearInterval(id);
    }, []);

    return <p>Hora: {agora.toLocaleTimeString()}</p>;
}

export default Relogio;
```

---

### 6.3 Exemplo 2: listener (`resize`) (evitar listeners duplicados)

```jsx
import { useEffect, useState } from "react";

/**
 * Largura da janela:
 * - adiciona listener
 * - remove listener no cleanup
 */
function LarguraJanela() {
    const [largura, setLargura] = useState(window.innerWidth);

    useEffect(() => {
        function atualizar() {
            setLargura(window.innerWidth);
        }

        window.addEventListener("resize", atualizar);
        return () => window.removeEventListener("resize", atualizar);
    }, []);

    return <p>Largura: {largura}px</p>;
}

export default LarguraJanela;
```

---

### 6.4 Experiência “ver o leak” (montar/desmontar)

Um truque pedagógico muito útil é ter um botão que monta/desmonta um componente.

Se o componente tiver um listener/timer **sem cleanup**, vais ver comportamentos estranhos (duplicações).

```jsx
import { useState } from "react";
import Relogio from "./Relogio";

function App() {
    const [mostrar, setMostrar] = useState(true);

    return (
        <div>
            <button onClick={() => setMostrar((v) => !v)}>
                {mostrar ? "Esconder" : "Mostrar"} Relógio
            </button>

            {mostrar && <Relogio />}
        </div>
    );
}

export default App;
```

Com cleanup correto, não há duplicações e tudo fica “limpo” quando desmonta.

---

### 6.5 `fetch` + `AbortController` (evitar warnings e race conditions)

Quando um componente pode sair do ecrã, ou quando mudas filtros rapidamente, um pedido antigo pode:

- terminar depois (e tentar fazer `setState`),
- ou chegar fora de ordem (race condition).

O padrão recomendado é `AbortController`:

```jsx
import { useEffect, useState } from "react";

/**
 * Exemplo com AbortController:
 * - cancela o pedido se o componente sair
 * - cancela pedido anterior se dependências mudarem
 */
function ListaComAbort({ url }) {
    const [dados, setDados] = useState([]);
    const [status, setStatus] = useState("loading");
    const [erro, setErro] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function carregar() {
            setStatus("loading");
            setErro("");

            try {
                const res = await fetch(url, { signal: controller.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const json = await res.json();
                setDados(json);
                setStatus("success");
            } catch (e) {
                // ignorar cancelamento
                if (e instanceof Error && e.name === "AbortError") return;

                const msg =
                    e instanceof Error ? e.message : "Falha ao carregar";
                setErro(msg);
                setStatus("error");
            }
        }

        carregar();

        return () => controller.abort();
    }, [url]);

    if (status === "loading") return <p>A carregar...</p>;
    if (status === "error") return <p>{erro}</p>;

    return (
        <ul>
            {dados.slice(0, 3).map((item) => (
                <li key={item.id}>{item.name ?? item.title}</li>
            ))}
        </ul>
    );
}

export default ListaComAbort;
```

---

### 6.6 Boas práticas (resumo)

- Se crias timer/listener/subscrição → **há cleanup**.
- Se o effect pode repetir (deps) → cleanup corre antes do próximo.
- Para `fetch` em componentes “instáveis” (filtros, pesquisa, páginas) → **AbortController**.

---

### 6.7 Checkpoint

- Quando é que a função de limpeza corre?
- Que tipo de efeitos precisam de cleanup?
- Para que serve o `AbortController`?

<a id="sec-7"></a>

## 7. [EXTRA] Armadilhas comuns e diagnóstico rápido

Esta secção é para quando “algo está estranho” e precisas de diagnosticar rápido.

A ideia é ter um **método** (checklist) em vez de adivinhar.

---

### 7.1 Checklist de debug (o método)

1. **Quantas vezes renderiza?**

- põe um `console.log("RENDER")` no corpo do componente.

2. **Quando é que o effect corre?**

- põe um `console.log("EFFECT")` dentro do `useEffect`.

3. **Quais são as dependências?**

- confirma o array (e se está a mudar sem querer).

4. **O effect está a fazer `setState` do que ele próprio “ouve”?**

- isto é o padrão clássico de loop.

5. **Há objetos/arrays/funções criados no render nas dependências?**

- pode estar a repetir sempre por “referência vs valor”.

6. **Há pedidos em paralelo?**

- pode ser race condition (resolver com AbortController).

---

### 7.2 Loop infinito (padrão clássico)

```jsx
// ERRADO: o effect “ouve” count e atualiza count -> loop
useEffect(() => {
    setCount(count + 1);
}, [count]);
```

Porque acontece?

- `count` muda → re-render → effect volta a correr → `count` muda → ...

Como corrigir?

- querias correr uma vez? → `[]`
- querias reagir a algo específico? → não atualizes o mesmo estado sem condição
- muitas vezes pertence a um handler (ex.: clique) e não a um effect

---

### 7.3 “Não entra no catch em 404” (bug típico de fetch)

Se tens 404/500 e o `catch` não corre, lembra-te:

- `fetch` não lança erro para 404/500
- tens de validar `res.ok` e lançar erro

```js
if (!res.ok) throw new Error(`HTTP ${res.status}`);
```

---

### 7.4 Stale data (dados antigos) — diagnóstico

Sintoma:

- o effect usa um valor, mas parece “ficar preso” num valor antigo.

Causa típica:

- dependências em falta (`[]` quando devia ter `[valor]`).

Solução:

- inclui a dependência **ou** muda o padrão (ex.: atualização funcional).

---

### 7.5 StrictMode (dev) e “efeitos duplicados”

Em desenvolvimento, o StrictMode pode montar/desmontar e repetir efeitos para expor problemas (especialmente falta de cleanup).

Sintoma:

- vês logs repetidos
- vês pedidos duplicados em dev

O que fazer:

- confirmar se estás em dev (não acontece assim em produção)
- garantir cleanup/abort quando faz sentido
- não criar “flags mágicas” sem entender o motivo

---

### 7.6 Race condition (a resposta antiga chega depois)

Sintoma típico:

- fazes pesquisa/filtro rápido e a lista “volta atrás”

Causa:

- pedido A começa, depois pedido B começa
- o pedido A termina por último e sobrescreve o estado

Solução:

- `AbortController` (cancelar pedido anterior quando a dependência muda)

---

### 7.7 Template de logs (quando estás perdido)

```jsx
console.log("RENDER", { filtro, pagina, userId });

useEffect(() => {
    console.log("EFFECT", { filtro, pagina, userId });
}, [filtro, pagina, userId]);
```

Isto ajuda a ver:

- se as dependências mudam “sem querer”
- se o render está a acontecer muitas vezes
- se o effect está a repetir por causa de alguma referência nova

---

### 7.8 Checkpoint

- Quais são os 3 primeiros logs que fazes para perceber um bug de effects?
- O que causa loops infinitos em `useEffect`?
- O que é uma race condition e como se evita?

<a id="exercicios"></a>

## Exercícios - useEffect e dados externos

1. Cria `Pagina.jsx`. Importa `useEffect`, cria um componente simples e adiciona um effect com `[]` que muda `document.title` para `"Minha página"`. Usa o componente no `App` e confirma no browser.
2. No mesmo `Pagina`, adiciona um `console.log` dentro do `useEffect` para confirmar que só corre uma vez (em produção). Em dev, observa o efeito do StrictMode.
3. Cria `ContadorTitulo.jsx` com estado `count` e um botão "Somar". No `useEffect`, usa `[count]` e atualiza `document.title` com o valor atual. Clica no botão e confirma o título.
4. Cria `Relogio.jsx`. Adiciona um `setInterval` dentro do `useEffect` para atualizar a hora. Devolve cleanup com `clearInterval`.
5. Cria `LarguraJanela.jsx`. Adiciona um listener de `resize` no `useEffect`, guarda a largura em estado e remove o listener no cleanup.
6. Cria `ListaPosts.jsx` com estados `posts`, `loading` e `erro`. No `useEffect`, faz `fetch` a `https://jsonplaceholder.typicode.com/posts`, guarda só 5 itens e termina o loading.
7. Mostra "A carregar..." enquanto `loading` for `true` e mostra uma mensagem quando `erro` tiver texto.
8. Adiciona um `if (!res.ok)` no fetch e lança um erro para testar o estado de erro (simula com um URL errado).
9. Cria um botão "Recarregar" que altera um estado `forcar` e coloca `forcar` no array de dependências para repetir o fetch.
10. Adiciona um `setTimeout` dentro de um `useEffect` e garante que limpas o timeout no return.
11. Usa `AbortController` num `fetch` e garante que o erro `AbortError` é ignorado no `catch`.
12. (Diagnóstico) Faz um exemplo com loop infinito: cria um `useEffect` que “ouve” `count` e faz `setCount(count + 1)`. Explica por escrito porque acontece o loop e corrige.
13. (Referência vs valor) Cria um objeto `filtro = { tipo: "x" }` no render e mete-o nas dependências. Observa que o effect corre sempre. Corrige sem `useMemo`.
14. (Race condition) Faz um input de pesquisa (texto) que muda a `url` e dispara fetch. Implementa `AbortController` para cancelar pedidos anteriores quando o texto muda.

---

<a id="changelog"></a>

## Changelog

- 2026-01-11: criação do ficheiro.
- 2026-01-12: explicações detalhadas, exemplos extra e exercícios guiados.
- 2026-01-12: nota sobre StrictMode, motivo do `useEffect` não ser `async`, e exemplo com `AbortController`.
- 2026-01-12: secção de limpeza completada, checkpoints e exercícios 1-6 mais guiados.
- 2026-01-12: padrão de `fetch` alinhado e exemplo de dependências em falta.
- 2026-01-12: template base de `fetch` com parsing de erro JSON.
- 2026-01-26: reforço pedagógico (render/commit/effect), explicação “referência vs valor”, nota crítica sobre `fetch` e `res.ok`, padrão `status`, race conditions, e exercícios de diagnóstico (12–14).
- 2026-01-26: secções 1, 3, 5, 6 e 7 expandidas (mesmo estilo didático das secções 2 e 4), com árvore de decisão, stale data, status, cleanup e checklist de diagnóstico.
