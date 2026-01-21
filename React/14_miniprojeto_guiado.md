# React.js (11.º Ano) - 14 · Mini-projeto guiado (React puro)

> **Objetivo deste ficheiro**
> Construir uma app simples apenas com React (sem backend).
> Seguir um tutorial passo a passo, desde a estrutura até às funcionalidades principais.
> Consolidar estado, listas, condicionais e organização básica do projeto.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Descrição do mini-projeto e requisitos](#sec-1)
-   [2. [ESSENCIAL] Planeamento de componentes e estado](#sec-2)
-   [3. [ESSENCIAL] Implementação passo a passo](#sec-3)
-   [4. [EXTRA] Melhorias opcionais](#sec-4)
-   [Checklist - Mini-projeto](#checklist)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** faz o projeto base primeiro; as melhorias são opcionais.
-   **Como estudar:** implementa cada passo e confirma no browser antes de seguir.
-   **Ligações:** revê `04_estado_e_eventos.md`, `05_listas_e_condicionais.md` e `06_formularios_controlados.md`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Descrição do mini-projeto e requisitos

### Modelo mental

Vamos criar uma **Lista de Tarefas do Dia**. A app permite:

-   Escrever uma tarefa.
-   Adicionar à lista.
-   Marcar como feita.
-   Filtrar entre todas, feitas e por fazer.

Não usamos backend. Tudo vive no estado do React, porque o objetivo é treinar **estado, listas e condicionais**.

### Requisitos (o que a app deve fazer)

1. Mostrar um título e um formulário simples.
2. Adicionar tarefas à lista.
3. Marcar tarefas como concluídas.
4. Filtrar tarefas por estado.
5. Mostrar mensagem quando não há tarefas.

### Estrutura de dados (tarefa)

Cada tarefa vai ser um objeto com 3 campos:

```jsx
// Estrutura de uma tarefa
const tarefaExemplo = {
    // id único para usar como key
    id: 1,
    // texto que o utilizador escreveu
    texto: "Estudar React",
    // indica se está concluída
    feita: false,
};
```

### Erros comuns

-   Não usar `id` único e o React reclamar da `key`.
-   Guardar tarefas como texto simples e depois precisar de mais dados.

### Boas práticas

-   Usa sempre objetos para tarefas (mais flexível).
-   Faz testes visuais: adicionar, riscar, filtrar.

### Checkpoint

-   Porque é que uma tarefa deve ser um objeto e não só texto?
-   Que partes do projeto treinam listas e condicionais?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Planeamento de componentes e estado

### Modelo mental

Antes de escrever código, planeia os blocos. Isso evita mudanças grandes a meio.

### Componentes sugeridos

| Componente    | Responsabilidade              |
| ------------- | ----------------------------- |
| `App`         | Estado principal e composição |
| `TarefaForm`  | Formulário de adicionar       |
| `TarefaLista` | Lista de tarefas              |
| `TarefaItem`  | Cada tarefa                   |
| `Filtro`      | Botões de filtro              |

### Estado necessário

-   `tarefas`: array de objetos.
-   `texto`: conteúdo do input.
-   `filtro`: `"todas"`, `"feitas"`, `"por-fazer"`.

```jsx
// Estado base no App
// tarefas guarda todas as tarefas criadas
const [tarefas, setTarefas] = useState([]);
// texto guarda o que o utilizador escreve
const [texto, setTexto] = useState("");
// filtro decide o que aparece na lista
const [filtro, setFiltro] = useState("todas");
```

### Fluxo de dados (simplificado)

1. Utilizador escreve no input → `texto` muda.
2. Clica em "Adicionar" → nova tarefa entra em `tarefas`.
3. Clica numa tarefa → `feita` alterna.
4. Muda filtro → lista renderiza só o necessário.

### Erros comuns

-   Colocar `tarefas` num componente pequeno e perder acesso noutros.
-   Criar estados duplicados para a mesma informação.

### Boas práticas

-   Estado no componente mais alto que precisa dele (`App`).
-   Componentes pequenos recebem dados por props.

### Checkpoint

-   Porque é que o estado deve ficar no `App` neste projeto?
-   O que acontece se colocares `tarefas` num componente pequeno?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Implementação passo a passo

### Modelo mental

Vamos construir por etapas. Cada etapa deixa a app funcional.

### Passo 0: (Se precisares) criar o projeto

Se já tens um projeto React, salta este passo.

```bash
# cria um projeto React com Vite
npm create vite@latest lista-tarefas -- --template react
cd lista-tarefas
npm install
npm run dev
```

### Passo 1: Limpar o App e criar a estrutura base

Abre `src/App.jsx` e coloca um título e a zona principal.

```jsx
// src/App.jsx
function App() {
    return (
        <main>
            {/* Título principal da app */}
            <h1>Lista de Tarefas do Dia</h1>
        </main>
    );
}

export default App;
```

### Passo 2: Criar estado e input controlado

Vamos guardar o texto do input no estado.

```jsx
import { useState } from "react";

function App() {
    // texto guarda o que o utilizador está a escrever
    const [texto, setTexto] = useState("");

    return (
        <main>
            <h1>Lista de Tarefas do Dia</h1>

            <form>
                <label htmlFor="tarefa">Nova tarefa</label>
                <input
                    id="tarefa"
                    value={texto}
                    // onChange atualiza o estado a cada tecla
                    onChange={(e) => setTexto(e.target.value)}
                />
                <button type="submit">Adicionar</button>
            </form>
        </main>
    );
}
```

> **Nota:** ainda não estamos a adicionar tarefas, só a controlar o input.

### Passo 3: Adicionar tarefas ao estado

Agora vamos guardar as tarefas num array.

```jsx
import { useState } from "react";

function App() {
    // texto guarda o input controlado
    const [texto, setTexto] = useState("");
    // tarefas guarda a lista de tarefas
    const [tarefas, setTarefas] = useState([]);

    function adicionarTarefa(e) {
        // evita o refresh do formulário
        e.preventDefault();

        // evita tarefas vazias
        if (texto.trim() === "") return;

        const novaTarefa = {
            // Date.now gera um id simples
            id: Date.now(),
            texto,
            feita: false,
        };

        // cria um novo array sem mutar o antigo
        setTarefas((prev) => [...prev, novaTarefa]);
        // limpa o input
        setTexto("");
    }

    return (
        <main>
            <h1>Lista de Tarefas do Dia</h1>

            <form onSubmit={adicionarTarefa}>
                <label htmlFor="tarefa">Nova tarefa</label>
                <input
                    id="tarefa"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                />
                <button type="submit">Adicionar</button>
            </form>
        </main>
    );
}
```

### Passo 4: Renderizar a lista de tarefas

Agora mostramos as tarefas com `map`.

```jsx
<ul>
    {/* map cria um <li> por cada tarefa */}
    {tarefas.map((tarefa) => (
        <li key={tarefa.id}>
            {/* mostramos o texto da tarefa */}
            {tarefa.texto}
        </li>
    ))}
</ul>
```

> **Dica:** se não houver tarefas, podemos mostrar uma mensagem (no passo 7).

### Passo 5: Marcar tarefas como feitas

Vamos alternar `feita` quando o utilizador clica.

```jsx
function alternarFeita(id) {
    // trocamos feita de true para false e vice-versa
    setTarefas((prev) =>
        prev.map((tarefa) =>
            tarefa.id === id ? { ...tarefa, feita: !tarefa.feita } : tarefa
        )
    );
}
```

E no `map`:

```jsx
<li key={tarefa.id}>
    <button onClick={() => alternarFeita(tarefa.id)}>
        {/* Texto simples para indicar estado */}
        {tarefa.feita ? "Feita" : "Por fazer"}
    </button>
    {tarefa.texto}
</li>
```

### Passo 6: Criar filtros

Vamos filtrar a lista com um estado `filtro`.

```jsx
// filtro controla o que aparece
const [filtro, setFiltro] = useState("todas");

// criamos uma lista já filtrada para renderizar
const tarefasFiltradas = tarefas.filter((t) => {
    if (filtro === "feitas") return t.feita;
    if (filtro === "por-fazer") return !t.feita;
    return true; // "todas"
});
```

E os botões:

```jsx
<div>
    {/* cada botão muda o filtro */}
    <button onClick={() => setFiltro("todas")}>Todas</button>
    <button onClick={() => setFiltro("feitas")}>Feitas</button>
    <button onClick={() => setFiltro("por-fazer")}>Por fazer</button>
</div>
```

Agora usa `tarefasFiltradas` no `map`.

### Passo 7: Mostrar mensagem quando a lista está vazia

```jsx
{
    tarefasFiltradas.length === 0 ? (
        // mensagem quando não há resultados
        <p>Sem tarefas por agora.</p>
    ) : (
        <ul>
            {tarefasFiltradas.map((tarefa) => (
                <li key={tarefa.id}>
                    {/* mostramos o texto da tarefa */}
                    {tarefa.texto}
                </li>
            ))}
        </ul>
    );
}
```

### Resumo final (o que a app já faz)

-   Adiciona tarefas.
-   Marca como feitas.
-   Filtra por estado.
-   Mostra mensagem quando está vazia.

### Checkpoint

-   Que parte do código usa `map`?
-   Em que situação aparece a mensagem "Sem tarefas por agora."?

<a id="sec-4"></a>

## 4. [EXTRA] Melhorias opcionais

### Ideias fáceis de adicionar

-   Contador de tarefas feitas e por fazer.
-   Botão para apagar tarefas concluídas.
-   Ordenar tarefas (não feitas primeiro).
-   Guardar tarefas no `localStorage`.

### Exemplo de contadores

```jsx
// conta quantas tarefas estão feitas
const feitas = tarefas.filter((t) => t.feita).length;
// calcula as que faltam
const porFazer = tarefas.length - feitas;
```

### EXTRA: persistência com localStorage

```jsx
import { useEffect } from "react";

// Ao montar, tenta ler tarefas guardadas
useEffect(() => {
    const guardadas = localStorage.getItem("tarefas");
    if (guardadas) {
        setTarefas(JSON.parse(guardadas));
    }
}, []);

// Sempre que tarefas mudam, guarda no browser
useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}, [tarefas]);
```

> **Nota:** `localStorage` guarda texto, por isso usamos `JSON.stringify` e `JSON.parse`.

### Milestones fullstack (opcionais)

> Estas milestones preparam a transição para backend real. Faz por ordem.

#### Milestone A: Paginação + filtros (query params)

-   **Backend:** cria `GET /api/tarefas?page=&limit=&q=&sort=` e devolve `{ items, page, limit, total }`.
-   **Frontend:** lê query params e mostra botões de paginação.
-   **Definition of Done:**
    -   A lista muda ao trocar de página.
    -   A URL reflete `page` e `q`.
    -   O backend devolve `total` correto.

#### Milestone B: Contrato de erro e estados de UI

-   **Backend:** erros no formato `{ "error": { "code", "message", "details" } }`.
-   **Frontend:** normaliza erros e mostra mensagens úteis.
-   **Definition of Done:**
    -   Erros de validação mostram uma mensagem específica.
    -   Existe estado de `loading`, `erro` e `sucesso` bem visível.
    -   Não existem `alert` como solução final.

#### Milestone C (opcional): Autenticação

-   **Integração:** segue `16_autenticacao_em_spa_jwt_sessions_cookies.md`.
-   **Definition of Done:**
    -   Login cria sessão (ou token) e `me()` confirma o utilizador.
    -   Rotas protegidas funcionam com `ProtectedRoute`.
    -   Logout limpa o estado e bloqueia páginas privadas.

#### Milestone D (opcional): Upload

-   **Integração:** segue `17_upload_paginacao_filtros_e_cliente_api.md`.
-   **Definition of Done:**
    -   Upload envia `multipart/form-data` e o backend guarda o ficheiro.
    -   A UI mostra `loading` e erro no upload.
    -   O utilizador vê feedback do sucesso.

### Checkpoint

-   Qual é o objetivo principal da Milestone A?
-   Que formato de erro deve ser devolvido no backend?
-   Quando é que faz sentido começar a Milestone C?

### Boas práticas

-   Não guardes contadores no estado, calcula a partir das tarefas.
-   Faz uma melhoria de cada vez e testa.

### Checkpoint

-   Porque é melhor calcular contadores do que guardá-los no estado?
-   Dá um exemplo de melhoria simples que não mude a estrutura base.

<a id="checklist"></a>

## Checklist - Mini-projeto

-   O formulário adiciona tarefas sem recarregar a página.
-   Cada tarefa tem `id`, `texto` e `feita`.
-   O `map` usa `key` única por tarefa.
-   O botão de alternar muda `feita` sem mutar o array.
-   O filtro mostra corretamente "todas", "feitas" e "por-fazer".
-   Aparece mensagem quando não há tarefas.
-   A UI é simples, mas clara e legível.

<a id="changelog"></a>

## Changelog

-   2026-01-11: renumeração do ficheiro.
-   2026-01-11: criação do ficheiro.
-   2026-01-12: transformação em mini-projeto React puro e tutorial detalhado.
-   2026-01-12: checkpoints por secção e checklist de validação.
-   2026-01-12: exemplo extra de persistência com `localStorage`.
-   2026-01-12: milestones fullstack opcionais com Definition of Done.
