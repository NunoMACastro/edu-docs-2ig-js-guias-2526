# React.js (11.º Ano) - 06 · Formulários controlados

> **Objetivo deste ficheiro**
> Criar inputs ligados ao estado (formulários controlados).
> Lidar com `onChange` e `onSubmit` de forma correta.
> Aplicar validações simples no lado do cliente.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Input controlado e onChange](#sec-1)
-   [2. [ESSENCIAL] Checkbox, select e textarea](#sec-2)
-   [3. [ESSENCIAL] Submissão e validação simples](#sec-3)
-   [4. [EXTRA] Agrupar estado de formulário](#sec-4)
-   [Exercícios - Formulários controlados](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** domina o input controlado antes de agrupar estado.
-   **Como estudar:** escreve formulários pequenos e testa cada campo.
-   **Ligações:** usa `useState` como em `04_estado_e_eventos.md`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Input controlado e onChange

### Modelo mental

Um input controlado é um input cujo **valor vem do estado**. Isso significa que o React é a "fonte de verdade": o input mostra exatamente o que está no estado.

O ciclo é sempre este:

1. O utilizador escreve no input.
2. O `onChange` é chamado.
3. O estado é atualizado com o novo valor.
4. O React re-renderiza o componente.
5. O input mostra o novo valor.

Se esqueceres o `onChange`, o input fica "bloqueado", porque o React não permite alterar um valor que ele próprio controla.

Em contraste, um input **não controlado** guarda o valor internamente (no DOM). Aqui vamos usar sempre controlados porque dão mais controlo e previsibilidade.

### Sintaxe base (passo a passo)

-   **Cria estado para o input:** `const [nome, setNome] = useState("")`.
-   **Liga o input ao estado:** `value={nome}`.
-   **Atualiza com `onChange`:** `onChange={(e) => setNome(e.target.value)}`.
-   **Usa `label` com `htmlFor`:** melhora a acessibilidade.
-   **Mantém o estado e o input sincronizados:** o input mostra o estado e o estado segue o input.

> **Nota sobre números:** inputs devolvem **strings**. Se precisares de um número, converte com `Number(...)` ou `parseInt(...)`.

```jsx
const [idade, setIdade] = useState(0);
// ...
<input
    type="number"
    value={idade}
    onChange={(e) => setIdade(Number(e.target.value))}
/>
```

### Exemplo

```jsx
import { useState } from "react";

function FormNome() {
    const [nome, setNome] = useState("");

    return (
        <div>
            <label htmlFor="nome">Nome</label>
            {/* value liga o input ao estado, e onChange atualiza o estado */}
            <input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
            />
            <p>Escreveste: {nome}</p>
        </div>
    );
}

export default FormNome;
```

```jsx
import { useState } from "react";

function FormNome() {
    const [nome, setNome] = useState("");

    function atualizarNome(evento) {
        // O valor escrito está em evento.target.value
        setNome(evento.target.value);
    }

    return (
        <div>
            <label htmlFor="nome">Nome</label>
            <input id="nome" value={nome} onChange={atualizarNome} />
        </div>
    );
}
```

### Erros comuns

-   Esquecer o `onChange` e o input ficar bloqueado.
-   Ligar `value` a uma variável que não existe.
-   Guardar o evento em vez do valor (`setNome(e)` em vez de `e.target.value`).
-   Misturar `value` com `defaultValue` sem entender a diferença.

### Boas práticas

-   Usa nomes claros para o estado (`nome`, `email`).
-   Mantém cada input ligado ao seu estado.
-   Se o input for reutilizável, dá-lhe `name` para facilitar updates.

### Checkpoint

-   O que significa “input controlado”?
-   Porque é que um input fica bloqueado sem `onChange`?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Checkbox, select e textarea

### Modelo mental

Cada tipo de campo tem uma forma de ler o valor. O mais importante é saber **qual é a propriedade certa**:

-   **Checkbox:** usa `checked` (true/false).
-   **Select:** usa `value` (texto da opção).
-   **Textarea:** usa `value`, como um input normal.

Se usares a propriedade errada, o campo deixa de ficar controlado.

### Sintaxe base (passo a passo)

-   **Checkbox:** `checked={estado}` e `onChange={(e) => setEstado(e.target.checked)}`.
-   **Select:** `value={estado}` e `onChange={(e) => setEstado(e.target.value)}`.
-   **Textarea:** `value={estado}` e `onChange={(e) => setEstado(e.target.value)}`.
-   **Lembra-te das labels:** melhoram a leitura e o clique.

### Exemplo

```jsx
import { useState } from "react";

function FormPreferencias() {
    const [aceito, setAceito] = useState(false);
    const [curso, setCurso] = useState("web");
    const [nota, setNota] = useState("");

    return (
        <div>
            <label>
                {/* Checkbox usa checked para ligar ao estado */}
                <input
                    type="checkbox"
                    checked={aceito}
                    onChange={(e) => setAceito(e.target.checked)}
                />
                Aceito os termos
            </label>

            <label htmlFor="curso">Curso</label>
            {/* Select usa value para controlar a opção escolhida */}
            <select
                id="curso"
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
            >
                <option value="web">Web</option>
                <option value="redes">Redes</option>
            </select>

            <label htmlFor="nota">Nota</label>
            {/* Textarea funciona como input normal */}
            <textarea
                id="nota"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
            />
        </div>
    );
}

export default FormPreferencias;
```

### Erros comuns

-   Usar `value` em checkbox em vez de `checked`.
-   Esquecer o `value` no `select` e perder o controlo.
-   Ler `e.target.value` no checkbox (deves usar `e.target.checked`).
-   Não definir um valor inicial e o campo começar como `undefined`.

### Boas práticas

-   Mantém os estados separados quando o formulário é pequeno.
-   Testa cada campo individualmente.
-   Se o formulário crescer, pondera agrupar o estado (ver secção 4).

### Checkpoint

-   Qual é a diferença entre `value` e `checked`?
-   Que tipo de campo usa `e.target.checked`?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Submissão e validação simples

### Modelo mental

Ao submeter um formulário, o browser tenta recarregar a página. Em React, deves **impedir o refresh** e **validar os dados** antes de continuar.

A validação serve para evitar dados vazios ou errados e para dar feedback imediato ao utilizador.

### Sintaxe base (passo a passo)

-   **Usa `<form onSubmit={...}>`:** o submit é tratado num só lugar.
-   **Chama `event.preventDefault()`:** evita o refresh da página.
-   **Valida os campos:** usa `trim()` para remover espaços.
-   **Mostra erros no JSX:** guarda a mensagem num estado.
-   **Só envia se estiver tudo ok.**

### Exemplo

```jsx
import { useState } from "react";

function FormEmail() {
    const [email, setEmail] = useState("");
    const [erro, setErro] = useState("");

    function enviar(e) {
        // Impede o refresh automático da página
        e.preventDefault();

        if (email.trim() === "") {
            setErro("Email obrigatório");
            return;
        }

        setErro("");
        alert("Formulário enviado");
    }

    return (
        <form onSubmit={enviar}>
            {/* Input controlado para o email */}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Enviar</button>
            {/* Mostra erro apenas se existir */}
            {erro && <p>{erro}</p>}
        </form>
    );
}

export default FormEmail;
```

### Erros comuns

-   Esquecer `preventDefault` e perder o estado.
-   Validar apenas depois de submeter, sem feedback.
-   Usar `onClick` no botão e esquecer o `onSubmit` no `<form>`.

### Boas práticas

-   Usa mensagens curtas e claras.
-   Valida primeiro o essencial (ex.: campos obrigatórios).
-   Se houver erro, explica o que falta e como corrigir.

### Checkpoint

-   Para que serve `event.preventDefault()` no formulário?
-   Porque é útil validar `trim()`?

<a id="sec-4"></a>

## 4. [EXTRA] Agrupar estado de formulário

### Modelo mental

Em formulários maiores, podes guardar todos os campos num único objeto. Isso reduz repetição, mas requer cuidado ao atualizar para não perder campos.

A ideia é usar o atributo `name` nos inputs e atualizar a propriedade certa no objeto.

### Sintaxe base (passo a passo)

-   **Estado com objeto:** `{ nome: "", email: "" }`.
-   **Inputs com `name`:** `name="nome"`, `name="email"`.
-   **Atualização com spread:** `setDados({ ...dados, [name]: value })`.
-   **Usa forma funcional** quando dependes do estado anterior.

### Exemplo

```jsx
import { useState } from "react";

function FormCompleto() {
    const [dados, setDados] = useState({ nome: "", email: "" });
    const [erro, setErro] = useState("");

    function atualizar(e) {
        const { name, value } = e.target;
        // Atualiza apenas o campo que mudou
        setDados((prev) => ({ ...prev, [name]: value }));
    }

    function enviar(e) {
        e.preventDefault();
        if (dados.nome.trim() === "" || dados.email.trim() === "") {
            setErro("Preenche nome e email.");
            return;
        }
        setErro("");
        alert("Formulário válido");
    }

    return (
        <form onSubmit={enviar}>
            <input name="nome" value={dados.nome} onChange={atualizar} />
            <input name="email" value={dados.email} onChange={atualizar} />
            <button type="submit">Enviar</button>
            {erro && <p>{erro}</p>}
        </form>
    );
}

export default FormCompleto;
```

### Erros comuns

-   Esquecer o spread e apagar os outros campos.
-   Ter `name` diferente do campo no estado (ex.: `name="mail"` mas o estado é `email`).

### Boas práticas

-   Usa objetos apenas quando o formulário cresce.
-   Mantém os nomes de `name` e do estado iguais para evitar confusão.

### Checkpoint

-   O que acontece se esqueceres o spread no `setDados`?
-   Porque é útil usar `name` nos inputs?

<a id="exercicios"></a>

## Exercícios - Formulários controlados

1. Cria um componente `FormBasico`. Primeiro, cria o estado `nome` com `useState("")`. Depois, adiciona um `<label>` e um `<input>` com `value={nome}` e `onChange` a atualizar `setNome`.
2. No mesmo formulário, cria o estado `email`. Adiciona um segundo `<label>` e `<input>` com `value={email}` e `onChange` a atualizar `setEmail`.
3. Por baixo do formulário, mostra dois `<p>`: um com "Nome: ..." e outro com "Email: ...", usando os valores atuais do estado.
4. Adiciona um checkbox "Aceito os termos": cria o estado `aceito` com `useState(false)`, liga `checked={aceito}` e atualiza com `e.target.checked`. Mostra "Termos: Sim/Não".
5. Adiciona um `select` com 3 opções de curso: cria o estado `curso`, liga `value={curso}`, atualiza com `e.target.value` e mostra "Curso: ...".
6. Adiciona um `textarea` para observações: cria o estado `observacoes`, liga `value` e `onChange`, e mostra o texto escrito num `<p>` abaixo.
7. No `onSubmit`, bloqueia o envio se `nome` estiver vazio. Dica: usa `trim()`.
8. Mostra uma mensagem de erro quando o email for inválido.
9. Limpa os campos após um envio válido.
10. Agrupa o estado do formulário num objeto.

<a id="changelog"></a>

## Changelog

-   2026-01-11: criação do ficheiro.
-   2026-01-12: explicações detalhadas, exemplos extra e exercícios em formato passo a passo.
-   2026-01-12: exercícios 1-6 reescritos em formato tutorial.
-   2026-01-12: nota sobre inputs como strings e exemplo extra com validação simples.
