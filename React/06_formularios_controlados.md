# React.js (12.º Ano) - 06 · Formulários controlados

> **Objetivo deste ficheiro**
>
> - Construir **inputs controlados** (o valor vem do estado).
> - Ligar corretamente `onChange`, `onBlur` e `onSubmit`.
> - Fazer **validação simples no cliente** com feedback claro (erros por campo).
> - Aprender padrões “profissionais” (mas acessíveis) para formulários: **fonte de verdade**, **estado do ecrã**, **erros/touched**, e armadilhas típicas.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] Input controlado e onChange](#sec-1)
- [2. [ESSENCIAL] Checkbox, radio, select e textarea](#sec-2)
- [3. [ESSENCIAL] Submissão e validação simples](#sec-3)
- [4. [EXTRA] Agrupar estado de formulário (objeto)](#sec-4)
- [5. [EXTRA] Armadilhas comuns e diagnóstico rápido](#sec-5)
- [Exercícios - Formulários controlados](#exercicios)
- [Changelog](#changelog)

---

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **ESSENCIAL vs EXTRA:** domina bem as secções **1–3** antes de ires para o estado em objeto (secção 4) e armadilhas (secção 5).
- **Como estudar:** escreve formulários pequenos e observa:
    - se o valor do input **segue sempre o estado**,
    - se o `onChange` atualiza o estado corretamente,
    - e se a validação dá feedback claro ao utilizador.
- **Ligações úteis:**
    - estado e eventos: `04_estado_e_eventos.md`
    - listas e condicionais: `05_listas_e_condicionais.md` (mostrar erros, listas de opções, etc.)

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] Input controlado e onChange

### 1.1 A ideia central: “o estado manda no input”

Um **input controlado** é um input cujo valor **vem do estado**.

Isto quer dizer:

- o **React** é a **fonte de verdade** (o valor “real” está no estado)
- o input apenas **mostra** esse valor
- quando o utilizador escreve, tu atualizas o estado → e o React volta a desenhar o input com o novo valor

Modelo mental (ciclo):

1. utilizador escreve
2. dispara `onChange`
3. tu lês `e.target.value`
4. fazes `setState(...)`
5. o componente re-renderiza
6. o input recebe `value={estado}` com o valor novo

Mini-diagrama:

```
teclado → onChange → setState → render → value atualizado
```

Isto é poderoso porque o valor do formulário fica **previsível**:
se o estado for X, o input mostra X.

---

### 1.2 Controlado vs não controlado (diferença real)

- **Controlado:** `value={estado}` e `onChange` atualiza esse estado.
- **Não controlado:** o browser guarda o valor “lá dentro” (no DOM). Tu só lês quando precisas.

Neste curso vamos usar **controlados** na maioria dos casos porque:

- dá para validar e bloquear valores
- dá para limpar o formulário facilmente
- dá para mostrar erros e estados em tempo real

> Nota: há casos onde “não controlado” faz sentido (por exemplo, certos inputs de ficheiro). Vês isso na secção 5.

---

### 1.3 A regra que evita bugs

> Se metes `value={...}`, tens de ter `onChange={...}`.  
> Se não, o input fica “preso” porque o React está a controlar o valor e tu não estás a permitir mudanças.

---

### 1.4 Primeira versão (simples e correta)

```jsx
import { useState } from "react";

/**
 * FormNome
 * - Exemplo base de input controlado.
 * - O valor do input vem do estado.
 * - O onChange atualiza o estado.
 */
function FormNome() {
    const [nome, setNome] = useState("");

    return (
        <div>
            <label htmlFor="nome">Nome</label>

            <input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Escreve o teu nome"
            />

            <p>Estado atual: {nome}</p>
        </div>
    );
}

export default FormNome;
```

O que está a acontecer aqui:

- `value={nome}` liga o input ao estado
- `onChange` lê o valor escrito (`e.target.value`) e faz `setNome(...)`
- o `<p>` ajuda-te a confirmar que o estado está mesmo a acompanhar o input

---

### 1.5 Importante: nunca guardes o evento (`e`) no estado

O `onChange` recebe um **evento**. Tu só queres guardar o valor.

Errado:

```jsx
onChange={(e) => setNome(e)} // ERRADO
```

Certo:

```jsx
onChange={(e) => setNome(e.target.value)}
```

---

### 1.6 Inputs de números: atenção (vem sempre texto)

Mesmo que o input seja `type="number"`, o valor chega como **string**.

Por isso, se tu queres guardar um número no estado, tens de converter.

```jsx
import { useState } from "react";

/**
 * FormIdade
 * - Exemplo com input type="number".
 * - Converte para número ao guardar no estado.
 */
function FormIdade() {
    const [idade, setIdade] = useState(0);

    function handleChange(e) {
        // e.target.value é string. Number("12") -> 12
        setIdade(Number(e.target.value));
    }

    return (
        <div>
            <label htmlFor="idade">Idade</label>
            <input
                id="idade"
                type="number"
                value={idade}
                onChange={handleChange}
                min={0}
            />
            <p>Idade (número): {idade}</p>
        </div>
    );
}

export default FormIdade;
```

> Nota: se o campo estiver vazio, `e.target.value` pode ser `""` e `Number("")` dá `0`.  
> Em formulários reais, às vezes guardamos como string e só convertemos no submit. Depende do objetivo.

---

### 1.7 Reset (limpar campos) e “fonte de verdade”

Como o estado é a fonte de verdade, para limpar basta voltar aos valores iniciais.

```jsx
const [nome, setNome] = useState("");
const [email, setEmail] = useState("");

function limpar() {
    setNome("");
    setEmail("");
}
```

---

### 1.8 Um handler por campo vs handler “genérico”

#### Opção A (mais simples): um handler por campo

```jsx
<input value={nome} onChange={(e) => setNome(e.target.value)} />
<input value={email} onChange={(e) => setEmail(e.target.value)} />
```

Vantagens:

- mais fácil de entender no início
- bom para formulários pequenos

#### Opção B (já útil em formulários médios): `name` + um handler

Começas a usar o atributo `name` para saber que campo mudou.

```jsx
import { useState } from "react";

/**
 * FormMini
 * - Um handler genérico com base em name.
 */
function FormMini() {
    const [form, setForm] = useState({ nome: "", email: "" });

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    return (
        <div>
            <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome"
            />
            <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
            />
        </div>
    );
}

export default FormMini;
```

---

### 1.9 Checkpoint

- O que significa “o estado é a fonte de verdade”?
- Porque é que um input fica preso se tiver `value` mas não tiver `onChange`?
- Porque é que `type="number"` não te garante um número no estado?

---

<a id="sec-2"></a>

## 2. [ESSENCIAL] Checkbox, radio, select e textarea

### 2.1 A ideia central: nem todos os campos usam `value`

O erro mais comum em formulários é usar a propriedade errada:

- **checkbox:** usa `checked` (true/false)
- **radio:** usa `checked` comparando com o valor atual
- **select/textarea:** usam `value`

A regra é: escolhe a propriedade que representa o valor “real” daquele elemento.

---

### 2.2 Checkbox (true/false)

```jsx
import { useState } from "react";

/**
 * Termos
 * - Checkbox controlado com checked.
 */
function Termos() {
    const [aceito, setAceito] = useState(false);

    return (
        <label>
            <input
                type="checkbox"
                checked={aceito}
                onChange={(e) => setAceito(e.target.checked)}
            />
            Aceito os termos
        </label>
    );
}

export default Termos;
```

Repara:

- `e.target.checked` é boolean
- `value` aqui não é o que tu queres

---

### 2.3 Radio (escolher 1 de várias)

O padrão típico é guardar no estado o valor da opção escolhida.

```jsx
import { useState } from "react";

/**
 * FormRadio
 * - Grupo de radios controlado com value no estado.
 */
function FormRadio() {
    const [turno, setTurno] = useState("manha");

    return (
        <div>
            <p>Turno:</p>

            <label>
                <input
                    type="radio"
                    name="turno"
                    value="manha"
                    checked={turno === "manha"}
                    onChange={(e) => setTurno(e.target.value)}
                />
                Manhã
            </label>

            <label>
                <input
                    type="radio"
                    name="turno"
                    value="tarde"
                    checked={turno === "tarde"}
                    onChange={(e) => setTurno(e.target.value)}
                />
                Tarde
            </label>

            <p>Escolheste: {turno}</p>
        </div>
    );
}

export default FormRadio;
```

---

### 2.4 Select (lista de opções)

```jsx
import { useState } from "react";

/**
 * FormSelect
 * - Select controlado com value.
 */
function FormSelect() {
    const [curso, setCurso] = useState("web");

    return (
        <div>
            <label htmlFor="curso">Curso</label>

            <select
                id="curso"
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
            >
                <option value="web">Web</option>
                <option value="redes">Redes</option>
                <option value="bd">Bases de Dados</option>
            </select>

            <p>Curso: {curso}</p>
        </div>
    );
}

export default FormSelect;
```

#### Select com opções vindas de uma lista (mais real)

```jsx
const opcoes = [
    { value: "web", label: "Web" },
    { value: "redes", label: "Redes" },
    { value: "bd", label: "Bases de Dados" },
];

<select value={curso} onChange={(e) => setCurso(e.target.value)}>
    {opcoes.map((o) => (
        <option key={o.value} value={o.value}>
            {o.label}
        </option>
    ))}
</select>;
```

---

### 2.5 Textarea (texto longo)

Textarea funciona como input normal: `value` + `onChange`.

```jsx
import { useState } from "react";

/**
 * Observacoes
 * - Textarea controlada.
 */
function Observacoes() {
    const [texto, setTexto] = useState("");

    return (
        <div>
            <label htmlFor="obs">Observações</label>

            <textarea
                id="obs"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={4}
            />

            <p>Caracteres: {texto.length}</p>
        </div>
    );
}

export default Observacoes;
```

---

### 2.6 Checkpoint

- Qual é a diferença entre `value` e `checked`?
- Porque é que `radio` usa `checked={estado === "valor"}`?
- Como é que geras `<option>` a partir de uma lista?

---

<a id="sec-3"></a>

## 3. [ESSENCIAL] Submissão e validação simples

### 3.1 O que acontece num `<form>` sem React?

Num formulário normal, quando clicas num botão de submit:

- o browser tenta enviar o formulário
- e normalmente **recarrega a página**

Numa SPA (React), não queres refresh. Queres:

- bloquear o comportamento do browser
- validar dados no cliente
- e depois decidir o que fazer (mostrar erro, enviar para API, etc.)

Por isso existe:

```js
e.preventDefault();
```

---

### 3.2 Estrutura recomendada (limpa e fácil)

- estados dos campos (ou objeto, na secção 4)
- estado `erros` (string por campo, ou objeto)
- `onSubmit` no `<form>`

---

### 3.3 Exemplo completo: validação simples por campo

Regras deste exemplo:

- nome é obrigatório
- email tem de ter `@` (validação simples)
- tem de aceitar termos

```jsx
import { useState } from "react";

/**
 * FormInscricao
 * - Exemplo completo para treinar:
 *   - inputs controlados
 *   - onSubmit com preventDefault
 *   - validação simples
 *   - mensagens de erro por campo
 */
function FormInscricao() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [aceito, setAceito] = useState(false);

    const [erros, setErros] = useState({
        nome: "",
        email: "",
        aceito: "",
    });

    function validar({ nome, email, aceito }) {
        const novo = { nome: "", email: "", aceito: "" };

        if (nome.trim() === "") {
            novo.nome = "O nome é obrigatório.";
        }

        if (email.trim() === "") {
            novo.email = "O email é obrigatório.";
        } else if (!email.includes("@")) {
            novo.email = "O email deve conter '@'.";
        }

        if (!aceito) {
            novo.aceito = "Tens de aceitar os termos.";
        }

        return novo;
    }

    function temErros(obj) {
        return Object.values(obj).some((msg) => msg !== "");
    }

    function handleSubmit(e) {
        e.preventDefault();

        const novoErros = validar({ nome, email, aceito });
        setErros(novoErros);

        if (temErros(novoErros)) {
            return; // não envia
        }

        // aqui, para já, simulamos “envio com sucesso”
        alert("Formulário válido!");

        // limpar
        setNome("");
        setEmail("");
        setAceito(false);
        setErros({ nome: "", email: "", aceito: "" });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="nome">Nome</label>
                <input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                {erros.nome && <p>{erros.nome}</p>}
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {erros.email && <p>{erros.email}</p>}
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={aceito}
                        onChange={(e) => setAceito(e.target.checked)}
                    />
                    Aceito os termos
                </label>
                {erros.aceito && <p>{erros.aceito}</p>}
            </div>

            <button type="submit">Enviar</button>
        </form>
    );
}

export default FormInscricao;
```

O que treinas neste exemplo:

- `preventDefault()` para evitar refresh
- validação que devolve **mensagens por campo**
- mostrar erros com condicionais (`{erros.nome && ...}`)
- só “envia” se não houver erros
- reset final

---

### 3.4 Estado do ecrã (opcional, mas já muito útil)

Em formulários reais, costuma existir um estado do ecrã:

- `"idle"` (ainda não tentou enviar)
- `"submitting"` (a enviar)
- `"success"` (enviado)
- `"error"` (falhou)

Aqui, para já, basta um `status` simples para controlar UI:

```jsx
const [status, setStatus] = useState("idle"); // "idle" | "success"
```

Isto ajuda-te a mostrar mensagens e a desativar botões quando necessário.

---

### 3.5 Checkpoint

- Para que serve `e.preventDefault()`?
- Porque é que validar com `trim()` evita casos “falsos”?
- Qual é a vantagem de ter mensagens de erro por campo?

---

<a id="sec-4"></a>

## 4. [EXTRA] Agrupar estado de formulário (objeto)

### 4.1 Quando compensa usar objeto?

Se o formulário tiver muitos campos, ter `useState` para cada um pode ficar repetitivo.

A solução comum é:

- um objeto `form` com todos os campos
- um handler genérico que usa `name`

---

### 4.2 Exemplo completo com objeto + validação

```jsx
import { useState } from "react";

/**
 * FormConta
 * - Estado em objeto (form).
 * - Handler genérico baseado em name.
 * - Validação simples por campo.
 */
function FormConta() {
    const [form, setForm] = useState({
        nome: "",
        email: "",
        password: "",
        aceito: false,
    });

    const [erros, setErros] = useState({
        nome: "",
        email: "",
        password: "",
        aceito: "",
    });

    function handleChange(e) {
        const { name, type, value, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function validar(f) {
        const novo = { nome: "", email: "", password: "", aceito: "" };

        if (f.nome.trim() === "") novo.nome = "Nome obrigatório.";
        if (f.email.trim() === "") novo.email = "Email obrigatório.";
        else if (!f.email.includes("@")) novo.email = "Email inválido.";

        if (f.password.length < 6) novo.password = "Mínimo 6 caracteres.";

        if (!f.aceito) novo.aceito = "Tens de aceitar os termos.";

        return novo;
    }

    function temErros(obj) {
        return Object.values(obj).some((msg) => msg !== "");
    }

    function handleSubmit(e) {
        e.preventDefault();

        const novoErros = validar(form);
        setErros(novoErros);

        if (temErros(novoErros)) return;

        alert("Conta criada (simulação).");

        setForm({ nome: "", email: "", password: "", aceito: false });
        setErros({ nome: "", email: "", password: "", aceito: "" });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="nome">Nome</label>
                <input
                    id="nome"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                />
                {erros.nome && <p>{erros.nome}</p>}
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                />
                {erros.email && <p>{erros.email}</p>}
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                />
                {erros.password && <p>{erros.password}</p>}
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        name="aceito"
                        checked={form.aceito}
                        onChange={handleChange}
                    />
                    Aceito os termos
                </label>
                {erros.aceito && <p>{erros.aceito}</p>}
            </div>

            <button type="submit">Criar conta</button>
        </form>
    );
}

export default FormConta;
```

O que este padrão resolve:

- um único `handleChange` funciona para vários campos
- checkbox e inputs normais funcionam no mesmo handler (`type === "checkbox"`)
- o `form` fica todo junto (fácil de enviar para uma API mais tarde)

---

### 4.3 Nota curta: quando `useReducer` começa a fazer sentido

Se tiveres muitas regras e muitas transições (ex.: 20 campos, passos, validações complexas), `useReducer` pode ajudar.

Para já, o objeto + handler genérico já é um salto grande sem aumentar demasiado a complexidade.

---

<a id="sec-5"></a>

## 5. [EXTRA] Armadilhas comuns e diagnóstico rápido

### 5.1 “A component is changing an uncontrolled input to be controlled”

Isto aparece quando um input começa com `value={undefined}` e depois passa a ter string.

Regra simples:

- inputs controlados devem ter **valor inicial coerente**
    - texto: `""`
    - número: `0` (ou `""`, se quiseres permitir vazio)
    - checkbox: `false`
    - select: um `value` que exista nas opções

---

### 5.2 Misturar `value` com `defaultValue` sem motivo

- `value` → controlado
- `defaultValue` → não controlado (valor inicial apenas)

Evita misturar os dois no mesmo campo.

---

### 5.3 Input de ficheiro (nota importante)

`<input type="file" />` não é controlado da mesma forma que os outros.

Normalmente tu:

- lês o ficheiro com `e.target.files[0]`
- guardas esse ficheiro no estado (ou envias logo)
- não defines `value`

Exemplo:

```jsx
function Upload() {
    const [ficheiro, setFicheiro] = useState(null);

    function handleChange(e) {
        setFicheiro(e.target.files?.[0] ?? null);
    }

    return <input type="file" onChange={handleChange} />;
}
```

---

### 5.4 Debug rápido (quando algo não está a atualizar)

1. Confirma se o input tem `value={...}` ligado ao estado certo.
2. Confirma se o `onChange` está a fazer `setState(e.target.value)` (ou `checked`).
3. Mostra o estado no ecrã (temporariamente):

```jsx
<pre>{JSON.stringify(form, null, 2)}</pre>
```

4. Se for objeto, confirma se estás a usar `...prev` no update.

---

### 5.5 Checkpoint

- O que causa o aviso “uncontrolled → controlled”?
- Porque é que checkbox usa `checked` e não `value`?
- Como é que confirmas rapidamente se o estado está a acompanhar o formulário?

---

<a id="exercicios"></a>

## Exercícios - Formulários controlados

1. Cria `FormBasico.jsx` com estado `nome` e um `<input>` controlado (`value` + `onChange`). Mostra o estado num `<p>` abaixo.
2. No mesmo componente, adiciona `email` e mostra os dois valores na UI.
3. Adiciona um campo `idade` com `type="number"`. Guarda **número** no estado usando `Number(...)`.
4. Adiciona um checkbox “Aceito os termos” (`checked` + `e.target.checked`) e mostra “Sim/Não”.
5. Adiciona um select com 3 opções e mostra o valor escolhido.
6. Adiciona um textarea com contador de caracteres.
7. Transforma o conjunto num `<form>` com `onSubmit`. Usa `preventDefault()`.
8. Valida: nome obrigatório e email deve conter `@`. Mostra mensagem por baixo de cada campo.
9. Bloqueia o submit se não aceitar termos. Mostra erro ao lado do checkbox.
10. Limpa o formulário após submit válido.
11. (EXTRA) Refaz o formulário com estado em objeto `form` + `name` + `handleChange` genérico.
12. (EXTRA) Mostra o `form` com `<pre>{JSON.stringify(form, null, 2)}</pre>` para validar mentalmente o que está a acontecer.
13. (EXTRA) Cria um campo `password` e valida “mínimo 6 caracteres”.
14. (EXTRA) Cria um estado `status` (`"idle" | "success"`) e mostra “Enviado com sucesso” quando o submit for válido.

---

<a id="changelog"></a>

## Changelog

- 2026-01-11: criação do ficheiro.
- 2026-01-12: exemplos base de inputs controlados, submit e validação simples.
- 2026-01-26: reescrita completa para maior clareza e detalhe (nível do ficheiro 08), com modelo mental, decisões práticas, exemplos completos, validação por campo, estado em objeto e secção de diagnóstico.
