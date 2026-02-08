# React.js (12.º Ano) - 03 · Props e composição

> **Objetivo deste ficheiro**
>
> - Perceber o que são **props** e como passam dados do **pai → filho**.
> - Aprender a escrever componentes **reutilizáveis**, com uma “interface” clara (as props).
> - Usar **children** para composição (componentes dentro de componentes).
> - Passar **funções por props** (o filho avisa o pai) e ligar isto a eventos.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] O que são props (dados do pai para o filho)](#sec-1)
- [2. [ESSENCIAL] Destructuring e valores por defeito](#sec-2)
- [3. [ESSENCIAL] children e composição](#sec-3)
- [4. [ESSENCIAL] Funções como props (o filho avisa o pai)](#sec-4)
- [5. [EXTRA] Desenhar componentes reutilizáveis (a “API” das props)](#sec-5)
- [6. [EXTRA] Prop drilling (quando as props passam por muitos níveis)](#sec-6)
- [Exercícios - Props e composição](#exercicios)
- [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **Ordem recomendada:** lê a teoria e faz logo as experiências pequenas (para veres o comportamento no browser).
- **Regra de ouro:** props são **entradas** do componente (como parâmetros de uma função).
- **Ligações:**
    - JSX e criação de componentes: `02_jsx_e_componentes.md`
    - Estado e eventos (onde vais usar callbacks): `04_estado_e_eventos.md`

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] O que são props (dados do pai para o filho)

### 1.1 Modelo mental (o mais importante)

Pensa num componente como uma função:

- **entra** informação
- **sai** JSX (o que aparece no ecrã)

Em React, essa informação que entra chama-se **props**.

- O componente **pai** escreve o componente **filho** no JSX e passa-lhe props.
- O componente **filho** recebe essas props e usa-as para calcular o seu JSX.

Mini-diagrama:

```
Pai (tem dados) → passa props → Filho (mostra UI)
```

Regra essencial:

> As props são **só de leitura** no filho. O filho **não deve** alterar props.

Porquê?

- Porque o dono dos dados é o **pai**.
- O React funciona muito bem quando os dados têm “dono” claro.

---

### 1.2 Exemplo mínimo: `Saudacao`

#### A) Filho: recebe props

Cria `src/components/Saudacao.jsx`:

```jsx
// src/components/Saudacao.jsx

/**
 * Saudacao
 * Mostra uma mensagem de boas-vindas.
 *
 * @param {Object} props
 * @param {string} props.nome - Nome da pessoa.
 * @returns {JSX.Element}
 */
function Saudacao(props) {
    return <p>Olá, {props.nome}!</p>;
}

export default Saudacao;
```

#### B) Pai: passa props

No `src/App.jsx`:

```jsx
// src/App.jsx
import Saudacao from "./components/Saudacao.jsx";

/**
 * App
 * Componente principal onde usamos o componente Saudacao.
 */
function App() {
    return (
        <main>
            <h1>Props a funcionar</h1>
            <Saudacao nome="Rita" />
            <Saudacao nome="Diogo" />
        </main>
    );
}

export default App;
```

O que estás a fazer:

- O `App` está a dizer: “Saudacao, mostra ‘Olá’ para esta pessoa.”
- O `Saudacao` usa `props.nome` para escrever no ecrã.

---

### 1.3 Experiência rápida: props mudam → UI muda

Muda no `App`:

```jsx
<Saudacao nome="Rita" />
```

para

```jsx
<Saudacao nome="Rita Silva" />
```

Guarda. O ecrã muda imediatamente.
Isto mostra a ideia central: a UI é calculada a partir dos dados.

---

### 1.4 Props podem ser textos, números, booleanos, objetos…

**Atenção às chavetas `{}`**:

- texto direto: `"Rita"` (fica entre aspas)
- número/boolean/expressão: `{17}`, `{true}`, `{2 + 3}`

Exemplo:

```jsx
import Saudacao from "./components/Saudacao.jsx";

/**
 * App
 * Demonstra props com diferentes tipos.
 */
function App() {
    const idade = 17;
    const estaOnline = true;

    return (
        <main>
            <Saudacao nome="Rita" />
            <p>Idade: {idade}</p>
            <p>Online: {estaOnline ? "Sim" : "Não"}</p>
        </main>
    );
}

export default App;
```

Erro comum:

```jsx
// ERRADO: isto é texto "17" e não número 17
<Aluno idade="17" />
```

Certo:

```jsx
<Aluno idade={17} />
```

---

### 1.5 Erros comuns (para reconhecer rápido)

- **Esquecer aspas em texto:** `<Saudacao nome=Rita />` (erro) → deve ser `"Rita"`
- **Escrever uma expressão sem `{}`:** `nome + "!"` tem de estar dentro de `{}`
- **Tentar alterar props no filho:** `props.nome = "..."` (não faças isto)

### 1.6 Checkpoint

- O que são props?
- Quem é “dono” dos dados: pai ou filho?
- Porque é que props não devem ser alteradas no filho?

---

<a id="sec-2"></a>

## 2. [ESSENCIAL] Destructuring e valores por defeito

Quando um componente usa várias props, escrever `props.algo` muitas vezes torna-se chato.
Uma forma comum é usar **destructuring**.

### 2.1 Destructuring (forma mais usada)

Em vez de:

```jsx
function Aluno(props) {
    return (
        <p>
            {props.nome} - {props.idade}
        </p>
    );
}
```

Fazes:

```jsx
/**
 * Aluno
 *
 * @param {Object} props
 * @param {string} props.nome
 * @param {number} props.idade
 */
function Aluno({ nome, idade }) {
    return (
        <p>
            {nome} - {idade}
        </p>
    );
}

export default Aluno;
```

Isto significa:

- “vai buscar `nome` e `idade` lá de dentro das props”
- e cria variáveis com esses nomes

---

### 2.2 Valores por defeito (default)

Às vezes uma prop é opcional. Podes dar um valor por defeito na própria assinatura:

```jsx
/**
 * Badge
 * Mostra um rótulo pequeno.
 *
 * @param {Object} props
 * @param {string} [props.texto="Novo"] - Texto do badge.
 */
function Badge({ texto = "Novo" }) {
    return <span className="badge">{texto}</span>;
}

export default Badge;
```

Uso:

```jsx
<Badge />              // mostra "Novo"
<Badge texto="Urgente" />  // mostra "Urgente"
```

Regra prática:

- usa default quando existe um “comportamento normal” se a prop não vier.

---

### 2.3 Props “existe / não existe” (booleanos)

Em JSX, podes passar `true` só por escrever a prop:

```jsx
<Cartao destacado />
```

Isto é o mesmo que:

```jsx
<Cartao destacado={true} />
```

E no componente:

```jsx
function Cartao({ destacado = false }) {
    return (
        <div className={destacado ? "card card--destacado" : "card"}>
            Conteúdo
        </div>
    );
}
```

Erro comum:

- pensar que `destacado="false"` é falso… mas é texto, e texto conta como verdadeiro.
- se quiseres falso, faz `destacado={false}` ou não passes a prop.

---

### 2.4 Checkpoint

- O que é destructuring de props?
- Para que servem valores por defeito?
- Qual é a diferença entre `destacado` e `destacado="false"`?

---

<a id="sec-3"></a>

## 3. [ESSENCIAL] children e composição

### 3.1 O que é `children`

Quando escreves isto:

```jsx
<Cartao>
    <p>Olá!</p>
</Cartao>
```

Tudo o que está entre a abertura e o fecho (`<p>Olá!</p>`) chama-se **children**.

Ou seja:

- `children` é o “conteúdo” que o pai mete dentro do componente.

Isto é super útil para criar componentes tipo:

- `Card`, `Modal`, `Layout`, `Painel`, `Botao`

---

### 3.2 Exemplo: `Card` reutilizável

Cria `src/components/Card.jsx`:

```jsx
// src/components/Card.jsx

/**
 * Card
 * Um contentor reutilizável que mostra o que estiver lá dentro.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Conteúdo colocado dentro do Card.
 */
function Card({ children }) {
    return <section className="card">{children}</section>;
}

export default Card;
```

E no `App.jsx`:

```jsx
import Card from "./components/Card.jsx";

/**
 * App
 * Demonstra composição com children.
 */
function App() {
    return (
        <main>
            <h1>children e composição</h1>

            <Card>
                <h2>Primeiro card</h2>
                <p>Este conteúdo veio do pai.</p>
            </Card>

            <Card>
                <h2>Segundo card</h2>
                <ul>
                    <li>Item A</li>
                    <li>Item B</li>
                </ul>
            </Card>
        </main>
    );
}

export default App;
```

O que aprendeste aqui:

- O `Card` não precisa de saber que conteúdo tem.
- Ele só dá a “moldura” (o container).
- O pai decide o conteúdo.

---

### 3.3 Experiência rápida: o `Card` serve para tudo

Troca o conteúdo dentro do `<Card>...</Card>`.
O `Card` continua a funcionar porque ele não depende do conteúdo.
Isto é reutilização a sério.

---

### 3.4 Erros comuns

- Esquecer o `children` no componente e depois “não aparece nada”.
- Confundir `children` com props normais (children é só um nome especial para conteúdo interno).

### 3.5 Checkpoint

- O que é `children`?
- Qual é a vantagem de `Card` usar `children` em vez de ter texto fixo?

---

<a id="sec-4"></a>

## 4. [ESSENCIAL] Funções como props (o filho avisa o pai)

Até agora, props foram “dados” (texto, números).
Mas também podes passar **funções** por props.

Isto é uma das ideias mais importantes do React:

- o pai passa uma função,
- o filho chama essa função quando acontece algo (ex.: clique).

Mini-diagrama:

```
Pai cria função → passa ao filho → filho chama → pai reage (muda estado, etc.)
```

> Isto liga diretamente ao ficheiro 04 (estado e eventos), porque normalmente o pai vai fazer `setState(...)` dentro da função.

---

### 4.1 Exemplo: botão que “avisa” o pai

Cria `src/components/Botao.jsx`:

```jsx
// src/components/Botao.jsx

/**
 * Botao
 * Um botão reutilizável que chama a função onAcao quando é clicado.
 *
 * @param {Object} props
 * @param {string} props.texto - Texto do botão.
 * @param {Function} props.onAcao - Função chamada no clique.
 */
function Botao({ texto, onAcao }) {
    return <button onClick={onAcao}>{texto}</button>;
}

export default Botao;
```

E no `App.jsx`:

```jsx
import Botao from "./components/Botao.jsx";

/**
 * App
 * Demonstra uma função passada por props.
 */
function App() {
    function dizerOla() {
        alert("Olá!");
    }

    return (
        <main>
            <h1>Funções como props</h1>
            <Botao texto="Dizer olá" onAcao={dizerOla} />
        </main>
    );
}

export default App;
```

Repara no detalhe mais importante:

- `onAcao={dizerOla}` → passa a função
- não é `onAcao={dizerOla()}` (isso executava logo)

---

### 4.2 Exemplo mais real: o filho envia um valor ao pai

Agora o filho vai chamar a função e mandar um valor (por exemplo, o nome selecionado).

`src/components/AlunoItem.jsx`:

```jsx
// src/components/AlunoItem.jsx

/**
 * AlunoItem
 * Mostra um aluno e avisa o pai quando é escolhido.
 *
 * @param {Object} props
 * @param {string} props.nome - Nome do aluno.
 * @param {Function} props.onEscolher - Função chamada com o nome.
 */
function AlunoItem({ nome, onEscolher }) {
    return <button onClick={() => onEscolher(nome)}>{nome}</button>;
}

export default AlunoItem;
```

E no `App.jsx`:

```jsx
import { useState } from "react";
import AlunoItem from "./components/AlunoItem.jsx";

/**
 * App
 * Pai guarda o aluno escolhido em estado.
 */
function App() {
    const [escolhido, setEscolhido] = useState("");

    function escolherAluno(nome) {
        setEscolhido(nome);
    }

    return (
        <main>
            <h1>Escolher aluno</h1>

            <AlunoItem nome="Rita" onEscolher={escolherAluno} />
            <AlunoItem nome="Diogo" onEscolher={escolherAluno} />

            {escolhido && <p>Escolheste: {escolhido}</p>}
        </main>
    );
}

export default App;
```

O que aconteceu:

- O pai passou a função `escolherAluno`.
- O filho chamou essa função com o valor `nome`.
- O pai guardou o valor em estado e a UI atualizou.

Isto é **comunicação filho → pai** (mas a decisão e o estado ficam no pai).

---

### 4.3 Erros comuns

- `onClick={minhaFuncao()}` → executa logo.
- Esquecer de passar a função e depois `onAcao` é `undefined`.
- Passar uma função que muda props diretamente (não faças isso; muda estado no pai).

### 4.4 Checkpoint

- Porque é que passamos funções por props?
- Qual a diferença entre `onClick={f}` e `onClick={f()}`?
- Quem deve guardar o estado: pai ou filho? (depende, mas neste padrão o dono é o pai)

---

<a id="sec-5"></a>

## 5. [EXTRA] Desenhar componentes reutilizáveis (a “API” das props)

Quando um componente é reutilizável, ele é como uma peça de LEGO:

- tem uma forma (JSX)
- e tem “entradas” bem definidas (props)

### 5.1 Regras simples para props bem escolhidas

- Usa nomes claros: `titulo`, `subtitulo`, `onFechar`, `ativo`.
- Se a prop é um “evento”, começa por `on...`: `onEscolher`, `onRemover`, `onGuardar`.
- Se a prop é booleana, usa nome “sim/não”: `ativo`, `visivel`, `destacado`.
- Evita props que fazem muita coisa ao mesmo tempo (fica confuso).

### 5.2 Exemplo: `Botao` mais completo (sem ficar complicado)

```jsx
/**
 * Botao
 * @param {Object} props
 * @param {string} props.texto
 * @param {Function} props.onAcao
 * @param {boolean} [props.desativado=false]
 */
function Botao({ texto, onAcao, desativado = false }) {
    return (
        <button onClick={onAcao} disabled={desativado}>
            {texto}
        </button>
    );
}
```

Uso:

```jsx
<Botao texto="Guardar" onAcao={guardar} />
<Botao texto="Apagar" onAcao={apagar} desativado />
```

---

<a id="sec-6"></a>

## 6. [EXTRA] Prop drilling (quando as props passam por muitos níveis)

### 6.1 O que é

Prop drilling é quando um dado tem de passar por vários componentes “pelo meio”, mesmo que esses componentes não precisem desse dado.
Eles só fazem “ponte” para chegar a outro componente mais abaixo.

Exemplo mental:

```
App
  ↓ passa props
Pagina
  ↓ passa props
Painel
  ↓ passa props
Botao (é aqui que o valor é usado)
```

Isto não é “proibido”. Em projetos pequenos é normal.
Mas quando começa a ficar demasiado longo, fica chato e aumenta a chance de erros.

### 6.2 Soluções comuns (sem entrares já a fundo)

- Reorganizar componentes (meter o dono do estado mais perto de quem usa).
- Criar componentes que recebem `children` (reduz a necessidade de passar coisas).
- Usar **Context** quando for mesmo necessário (vais ver no `12_context_api_estado_global.md`).

---

<a id="exercicios"></a>

## Exercícios - Props e composição

1. **Saudacao com props**
    - Cria `Saudacao.jsx` e usa 3 vezes no `App` com nomes diferentes.

2. **Tipos de props**
    - Cria `Aluno.jsx` com `nome` e `idade`.
    - Usa no `App` com `idade={17}` (sem aspas).

3. **Destructuring**
    - Reescreve o `Aluno` para receber `{ nome, idade }`.

4. **Default**
    - Cria `Badge.jsx` com prop `texto="Novo"` por defeito.
    - Usa `<Badge />` e `<Badge texto="Urgente" />`.

5. **Booleanos**
    - Cria `Cartao.jsx` com prop `destacado`.
    - Se `destacado` for true, mostra um texto extra “Destaque”.

6. **children**
    - Cria `Card.jsx` com `children`.
    - Usa o `Card` para envolver conteúdos diferentes (texto, lista, etc.).

7. **Funções como props**
    - Cria `Botao.jsx` que recebe `texto` e `onAcao`.
    - No `App`, cria duas funções diferentes e dois botões.

8. **Filho envia valor ao pai**
    - Cria `AlunoItem.jsx` que chama `onEscolher(nome)`.
    - No pai, guarda o escolhido em `useState` e mostra no ecrã.

9. **Diagnóstico**
    - Faz `onClick={minhaFuncao()}` de propósito, vê o que acontece, e corrige para `onClick={minhaFuncao}`.

10. **Mini-projeto (composição + props)**

- Faz um `CardPerfil` que recebe:
    - `nome`
    - `curso`
- Usa `children` para permitir que o pai meta conteúdo extra (ex.: lista de hobbies).

<a id="changelog"></a>

## Changelog

- 2026-01-11: criação do ficheiro.
- 2026-01-26: reforço do modelo mental de props como “entradas do componente”.
- 2026-01-26: expansão didática (destructuring, defaults, booleanos, children, funções como props, exemplos com estado no pai e nota de prop drilling).
