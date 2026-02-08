# React.js (12.º Ano) - 17 · Organização, boas práticas e mini-projeto guiado

> **Objetivo deste ficheiro**
>
> - Organizar um projeto React de forma clara (pastas, nomes e separação de responsabilidades).
> - Escrever componentes mais fáceis de ler, testar e manter.
> - Identificar sinais de “código a crescer demais” e saber quando extrair componentes/funções.
> - Aplicar tudo num **mini-projeto** (passo a passo), com checklist final.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] Porque é que a organização importa](#sec-1)
- [2. [ESSENCIAL] Estrutura de pastas recomendada](#sec-2)
- [3. [ESSENCIAL] Convenções de nomes (ficheiros, componentes e variáveis)](#sec-3)
- [4. [ESSENCIAL] Separar responsabilidades (componentes, lógica e UI)](#sec-4)
- [5. [ESSENCIAL] Checklists rápidas (qualidade e consistência)](#sec-5)
- [6. [MINI-PROJETO] Tarefas (Todo) — passo a passo](#sec-6)
- [Checklist - Mini-projeto](#checklist)
- [Changelog](#changelog)

---

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **Ordem sugerida:** lê primeiro as secções 1–5 e depois faz o mini-projeto (secção 6).
- **Como estudar:** aplica as regras de organização logo desde o início do mini-projeto (não deixes para “no fim”).
- **Ligações úteis:**
    - Estado e eventos: `04_estado_e_eventos.md`
    - Listas e condicionais: `05_listas_e_condicionais.md`
    - Formulários controlados: `06_formularios_controlados.md`
    - Efeitos e dados externos: `08_useEffect_e_dados.md`

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] Porque é que a organização importa

Quando começas um projeto React, é normal ter quase tudo num só ficheiro.  
O problema é que, à medida que a app cresce, acontece isto:

- `App.jsx` começa a ter **muita lógica** (fetch, filtros, validações, handlers, etc.).
- O JSX fica grande e difícil de “varrer com os olhos”.
- Começam a aparecer bugs porque o código fica difícil de acompanhar.

A organização não é “para ficar bonito”. Serve para:

- **Perceber mais rápido** onde está cada coisa.
- **Evitar duplicação** (copiar/colar handlers e lógica).
- **Facilitar a manutenção** quando precisas de mudar algo mais tarde.

### 1.1 Sinais de que já está na hora de separar

Se isto está a acontecer, é um bom sinal para extrair:

- Tens um componente com **mais de ~150–200 linhas** e custa-te navegar nele.
- Tens JSX repetido várias vezes (cards, botões, linhas de lista).
- Tens funções grandes com muito `if` e muitos casos.
- Tens estados a mais no mesmo componente e já te perdes.

> Regra prática:  
> Se não consegues explicar “o que este componente faz” numa frase curta, provavelmente está a fazer demasiado.

### 1.2 Objetivo (o que queremos no fim)

- Componentes com responsabilidade clara.
- Pastas previsíveis.
- Nomes coerentes.
- Código que dá para outra pessoa (ou tu daqui a 2 semanas) entender sem sofrer.

---

<a id="sec-2"></a>

## 2. [ESSENCIAL] Estrutura de pastas recomendada

Não existe “uma estrutura única perfeita”. Mas para este curso (e para projetos escolares), esta costuma funcionar muito bem:

```
src/
  components/
    Botao.jsx
    CardAluno.jsx
    FiltroTarefas.jsx
  pages/
    Home.jsx
    Detalhe.jsx
  services/
    api.js
  styles/
    global.css
  App.jsx
  main.jsx
```

### 2.1 O que vai em cada pasta

- **components/**  
  Componentes reutilizáveis (UI ou pequenas partes da UI).  
  Exemplos: `Botao`, `Input`, `Card`, `ListaTarefas`.

- **pages/**  
  Componentes que representam páginas (quando tiveres Router).  
  Exemplos: `Home`, `Login`, `Perfil`, `DetalhePokemon`.

- **services/**  
  Funções que falam com o “exterior”: pedidos HTTP (`fetch`/axios), formatação, helpers de API.  
  Exemplos: `api.js`, `tarefasService.js`.

- **styles/**  
  CSS global ou ficheiros de estilos partilhados.

> Nota: Se ainda não estás a usar Router, podes começar sem `pages/`.  
> Mas a ideia continua válida: “componentes reutilizáveis” vs “ecrãs”.

### 2.2 Quando é que devo criar uma pasta nova?

Cria quando:

- tens **vários ficheiros** do mesmo tipo e começa a ficar confuso;
- queres separar por responsabilidade (ex.: API num sítio, UI noutro).

Evita criar pastas a mais num projeto pequeno. Mantém simples.

### 2.3 Exemplo prático: extrair um componente

Antes (tudo no App):

```jsx
function App() {
    return (
        <div>
            <h1>Alunos</h1>
            <ul>
                <li>...</li>
                <li>...</li>
            </ul>
        </div>
    );
}
```

Depois (App mais curto, componente separado):

```jsx
// components/ListaAlunos.jsx
function ListaAlunos({ alunos }) {
    return (
        <ul>
            {alunos.map((a) => (
                <li key={a.id}>{a.nome}</li>
            ))}
        </ul>
    );
}

export default ListaAlunos;
```

```jsx
// App.jsx
import ListaAlunos from "./components/ListaAlunos.jsx";

function App() {
    const alunos = [
        { id: 1, nome: "Ana" },
        { id: 2, nome: "Rui" },
    ];

    return (
        <div>
            <h1>Alunos</h1>
            <ListaAlunos alunos={alunos} />
        </div>
    );
}
```

---

<a id="sec-3"></a>

## 3. [ESSENCIAL] Convenções de nomes (ficheiros, componentes e variáveis)

### 3.1 Componentes (PascalCase)

- **Componentes React**: `PascalCase`  
  Exemplos: `ListaTarefas`, `CardAluno`, `BotaoPrimario`.

- **Ficheiros de componente**: normalmente o mesmo nome do componente  
  `ListaTarefas.jsx`, `CardAluno.jsx`.

Isto ajuda o cérebro a distinguir rapidamente:
“isto é componente” vs “isto é função normal”.

### 3.2 Funções e variáveis (camelCase)

- Funções e variáveis: `camelCase`  
  Exemplos: `carregarTarefas`, `tarefasFeitas`, `handleSubmit`.

### 3.3 Estados e handlers (padrões que ajudam muito)

Alguns padrões que tornam o código mais previsível:

- `const [tarefas, setTarefas] = useState([]);`
- `function handleChange(e) { ... }`
- `function handleSubmit(e) { ... }`
- `function toggleFeita(id) { ... }`

> Regra prática:  
> Se um handler é usado num `onClick`, começa por `handle...` ou é um verbo claro (`adicionar`, `remover`, `toggleFeita`).

### 3.4 Evitar abreviações que confundem

Evita:

- `x`, `y`, `tmp`, `aux` em código “final”
- `arr`, `obj` quando já dá para chamar pelo nome real (`tarefas`, `alunos`, `posts`)

Abreviações só fazem sentido quando não perdes clareza.

---

<a id="sec-4"></a>

## 4. [ESSENCIAL] Separar responsabilidades (componentes, lógica e UI)

### 4.1 “Uma coisa por componente” (modelo mental)

Um bom componente costuma cair numa destas categorias:

1. **UI** (apresentação)
    - Recebe dados por props e mostra
    - Não sabe “de onde vêm os dados”
    - Ex.: `ListaTarefas`, `Card`, `Botao`

2. **Lógica/estado** (gestão)
    - Decide o quê e quando mostrar
    - Tem `useState`, `useEffect`, handlers
    - Ex.: `PaginaTarefas`, `PokemonExplorer`

A ideia é simples:

- A lógica vive em poucos sítios.
- A UI é composta por peças pequenas.

### 4.2 Extrair lógica para funções (fora do componente)

Quando tens uma função que não precisa de estado diretamente, podes extraí-la para fora:

```jsx
function contarFeitas(tarefas) {
    return tarefas.filter((t) => t.feita).length;
}

function App() {
    const [tarefas, setTarefas] = useState([]);
    const feitas = contarFeitas(tarefas);

    return <p>Feitas: {feitas}</p>;
}
```

Isto ajuda a não “encher” o componente com lógica repetida.

### 4.3 Evitar “estado duplicado”

Um erro comum é guardar no estado valores que já dá para calcular:

- guardar `totalFeitas` em estado quando podes calcular a partir de `tarefas`
- guardar `tarefasFiltradas` em estado quando podes fazer `filter` no render

Regra prática:

- Se dá para calcular a partir do estado atual → calcula no render.
- Guarda no estado só “a fonte de verdade”.

---

<a id="sec-5"></a>

## 5. [ESSENCIAL] Checklists rápidas (qualidade e consistência)

### 5.1 Checklist de organização

- [ ] `App.jsx` está curto e legível (não tem tudo lá dentro).
- [ ] Componentes reutilizáveis estão em `components/`.
- [ ] Nomes coerentes (PascalCase para componentes).
- [ ] Cada ficheiro tem um objetivo claro.

### 5.2 Checklist de React (erros que aparecem muito)

- [ ] Em listas, cada item tem `key` estável e única.
- [ ] Não mutas arrays/objetos do estado (usas `map`, `filter`, spread).
- [ ] Forms: `value` + `onChange` (controlados).
- [ ] `useEffect` só para tarefas externas e com dependências certas.

> Se esta checklist começar a falhar muitas vezes, normalmente é sinal de que a estrutura precisa de ser dividida em componentes menores.

---

<a id="sec-6"></a>

## 6. [MINI-PROJETO] Tarefas (Todo) — passo a passo

> **O que vais construir**
>
> Uma mini app de tarefas com:
>
> - adicionar tarefas (formulário controlado)
> - marcar como feita / por fazer
> - filtrar (“todas”, “feitas”, “por-fazer”)
> - renderização condicional (lista vazia)
> - (extra) persistência com `localStorage`

### 6.1 Estrutura inicial (recomendada)

Dentro de `src/`:

- `components/`
    - `TarefaItem.jsx`
    - `FiltroTarefas.jsx`
    - `FormTarefa.jsx`
- `App.jsx`

A ideia é esta: `App` gere o estado e passa dados/handlers para componentes pequenos.

---

### 6.2 Modelo de dados (como guardar uma tarefa)

Vamos usar um array de tarefas, e cada tarefa é um objeto com:

- `id` (número ou string)
- `texto` (string)
- `feita` (boolean)

Exemplo:

```js
[
    { id: 1, texto: "Estudar React", feita: false },
    { id: 2, texto: "Fazer exercícios", feita: true },
];
```

> Nota: `id` tem de ser estável para usares como `key` no `map`.

---

### 6.3 Passo 1 — Estado base no App

```jsx
import { useState } from "react";

function App() {
    const [tarefas, setTarefas] = useState([]);
    const [texto, setTexto] = useState("");
    const [filtro, setFiltro] = useState("todas"); // "todas" | "feitas" | "por-fazer"

    return (
        <div>
            <h1>Tarefas</h1>
            <p>Faz o passo 2: formulário</p>
        </div>
    );
}

export default App;
```

---

### 6.4 Passo 2 — Formulário controlado (adicionar tarefa)

Objetivo:

- o input é controlado (`value` vem do estado)
- no submit, crias uma tarefa nova e adicionas ao array sem o mutar

```jsx
function App() {
    const [tarefas, setTarefas] = useState([]);
    const [texto, setTexto] = useState("");
    const [filtro, setFiltro] = useState("todas");

    function handleSubmit(e) {
        e.preventDefault();

        const textoLimpo = texto.trim();
        if (textoLimpo === "") return;

        const nova = {
            id: Date.now(),
            texto: textoLimpo,
            feita: false,
        };

        setTarefas((prev) => [nova, ...prev]);
        setTexto("");
    }

    return (
        <div>
            <h1>Tarefas</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="texto">Nova tarefa</label>
                <input
                    id="texto"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                />
                <button type="submit">Adicionar</button>
            </form>
        </div>
    );
}
```

**O que interessa aqui:**

- `trim()` evita tarefas “vazias”
- `[nova, ...prev]` cria um novo array (não altera o antigo)
- `Date.now()` dá um `id` rápido para este mini-projeto

---

### 6.5 Passo 3 — Mostrar lista (map + key)

```jsx
function App() {
    // ... estados e handleSubmit

    return (
        <div>
            <h1>Tarefas</h1>

            {/* formulário aqui */}

            <ul>
                {tarefas.map((t) => (
                    <li key={t.id}>
                        {t.texto} — {t.feita ? "Feita" : "Por fazer"}
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

> Repara na `key={t.id}`.  
> Sem key correta, o React pode misturar itens e criar comportamentos estranhos.

---

### 6.6 Passo 4 — Alternar feita/por-fazer (sem mutar)

Objetivo:

- ao clicar, mudar `feita` daquela tarefa
- sem alterar diretamente o array/objeto original

```jsx
function toggleFeita(id) {
    setTarefas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)),
    );
}
```

E no JSX:

```jsx
<li key={t.id}>
    <button onClick={() => toggleFeita(t.id)}>
        {t.feita ? "Marcar por fazer" : "Marcar feita"}
    </button>
    {t.texto}
</li>
```

---

### 6.7 Passo 5 — Filtro (todas / feitas / por-fazer)

Primeiro, escolhe o filtro:

```jsx
<div>
    <button onClick={() => setFiltro("todas")}>Todas</button>
    <button onClick={() => setFiltro("feitas")}>Feitas</button>
    <button onClick={() => setFiltro("por-fazer")}>Por fazer</button>
</div>
```

Depois, calcula a lista filtrada no render:

```jsx
const tarefasFiltradas = tarefas.filter((t) => {
    if (filtro === "feitas") return t.feita;
    if (filtro === "por-fazer") return !t.feita;
    return true;
});
```

E usa essa lista no `map`:

```jsx
{
    tarefasFiltradas.map((t) => <li key={t.id}>{t.texto}</li>);
}
```

---

### 6.8 Passo 6 — Lista vazia (condicional)

Quando não há tarefas para mostrar, diz ao utilizador o que se passa:

```jsx
{
    tarefasFiltradas.length === 0 ? (
        <p>Sem tarefas para mostrar.</p>
    ) : (
        <ul>
            {tarefasFiltradas.map((t) => (
                <li key={t.id}>{t.texto}</li>
            ))}
        </ul>
    );
}
```

---

### 6.9 Extra — Persistência com localStorage

Para guardar as tarefas entre recarregamentos:

1. Ao montar, lê do `localStorage`:

```jsx
import { useEffect, useState } from "react";

useEffect(() => {
    const raw = localStorage.getItem("tarefas");
    if (raw) {
        setTarefas(JSON.parse(raw));
    }
}, []);
```

2. Sempre que `tarefas` mudar, grava:

```jsx
useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}, [tarefas]);
```

> Nota: `localStorage` guarda texto, por isso usamos `JSON.stringify` e `JSON.parse`.

---

### Milestones fullstack (opcionais)

> Estas milestones preparam a transição para backend real. Faz por ordem.

#### Milestone A: Paginação + filtros (query params)

- **Backend:** cria `GET /api/tarefas?page=&limit=&q=&sort=` e devolve `{ items, page, limit, total }`.
- **Frontend:** lê query params e mostra botões de paginação.
- **Definition of Done:**
    - A lista muda ao trocar de página.
    - A URL reflete `page` e `q`.
    - O backend devolve `total` correto.

#### Milestone B: Contrato de erro e estados de UI

- **Backend:** erros no formato `{ "error": { "code", "message", "details" } }`.
- **Frontend:** normaliza erros e mostra mensagens úteis.
- **Definition of Done:**
    - Erros de validação mostram uma mensagem específica.
    - Existe estado de `loading`, `erro` e `sucesso` bem visível.
    - Não existem `alert` como solução final.

#### Milestone C (opcional): Autenticação

- **Integração:** segue `14_autenticacao_em_spa_jwt_sessions_cookies.md`.
- **Definition of Done:**
    - Login cria sessão (ou token) e `me()` confirma o utilizador.
    - Rotas protegidas funcionam com `ProtectedRoute`.
    - Logout limpa o estado e bloqueia páginas privadas.

#### Milestone D (opcional): Upload

- **Integração:** segue `15_upload_paginacao_filtros_e_cliente_api.md`.
- **Definition of Done:**
    - Upload envia `multipart/form-data` e o backend guarda o ficheiro.
    - A UI mostra `loading` e erro no upload.
    - O utilizador vê feedback do sucesso.

### Checkpoint

- Qual é o objetivo principal da Milestone A?
- Que formato de erro deve ser devolvido no backend?
- Quando é que faz sentido começar a Milestone C?

### Boas práticas

- Não guardes contadores no estado, calcula a partir das tarefas.
- Faz uma melhoria de cada vez e testa.

### Checkpoint

- Porque é melhor calcular contadores do que guardá-los no estado?
- Dá um exemplo de melhoria simples que não mude a estrutura base.

---

<a id="checklist"></a>

## Checklist - Mini-projeto

- O formulário adiciona tarefas sem recarregar a página.
- Cada tarefa tem `id`, `texto` e `feita`.
- O `map` usa `key` única por tarefa.
- O botão de alternar muda `feita` sem mutar o array.
- O filtro mostra corretamente "todas", "feitas" e "por-fazer".
- Aparece mensagem quando não há tarefas.
- A UI é simples, mas clara e legível.

---

<a id="changelog"></a>

## Changelog

- 2026-01-11: criação dos ficheiros originais (Organização e Mini-projeto).
- 2026-01-12: mini-projeto detalhado com checkpoints e milestones opcionais.
- 2026-01-27: merge dos ficheiros 13 e 14 num único ficheiro (novo nº 17).
