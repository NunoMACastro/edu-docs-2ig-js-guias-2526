# React.js (11.º Ano) - 08 · useEffect e dados externos

> **Objetivo deste ficheiro**
> Compreender o que são efeitos e quando usar `useEffect`.
> Controlar dependências para evitar repetições desnecessárias.
> Buscar dados de uma API e mostrar estados de loading e erro.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] O que é useEffect](#sec-1)
-   [2. [ESSENCIAL] Dependências e ciclo de vida](#sec-2)
-   [3. [ESSENCIAL] Buscar dados com fetch](#sec-3)
-   [4. [EXTRA] Limpeza de efeitos](#sec-4)
-   [Exercícios - useEffect e dados externos](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** domina o `useEffect` com arrays vazios antes do [EXTRA].
-   **Como estudar:** cria exemplos pequenos e observa quando o efeito corre.
-   **Ligações:** se precisares, revê estado em `04_estado_e_eventos.md`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] O que é useEffect

### Modelo mental

Um efeito é um código que corre **depois** do React desenhar a interface. No render, o React só deve **calcular o JSX**. Tudo o que mexe com o mundo exterior é um efeito.

Exemplos de efeitos:

-   Fazer pedidos a uma API.
-   Alterar o título da página (`document.title`).
-   Criar timers (`setInterval`, `setTimeout`).
-   Ler/escrever `localStorage`.

O `useEffect` existe para separar o **render** (puro) do **efeito** (trabalho extra). Assim o React mantém a interface estável e previsível.

### Sintaxe base (passo a passo)

-   **Importa o hook:** `import { useEffect } from "react";`
-   **Chama `useEffect` no topo do componente:** nunca dentro de `if` ou `for`.
-   **Passa uma função:** o código dentro dela corre depois do render.
-   **Define dependências:** `[]` significa "corre uma vez ao montar".
-   **Opcional:** o efeito pode devolver uma função de limpeza.

> **Nota:** se o efeito usa valores de estado/props, tens de os colocar no array de dependências.

> **Porque não usar `async` diretamente no `useEffect`:** uma função `async` devolve sempre uma Promise. O `useEffect` espera receber uma função normal (que pode devolver uma função de limpeza), não uma Promise. Por isso, criamos uma função `async` **dentro** do efeito e chamamos.

### Exemplo

```jsx
import { useEffect } from "react";

function Pagina() {
    useEffect(() => {
        // Este código corre depois do componente aparecer no ecrã
        document.title = "Minha página";
    }, []);

    return <p>Conteúdo</p>;
}

export default Pagina;
```

```jsx
import { useEffect } from "react";

function LogMontagem() {
    useEffect(() => {
        // Corre uma vez e serve para verificar quando o componente monta
        console.log("Componente montado");
    }, []);

    return <p>Verifica a consola</p>;
}
```

### Erros comuns

-   Colocar `useEffect` dentro de um `if` (violação das regras dos hooks).
-   Alterar o estado em loop infinito sem dependências.
-   Usar `useEffect` para calcular algo que podia ser calculado no render.

### Boas práticas

-   Usa efeitos apenas para tarefas externas ao render.
-   Mantém o efeito pequeno e com um objetivo claro.
-   Se o efeito fica grande, cria uma função auxiliar com um nome descritivo.

### Checkpoint

-   Que tipo de tarefas devem ir para `useEffect`?
-   Porque é que `useEffect` não pode ser `async` diretamente?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Dependências e ciclo de vida

### Modelo mental

O array de dependências controla **quando** o efeito corre. Pensa nele como uma lista de coisas que o efeito "ouve". Sempre que uma dessas coisas muda, o efeito volta a correr.

Três situações principais:

-   **Sem array:** o efeito corre **depois de cada render**.
-   **Array vazio `[]`:** o efeito corre **uma vez** quando o componente monta.
-   **Array com valores:** o efeito corre quando **qualquer valor muda**.

Isto liga ao "ciclo de vida":

-   **Montar:** o componente aparece pela primeira vez.
-   **Atualizar:** o componente volta a renderizar porque o estado/props mudou.
-   **Desmontar:** o componente sai do ecrã (aqui entra a limpeza).

### Sintaxe base (passo a passo)

-   **Sem array:** `useEffect(() => { ... })` (raramente necessário).
-   **Array vazio:** `useEffect(() => { ... }, [])`.
-   **Com dependências:** `useEffect(() => { ... }, [valor])`.
-   **Múltiplas dependências:** `useEffect(() => { ... }, [a, b, c])`.
-   **Evita objetos/arrays novos:** criam mudanças a cada render.

### Tabela rápida

| Dependências  | Quando corre?       | Exemplo               |
| ------------- | ------------------- | --------------------- |
| _(sem array)_ | Em todos os renders | Logging simples       |
| `[]`          | Apenas ao montar    | Buscar dados iniciais |
| `[count]`     | Quando `count` muda | Atualizar título      |

### Exemplo

```jsx
import { useEffect, useState } from "react";

function ContadorTitulo() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // O título atualiza sempre que count muda
        document.title = `Cliques: ${count}`;
    }, [count]);

    return <button onClick={() => setCount(count + 1)}>Somar</button>;
}

export default ContadorTitulo;
```

```jsx
import { useEffect } from "react";

function LogSempre() {
    useEffect(() => {
        // Sem array: corre depois de todos os renders
        console.log("Render completo");
    });

    return <p>Vê a consola</p>;
}
```

### Erros comuns

-   Esquecer uma dependência e ter valores desatualizados.
-   Colocar objetos/arrays criados no render no array e criar efeitos a toda a hora.
-   Criar efeitos que atualizam o mesmo estado que escutam (loop).

```jsx
// ERRADO: filtro usado no efeito, mas não está nas dependências
useEffect(() => {
    console.log("Filtro atual:", filtro);
}, []);

// CERTO: inclui tudo o que o efeito usa
useEffect(() => {
    console.log("Filtro atual:", filtro);
}, [filtro]);
```

### Boas práticas

-   Se o linter avisar, entende o motivo antes de ignorar.
-   Mantém o array de dependências pequeno e correto.
-   Se precisares de um objeto estável, cria-o fora do componente ou guarda-o em estado.

### Checkpoint

-   O que acontece quando o array de dependências está vazio?
-   Porque é que objetos novos no array podem criar loops?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Buscar dados com fetch

### Modelo mental

Buscar dados é uma tarefa externa, por isso faz sentido usar `useEffect`. O processo típico tem três estados:

1. **Loading:** estás à espera da resposta.
2. **Sucesso:** tens os dados e mostras a lista.
3. **Erro:** algo falhou e mostras uma mensagem.

Isto evita que o utilizador fique a olhar para uma página vazia sem perceber o que está a acontecer.

### Sintaxe base (passo a passo)

-   **Cria estados:** `dados`, `loading`, `erro`.
-   **Inicia o `loading` como `true`.**
-   **No `useEffect`:** faz o pedido e atualiza os estados.
-   **Usa `try/catch`:** trata erros de rede.
-   **Define `loading` para `false` no fim.**

> **Nota:** não podes tornar o `useEffect` `async`. Cria uma função `async` dentro e chama-a.

> **Nota sobre StrictMode (dev):** em desenvolvimento, o `useEffect` pode correr duas vezes para ajudar a detetar problemas. Isso pode duplicar pedidos. Em produção, corre uma vez. Se precisares, usa `AbortController` ou uma flag para evitar efeitos duplicados.

### Template base de fetch (copiar/colar)

Este template assume que o backend devolve erros neste formato:

```json
{ "error": { "code": "SOME_CODE", "message": "Mensagem", "details": [] } }
```

```jsx
import { useEffect, useState } from "react";

function ListaAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregar() {
            setLoading(true);
            setErro("");

            try {
                const res = await fetch("http://localhost:3000/api/alunos");
                const contentType = res.headers.get("content-type") || "";
                const body = contentType.includes("application/json")
                    ? await res.json()
                    : null;

                if (!res.ok) {
                    const msg =
                        body?.error?.message ||
                        `Erro ${res.status}: pedido falhou`;
                    throw new Error(msg);
                }

                setAlunos(body || []);
            } catch (e) {
                setErro(e.message || "Falha ao carregar");
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
            {alunos.map((aluno) => (
                <li key={aluno.id}>{aluno.nome}</li>
            ))}
        </ul>
    );
}

export default ListaAlunos;
```

### Exemplo

```jsx
import { useEffect, useState } from "react";

function ListaAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        // Função interna async para poder usar await
        async function carregar() {
            try {
                setLoading(true);
                setErro("");
                // API de teste (podes trocar pelo teu backend mais tarde)
                const resposta = await fetch(
                    "https://jsonplaceholder.typicode.com/users"
                );
                if (!resposta.ok) {
                    // Se a resposta vier com erro (ex.: 404)
                    throw new Error("Resposta inválida");
                }
                const dados = await resposta.json();
                // Guarda apenas os primeiros 5 alunos
                setAlunos(dados.slice(0, 5));
            } catch (e) {
                setErro("Falha ao carregar");
            } finally {
                // Loading termina quer tenha sucesso ou erro
                setLoading(false);
            }
        }

        carregar();
    }, []);

    if (loading) {
        return <p>A carregar...</p>;
    }

    if (erro) {
        return <p>{erro}</p>;
    }

    return (
        <ul>
            {alunos.map((aluno) => (
                <li key={aluno.id}>{aluno.name}</li>
            ))}
        </ul>
    );
}

export default ListaAlunos;
```

### Erros comuns

-   Esquecer o `setLoading(false)` e ficar preso no loading.
-   Chamar `fetch` diretamente no corpo do componente.
-   Não tratar o erro e deixar o utilizador sem feedback.
-   Esquecer `await resposta.json()` e tentar usar a resposta bruta.

### Boas práticas

-   Mostra sempre estados: loading, erro e sucesso.
-   Limita os dados para não sobrecarregar o UI.
-   Se o pedido for grande, mostra um texto a explicar o que está a acontecer.

### Checkpoint

-   Porque é importante mostrar loading e erro?
-   O que significa `resposta.ok` num `fetch`?

<a id="sec-4"></a>

## 4. [EXTRA] Limpeza de efeitos

### Modelo mental

Alguns efeitos criam "efeitos secundários" que precisam de limpeza, como timers, subscrições ou listeners de eventos. O `useEffect` pode devolver uma função de limpeza.

Essa limpeza acontece:

-   Quando o componente é removido do ecrã (unmount).
-   Antes do efeito correr novamente (se tiver dependências).

Isto também evita tentar fazer `setState` **depois** do componente sair do ecrã.

> **Nota curta:** se um pedido termina depois do componente sair, podes ter warnings. O `AbortController` ajuda a evitar este problema.

### Sintaxe base (passo a passo)

-   Cria o efeito normalmente.
-   No fim, devolve uma função que desfaz o efeito.
-   Se não precisares de limpeza, não devolves nada.

### Exemplo

```jsx
import { useEffect, useState } from "react";

function Relogio() {
    const [agora, setAgora] = useState(new Date());

    useEffect(() => {
        // Cria um intervalo que atualiza a hora
        const id = setInterval(() => {
            setAgora(new Date());
        }, 1000);

        // Limpeza para evitar intervalos duplicados
        return () => clearInterval(id);
    }, []);

    return <p>Hora: {agora.toLocaleTimeString()}</p>;
}

export default Relogio;
```

```jsx
import { useEffect, useState } from "react";

function LarguraJanela() {
    const [largura, setLargura] = useState(window.innerWidth);

    useEffect(() => {
        function atualizar() {
            // Atualiza o estado com a largura atual
            setLargura(window.innerWidth);
        }

        window.addEventListener("resize", atualizar);

        // Limpeza: remove o listener quando o componente sai
        return () => window.removeEventListener("resize", atualizar);
    }, []);

    return <p>Largura: {largura}px</p>;
}
```

```jsx
import { useEffect, useState } from "react";

function ListaComAbort() {
    const [dados, setDados] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        // AbortController permite cancelar o fetch se o componente sair
        const controller = new AbortController();

        async function carregar() {
            try {
                const res = await fetch(
                    "https://jsonplaceholder.typicode.com/users",
                    {
                        signal: controller.signal,
                    }
                );
                if (!res.ok) {
                    throw new Error("Resposta inválida");
                }
                const json = await res.json();
                // Guarda alguns dados para não encher a UI
                setDados(json.slice(0, 3));
            } catch (e) {
                // Ignora erro se for cancelamento
                if (e.name !== "AbortError") {
                    setErro("Falha ao carregar");
                }
            }
        }

        carregar();

        // Limpeza: cancela o pedido se o componente sair
        return () => controller.abort();
    }, []);

    if (erro) return <p>{erro}</p>;

    return (
        <ul>
            {dados.map((item) => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
}
```

### Erros comuns

-   Esquecer a função de limpeza e deixar timers ou listeners ativos.
-   Chamar `AbortController` mas não passar `signal` para o `fetch`.
-   Tentar atualizar estado depois do componente sair do ecrã.

### Boas práticas

-   Limpa sempre efeitos que criam "tarefas a correr".
-   Usa `AbortController` quando fazes `fetch` em componentes que podem sair.
-   Mantém a limpeza simples e fácil de ler.

### Checkpoint

-   Quando é que uma função de limpeza é necessária?
-   Para que serve o `AbortController` num `fetch`?

<a id="exercicios"></a>

## Exercícios - useEffect e dados externos

1. Cria `Pagina.jsx`. Importa `useEffect`, cria um componente simples e adiciona um efeito com `[]` que muda `document.title` para "Minha página". Usa o componente no `App` e confirma no browser.
2. No mesmo `Pagina`, adiciona um `console.log` dentro do `useEffect` para confirmar que só corre uma vez. Atualiza a página e confirma a mensagem na consola.
3. Cria `ContadorTitulo.jsx` com estado `count` e um botão "Somar". No `useEffect`, usa `[count]` e atualiza `document.title` com o valor atual. Clica no botão e confirma o título.
4. Cria `Relogio.jsx`. Adiciona um `setInterval` dentro do `useEffect` para atualizar a hora. Devolve uma função de limpeza com `clearInterval` e confirma que não cria múltiplos intervalos.
5. Cria `LarguraJanela.jsx`. Adiciona um `resize` listener no `useEffect`, guarda a largura em estado e remove o listener na limpeza. Redimensiona a janela e confirma a atualização.
6. Cria `ListaPosts.jsx` com estados `posts`, `loading` e `erro`. No `useEffect`, faz `fetch` a `https://jsonplaceholder.typicode.com/posts`, guarda só 5 itens e termina o `loading`.
7. Mostra "A carregar..." enquanto `loading` for `true` e mostra uma mensagem de erro quando `erro` tiver texto.
8. Adiciona um `if (!res.ok)` no `fetch` e lança um erro para testar o estado de erro.
9. Cria um botão "Recarregar" que altera um estado `forcar` e coloca `forcar` no array de dependências para repetir o fetch.
10. Adiciona um `setTimeout` dentro de um `useEffect` e garante que limpas o timeout no return.
11. Usa `AbortController` num `fetch` e garante que o erro `AbortError` é ignorado no `catch`.

<a id="changelog"></a>

## Changelog

-   2026-01-11: criação do ficheiro.
-   2026-01-12: explicações detalhadas, exemplos extra e exercícios guiados.
-   2026-01-12: nota sobre StrictMode, motivo do `useEffect` não ser `async`, e exemplo com `AbortController`.
-   2026-01-12: secção de limpeza completada, checkpoints e exercícios 1-6 mais guiados.
-   2026-01-12: padrão de `fetch` alinhado e exemplo de dependências em falta.
-   2026-01-12: template base de `fetch` com parsing de erro JSON.
