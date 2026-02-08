# React.js (12.º Ano) - 12 · Context API e estado global

> **Objetivo deste ficheiro**
>
> - Perceber **o problema** que o Context resolve (sem “mágica”).
> - Aprender a criar um **Context + Provider** e a consumir com `useContext`.
> - Saber **quando faz sentido** usar Context (e quando é má ideia).
> - Criar um **hook personalizado** para Context (padrão limpo e profissional).
> - Evitar bugs comuns: Provider em falta, re-renders em excesso, valores instáveis (referência vs valor).

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] O problema: props “a cair” por muitos níveis](#sec-1)
- [2. [ESSENCIAL] O que é Context (modelo mental)](#sec-2)
- [3. [ESSENCIAL] Criar Context + Provider (passo a passo)](#sec-3)
- [4. [ESSENCIAL] Consumir Context com `useContext`](#sec-4)
- [5. [ESSENCIAL+] Re-renders e “referência vs valor” no `value`](#sec-5)
- [6. [ESSENCIAL+] Hook personalizado: `useTheme`, `useAuth`, etc.](#sec-6)
- [7. [EXTRA] Padrão com `useReducer` + Context (quando o estado cresce)](#sec-7)
- [8. [EXTRA] Armadilhas comuns e diagnóstico rápido](#sec-8)
- [Exercícios - Context API e estado global](#exercicios)
- [Changelog](#changelog)

---

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **Antes de começares:** domina `useState` e “levantar estado” (ver `04_estado_e_eventos.md`).
- **Como estudar:** faz primeiro o **Tema** (secções 3–6), porque é simples e visual.
- **Regra importante:** Context é para **dados partilhados** por várias partes da app, **não** para tudo.
- **Ligações úteis:**
    - `08_useEffect_e_dados.md` (para entender “referência vs valor” e re-renders).
    - `09_react_router_fundamentos.md` (se quiseres usar `ProtectedRoute` mais à frente).

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] O problema: props “a cair” por muitos níveis

### 1.1 Situação típica (sem Context)

Imagina que tens uma `App` com um utilizador autenticado:

- `App` sabe quem é o utilizador (`user`)
- mas quem precisa disso é um componente lá em baixo, por exemplo `Navbar -> Avatar`

Sem Context, a solução “clássica” é passar por props:

```txt
App
 └─ Layout (recebe user)
     ├─ Navbar (recebe user)
     │   └─ Avatar (recebe user)
     └─ Conteudo (não usa user, mas recebe na mesma para passar)
```

Isto chama-se muitas vezes “props a cair” por vários níveis:

- componentes intermédios recebem props
- mas **não usam**
- só passam para baixo

### 1.2 Porque é que isto é um problema?

Não é “errado”, mas começa a ficar chato e frágil quando:

- tens muitos níveis (App → Layout → … → … → Componente)
- tens muitas props (user, tema, idioma, permissões, …)
- mudas a estrutura (reorganizas componentes) e tens de re-passar tudo

No entanto o React já tem uma solução oficial para isto.

---

<a id="sec-2"></a>

## 2. [ESSENCIAL] O que é Context (modelo mental)

### 2.1 A ideia central

**Context** é uma forma de “publicar” um valor num ponto alto da árvore e permitir que qualquer componente “abaixo” o consiga ler, sem ter de passar por props em todos os níveis.

Pensa assim:

- O **Provider** é como uma “tomada” que fornece um valor.
- Os componentes “abaixo” podem “ligar-se” e ler esse valor com `useContext`.

Mini-diagrama:

```txt
<ThemeProvider value={...}>
  <App />
    <Navbar />
    <Pagina />
      <BotaoTema />  ← lê o tema sem receber props
</ThemeProvider>
```

### 2.2 O que Context **não** é

Context **não** é:

- uma base de dados
- um substituto para `fetch`
- um “estado global mágico” para tudo

Context é só isto:

- um canal para partilhar valores
- entre componentes que estão na mesma árvore

> Regra prática:
>
> - **Context**: partilhar dados **dentro** da app (tema, user, idioma, permissões).
> - **API / fetch**: buscar dados **fora** da app (servidor).

---

<a id="sec-3"></a>

## 3. [ESSENCIAL] Criar Context + Provider (passo a passo)

Vamos fazer o exemplo mais comum e simples: **Tema** (claro/escuro).

### 3.1 Estrutura recomendada

Cria uma pasta para contextos:

```txt
src/
  context/
    ThemeContext.jsx
  App.jsx
  main.jsx
```

### 3.2 Criar o Context

Cria `src/context/ThemeContext.jsx`:

```jsx
import { createContext, useState } from "react";

/**
 * ThemeContext:
 * - vai transportar o tema ("claro" | "escuro")
 * - e uma função para alternar
 *
 * Nota: começamos com 'null' de propósito.
 * Assim, se alguém usar o contexto fora do Provider, apanhamos o erro mais cedo.
 */
export const ThemeContext = createContext(null);

/**
 * ThemeProvider:
 * - guarda o estado (tema)
 * - expõe o estado e as funções no 'value' do Provider
 */
export function ThemeProvider({ children }) {
    const [tema, setTema] = useState("claro");

    function alternarTema() {
        setTema((t) => (t === "claro" ? "escuro" : "claro"));
    }

    return (
        <ThemeContext.Provider value={{ tema, alternarTema }}>
            {children}
        </ThemeContext.Provider>
    );
}
```

O que está a acontecer aqui?

- `createContext(null)` cria o “canal”.
- `ThemeProvider` guarda o estado (como um componente normal).
- `Provider` publica um `value` (um objeto com dados e funções).
- Tudo o que estiver em `children` fica com acesso ao Context.

### 3.3 Colocar o Provider no topo da app

No `main.jsx`, envolve o `<App />`:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
);
```

> Importante:
>
> - Se o Provider não envolver o componente, esse componente **não consegue** ler o Context.

---

<a id="sec-4"></a>

## 4. [ESSENCIAL] Consumir Context com `useContext`

Agora vamos usar `tema` e `alternarTema` num componente qualquer, sem props.

Cria `src/components/BotaoTema.jsx` (ou coloca no `App` para testar rápido):

```jsx
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";

/**
 * BotaoTema:
 * - lê o tema e a função alternarTema do ThemeContext
 * - não recebe props nenhumas
 */
function BotaoTema() {
    const ctx = useContext(ThemeContext);

    // Se o Provider estiver em falta, ctx vai ser null (porque criámos createContext(null))
    if (!ctx) {
        return <p>Erro: BotaoTema precisa de estar dentro do ThemeProvider.</p>;
    }

    const { tema, alternarTema } = ctx;

    return (
        <button onClick={alternarTema}>
            Tema atual: {tema} (clica para alternar)
        </button>
    );
}

export default BotaoTema;
```

E no `App.jsx`:

```jsx
import BotaoTema from "./components/BotaoTema.jsx";

function App() {
    return (
        <div>
            <h1>Context: Tema</h1>
            <BotaoTema />
        </div>
    );
}

export default App;
```

### 4.1 Checkpoint

- Porque é que `BotaoTema` não precisa de receber `tema` por props?
- O que acontece se tirares o `ThemeProvider` do `main.jsx`?

---

<a id="sec-5"></a>

## 5. [ESSENCIAL+] Re-renders e “referência vs valor” no `value`

Aqui está a parte “profissional” que evita muitos bugs de performance.

### 5.1 O que acontece quando o `value` muda?

Sempre que o `value` do Provider muda, **todos os consumidores desse contexto** podem re-renderizar.

Exemplo mental:

- `tema` muda → `ThemeProvider` re-renderiza → `value` muda → consumidores re-renderizam

Isto é normal. O problema aparece quando o `value` “muda” **sem necessidade**.

### 5.2 A armadilha: `value={{ ... }}` cria um objeto novo

Repara neste detalhe:

```jsx
<ThemeContext.Provider value={{ tema, alternarTema }}>
```

Esse objeto `{ tema, alternarTema }` é criado de novo em cada render do Provider.

Muitas vezes isso não é grave (apps pequenas), mas em apps grandes pode fazer re-renderizar mais do que querias.

### 5.3 Solução simples: `useMemo` para estabilizar o `value` (quando fizer falta)

Quando o contexto começa a crescer e notas re-renders desnecessários, podes estabilizar o `value`:

```jsx
import { createContext, useMemo, useState } from "react";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [tema, setTema] = useState("claro");

    function alternarTema() {
        setTema((t) => (t === "claro" ? "escuro" : "claro"));
    }

    const value = useMemo(() => {
        return { tema, alternarTema };
    }, [tema]); // alternarTema não muda (é a mesma função)

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}
```

> Nota:
>
> - Aqui `useMemo` serve para manter o mesmo objeto enquanto `tema` não muda.
> - Não precisas de meter `useMemo` em tudo. Usa quando:
>     - o contexto é usado por muitos componentes
>     - e notas re-renderizações “a mais”.

### 5.4 Outra solução profissional: separar contextos

Se tiveres um contexto gigante com muitas coisas (tema + user + notificações + …), qualquer mudança pode causar re-renders em todo o lado.

Uma prática comum é separar:

- `ThemeContext`
- `AuthContext`
- `SettingsContext`
- etc.

Assim, mudar o tema não faz re-renderizar componentes que só precisam do utilizador.

### 5.5 Checkpoint

- Porque é que “referência vs valor” importa no `value`?
- Quando é que faz sentido usar `useMemo` no Provider?

---

<a id="sec-6"></a>

## 6. [ESSENCIAL+] Hook personalizado: `useTheme`, `useAuth`, etc.

Este é o padrão mais limpo para usar Context numa app real.

A ideia:

- Em vez de repetires `useContext(ThemeContext)` em todo o lado,
- crias um hook `useTheme()` que:
    - lê o contexto,
    - valida se existe Provider,
    - devolve logo `{ tema, alternarTema }`.

### 6.1 Implementação

Em `src/context/ThemeContext.jsx`:

```jsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [tema, setTema] = useState("claro");

    function alternarTema() {
        setTema((t) => (t === "claro" ? "escuro" : "claro"));
    }

    return (
        <ThemeContext.Provider value={{ tema, alternarTema }}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * useTheme:
 * - devolve o contexto
 * - garante que existe Provider (senão dá erro claro)
 */
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme tem de ser usado dentro de <ThemeProvider>.");
    }
    return ctx;
}
```

Agora, no componente:

```jsx
import { useTheme } from "../context/ThemeContext.jsx";

function BotaoTema() {
    const { tema, alternarTema } = useTheme();

    return <button onClick={alternarTema}>Tema atual: {tema}</button>;
}
```

Vantagens:

- Fica mais curto.
- Fica mais consistente.
- O erro aparece logo se o Provider estiver em falta.

### 6.2 Quando faz sentido criar hooks personalizados?

Sempre que o Context for usado em mais do que 1–2 sítios.

Se só tens um consumo, ainda podes usar `useContext` diretamente.
Mas em apps reais, vais agradecer o hook.

### 6.3 Checkpoint

- Qual é a vantagem de `useTheme()` em vez de repetir `useContext(...)`?
- Porque é que é útil lançar erro se o Provider estiver em falta?

---

<a id="sec-7"></a>

## 7. [EXTRA] Padrão com `useReducer` + Context (quando o estado cresce)

Quando o estado começa a ter **muitas ações** (adicionar, remover, editar, reset, …), `useReducer` ajuda a organizar.

Não é obrigatório para já, mas é bom conhecer o padrão.

### 7.1 Mini-exemplo: contador com ações

```jsx
import { createContext, useContext, useReducer } from "react";

const ContadorContext = createContext(null);

const estadoInicial = { total: 0 };

function reducer(state, action) {
    switch (action.type) {
        case "incrementar":
            return { total: state.total + 1 };
        case "decrementar":
            return { total: state.total - 1 };
        case "reset":
            return { total: 0 };
        default:
            return state;
    }
}

export function ContadorProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, estadoInicial);

    return (
        <ContadorContext.Provider value={{ state, dispatch }}>
            {children}
        </ContadorContext.Provider>
    );
}

export function useContador() {
    const ctx = useContext(ContadorContext);
    if (!ctx) {
        throw new Error(
            "useContador tem de ser usado dentro de <ContadorProvider>.",
        );
    }
    return ctx;
}
```

E um consumidor:

```jsx
import { useContador } from "../context/ContadorContext.jsx";

function Controles() {
    const { state, dispatch } = useContador();

    return (
        <div>
            <p>Total: {state.total}</p>
            <button onClick={() => dispatch({ type: "incrementar" })}>+</button>
            <button onClick={() => dispatch({ type: "decrementar" })}>-</button>
            <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
        </div>
    );
}
```

### 7.2 Quando usar `useReducer`?

Quando:

- tens muitas transições de estado,
- queres “ações” com nomes claros,
- e o `useState` começa a ficar confuso.

---

<a id="sec-8"></a>

## 8. [EXTRA] Armadilhas comuns e diagnóstico rápido

### 8.1 “Não está a funcionar” (Provider em falta)

Sintoma:

- `useContext(...)` devolve `null` / `undefined`
- ou o teu hook lança erro

Checklist:

1. O Provider está mesmo a envolver a app no `main.jsx`?
2. O componente que consome está mesmo “abaixo” do Provider?
3. Importaste o Provider certo? (cuidado com caminhos)

### 8.2 Context usado para tudo (anti-padrão)

Sintoma:

- começas a meter qualquer estado no Context “porque sim”
- e a app fica difícil de seguir

Regra prática:

- Se só 1 componente precisa → estado local.
- Se 2–3 componentes próximos precisam → levantar estado + props.
- Se muitos componentes longe precisam → Context faz sentido.

### 8.3 Re-renders a mais

Sintoma:

- “Tudo re-renderiza quando mudo uma coisa pequena”

Checklist:

1. O `value` do Provider está a ser criado como objeto novo?
2. O Context tem “coisas a mais” dentro?
3. Faz sentido separar em vários contextos?

Ferramenta rápida:

```jsx
console.log("RENDER NomeDoComponente");
```

Se aparecer demasiadas vezes, investiga o `value` e a divisão dos contextos.

### 8.4 Context não substitui validação/segurança

Mesmo que guardes o `user` no Context, isso é só do lado do frontend.
Permissões reais (segurança) são validadas no backend.

---

<a id="exercicios"></a>

## Exercícios - Context API e estado global

1. Cria `src/context/ThemeContext.jsx` com `ThemeContext` + `ThemeProvider` e estado `tema`.
2. Envolve o `<App />` com `<ThemeProvider>` no `main.jsx`.
3. Cria `BotaoTema.jsx` que lê `{ tema, alternarTema }` do contexto e muda o tema.
4. (UI) No `App`, aplica uma classe `className={tema}` e cria CSS simples para `.claro` e `.escuro`.
5. Cria `useTheme()` dentro do mesmo ficheiro e refatora `BotaoTema` para usar o hook.
6. Cria `UserContext.jsx` com `{ nome, curso }` e mostra esses dados em dois componentes diferentes.
7. Faz uma página `Perfil` que permite atualizar o nome (usando uma função do Context).
8. (Performance) Se o teu `UserContext` tiver muitas propriedades, separa em `UserContext` e `SettingsContext`.
9. (EXTRA) Adiciona `useMemo` no `value` do Provider e explica por escrito o motivo.
10. (EXTRA) Cria um `ContadorContext` com `useReducer` e cria botões de `incrementar`, `decrementar` e `reset`.

---

<a id="changelog"></a>

## Changelog

- 2026-01-11: criação do ficheiro.
- 2026-01-26: reescrita com o nível de detalhe do ficheiro 08:
    - problema do “passar props” e quando Context faz sentido
    - passo a passo completo (Context, Provider, consumo, main.jsx)
    - re-renders e “referência vs valor” no `value`
    - hook personalizado (`useTheme`) como padrão recomendado
    - secção de diagnóstico e anti-padrões
    - mini-exemplo de `useReducer` + Context
