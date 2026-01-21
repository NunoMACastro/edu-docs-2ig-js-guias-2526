# React.js (11.º Ano) - 03 · Props e composição

> **Objetivo deste ficheiro**
> Aprender a passar dados para componentes através de props.
> Usar props com vários tipos de dados e entender que são imutáveis.
> Compor componentes usando `children`.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Props como entradas de um componente](#sec-1)
-   [2. [ESSENCIAL] Props com tipos diferentes](#sec-2)
-   [3. [ESSENCIAL] Callbacks e fluxo de dados](#sec-3)
-   [4. [ESSENCIAL] Children e composição](#sec-4)
-   [5. [EXTRA] Props opcionais e valores por defeito](#sec-5)
-   [Exercícios - Props e composição](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** domina as props básicas antes de ir ao [EXTRA].
-   **Como estudar:** cria vários componentes e muda os dados passados.
-   **Ligações:** revê JSX e componentes em `02_jsx_e_componentes.md` se tiveres dúvidas.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Props como entradas de um componente

### Modelo mental

Props são como **entradas** de um componente, tal como os **parâmetros de uma função**. Um componente recebe valores e usa-os para desenhar a interface. A ideia principal é simples:

-   O **componente pai** decide os dados.
-   O **componente filho** recebe e usa esses dados.
-   As props são **só de leitura**: o componente não deve alterar o que recebeu.

Se precisares de mudar valores ao longo do tempo, isso é outra conversa (state), mas aqui queremos dominar o básico: **passar dados para o componente**.

### Sintaxe base (passo a passo)

-   **Passar props no JSX:** escreves atributos no componente, por exemplo `<Card titulo="..." />`.
-   **Receber props na função:** a função recebe um objeto `props`.
-   **Usar props no JSX:** acedes com `props.nomeDaProp`.
-   **Destructuring (opcional):** podes abrir as props logo no parâmetro: `function Card({ titulo }) {}`.
-   **Nomes consistentes:** se passas `titulo`, tens de ler `titulo` (não `title`).
-   **Props são só de leitura:** não faças `props.titulo = "..."`.

> **Nota:** props são sensíveis a maiúsculas/minúsculas. `titulo` é diferente de `Titulo`.

### Exemplo

```jsx
// src/components/Card.jsx
function Card(props) {
    // O componente usa props para mostrar dados dinâmicos
    return (
        <article>
            <h2>{props.titulo}</h2>
            <p>{props.descricao}</p>
        </article>
    );
}

export default Card;
```

```jsx
// src/App.jsx
import Card from "./components/Card.jsx";

function App() {
    return (
        <main>
            {/* Passamos os dados para o componente */}
            <Card titulo="Curso Profissional" descricao="Módulo de React" />
        </main>
    );
}

export default App;
```

```jsx
// src/components/Card.jsx
function Card({ titulo, descricao }) {
    // Destructuring: escreves as props diretamente
    return (
        <article>
            <h2>{titulo}</h2>
            <p>{descricao}</p>
        </article>
    );
}
```

### Erros comuns

-   **Tentar alterar `props.titulo`:** props são só de leitura.
-   **Passar uma prop e ler outra:** `titulo` não é o mesmo que `title`.
-   **Esquecer de passar props:** o componente recebe `undefined`.
-   **Esquecer as chavetas:** ao mostrar a prop, tem de ser `{props.titulo}`.

### Boas práticas

-   Usa nomes de props claros e consistentes.
-   Mantém o componente focado em mostrar os dados.
-   Se uma prop tiver um nome estranho, renomeia no pai e no filho ao mesmo tempo.

### Checkpoint

-   Porque é que props são só de leitura?
-   Quando é que faz sentido usar destructuring?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Props com tipos diferentes

### Modelo mental

Props não são só texto. Podes passar **números**, **booleanos**, **arrays**, **objetos** e até **funções**. A regra principal é:

-   Strings vão entre aspas.
-   Tudo o que é JavaScript vai entre chavetas `{}`.

### Sintaxe base (passo a passo)

-   **Texto:** `titulo="React"` (aspas).
-   **Número:** `idade={17}` (chavetas).
-   **Booleano:** `ativo={true}` ou só `ativo` (equivale a true).
-   **Array:** `notas={[14, 16, 18]}`.
-   **Objeto:** `endereco={{ cidade: "Lisboa" }}`.
-   **Função:** `onClicar={handleClick}` (vamos aprofundar em eventos mais à frente).

### Tabela rápida de tipos

| Tipo de prop | Como passar no JSX                | Exemplo                      |
| ------------ | --------------------------------- | ---------------------------- |
| Texto        | `nome="Ana"`                      | `titulo="React"`             |
| Número       | `idade={17}`                      | `preco={9.99}`               |
| Booleano     | `ativo={true}`                    | `inscrito`                   |
| Array        | `notas={[14, 16]}`                | `tags={["UI", "JSX"]}`       |
| Objeto       | `endereco={{ cidade: "Lisboa" }}` | `config={{ tema: "claro" }}` |

### Exemplo

```jsx
// src/components/Perfil.jsx
function Perfil(props) {
    // Usamos vários tipos de props no mesmo componente
    return (
        <section>
            <h2>{props.nome}</h2>
            <p>Idade: {props.idade}</p>
            {/* Booleanos podem controlar texto */}
            <p>Inscrito: {props.inscrito ? "Sim" : "Não"}</p>
            {/* Arrays podem ser mostrados com join */}
            <p>Tags: {props.tags.join(", ")}</p>
        </section>
    );
}

export default Perfil;
```

```jsx
// src/App.jsx
import Perfil from "./components/Perfil.jsx";

function App() {
    return (
        <main>
            {/* Passamos número, booleano e array com chavetas */}
            <Perfil
                nome="Marco"
                idade={17}
                inscrito={true}
                tags={["React", "JSX"]}
            />
        </main>
    );
}

export default App;
```

### Erros comuns

-   **Esquecer as chavetas em números e booleanos:** `idade="17"` vira texto.
-   **Passar um objeto e alterar dentro do componente:** continua a ser alteração de props.
-   **Usar `true/false` como texto:** `ativo="true"` é texto, não booleano.

### Boas práticas

-   Confirma sempre o nome e o tipo de cada prop.
-   Quando a prop é opcional, garante um valor seguro.
-   Se o dado for complexo, passa só o que é necessário (evita objetos gigantes).

### Checkpoint

-   Em que casos usas chavetas `{}` ao passar props?
-   O que acontece se passares `ativo="true"`?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Callbacks e fluxo de dados

### Modelo mental

No React, **dados descem** por props e **ações sobem** por callbacks.

-   **Dados descem:** o pai passa informação para o filho.
-   **Ações sobem:** o filho chama uma função do pai para pedir mudanças.
-   **Levantar estado:** se dois filhos precisam do mesmo dado, o estado sobe para o pai.

Pensa assim: o componente pai controla o estado, e os filhos pedem mudanças através de funções.

### Sintaxe base (passo a passo)

-   **O pai guarda o estado.**
-   **O pai cria uma função que altera o estado.**
-   **O pai passa a função ao filho como prop.**
-   **O filho chama a função quando o utilizador interage.**

### Exemplo (levantar estado)

```jsx
// src/App.jsx
import { useState } from "react";
import Editor from "./components/Editor.jsx";
import Preview from "./components/Preview.jsx";

function App() {
    const [texto, setTexto] = useState("");

    function atualizarTexto(novoTexto) {
        setTexto(novoTexto);
    }

    return (
        <main>
            {/* Dados descem */}
            <Editor texto={texto} onTextoChange={atualizarTexto} />
            <Preview texto={texto} />
        </main>
    );
}

export default App;
```

```jsx
// src/components/Editor.jsx
function Editor({ texto, onTextoChange }) {
    return (
        <div>
            <label htmlFor="texto">Texto</label>
            <input
                id="texto"
                value={texto}
                onChange={(e) => onTextoChange(e.target.value)}
            />
        </div>
    );
}

export default Editor;
```

```jsx
// src/components/Preview.jsx
function Preview({ texto }) {
    return <p>Pré-visualização: {texto || "—"}</p>;
}

export default Preview;
```

### Erros comuns

-   Tentar alterar uma prop diretamente no filho.
-   Criar estado duplicado em dois componentes que precisam do mesmo dado.
-   Esquecer de passar o callback e ficar sem resposta ao clicar/escrever.

### Boas práticas

-   Mantém o estado no componente mais alto que precisa dele.
-   Dá nomes claros aos callbacks (`onTextoChange`, `onGuardar`, `onSelecionar`).

### Checkpoint

-   O que significa “dados descem, ações sobem”?
-   Quando é que faz sentido levantar o estado?

<a id="sec-4"></a>

## 4. [ESSENCIAL] Children e composição

### Modelo mental

`children` é o **conteúdo que colocas dentro de um componente**. Isto permite criar componentes “contentores” que envolvem outros, por exemplo cartões, painéis ou secções.

Imagina um componente `<Painel>` que desenha uma caixa com sombra. Tudo o que estiver entre `<Painel> ... </Painel>` é o `children`.

### Sintaxe base (passo a passo)

-   **No componente:** usa `props.children` para mostrar o conteúdo interno.
-   **No JSX:** escreve o conteúdo entre as tags do componente.
-   **O conteúdo pode ser texto, JSX ou outros componentes.**
-   **Se não passares nada, `children` é `undefined`.**

### Exemplo

```jsx
// src/components/Painel.jsx
function Painel(props) {
    return (
        <section className="painel">
            {/* Aqui entram os elementos colocados dentro do componente */}
            {props.children}
        </section>
    );
}

export default Painel;
```

```jsx
// src/App.jsx
import Painel from "./components/Painel.jsx";

function App() {
    return (
        <main>
            {/* Tudo o que está dentro vira children */}
            <Painel>
                <h2>Notícias</h2>
                <p>Conteúdo dentro do painel.</p>
            </Painel>
        </main>
    );
}

export default App;
```

```jsx
// src/components/Botao.jsx
function Botao(props) {
    return (
        <button className="botao">
            {/* children permite escolher o texto do botão ao usar o componente */}
            {props.children}
        </button>
    );
}
```

### Erros comuns

-   **Esquecer de renderizar `props.children`:** o conteúdo passado não aparece.
-   **Usar `children` quando o componente devia ter props específicas:** por exemplo, um `Avatar` precisa de `foto` e `nome`.
-   **Misturar responsabilidades:** usar `children` para tudo torna o componente confuso.

### Boas práticas

-   Usa `children` para componentes genéricos (ex.: Card, Painel).
-   Mantém o conteúdo interno simples e organizado.
-   Se precisares de algo fixo + conteúdo, combina props com `children`.

### Checkpoint

-   O que é `children` numa frase?
-   Quando é que `children` é melhor do que uma prop específica?

<a id="sec-5"></a>

## 5. [EXTRA] Props opcionais e valores por defeito

### Modelo mental

Algumas props podem ser opcionais. Quando faltam, o componente deve mostrar algo aceitável para evitar `undefined` no ecrã.

### Sintaxe base (passo a passo)

-   **Valor por defeito no parâmetro:** `function Botao({ texto = "Clicar" }) { ... }`
-   **Fallback simples no JSX:** `const textoFinal = texto ?? "Clicar"`
-   **Evita esconder erros:** usa defaults quando faz sentido, não para tudo.

### Exemplo

```jsx
// src/components/Botão.jsx
function Botao({ texto = "Clicar" }) {
    // Se não vier texto, usa o valor por defeito
    return <button>{texto}</button>;
}

export default Botao;
```

```jsx
// src/components/Avatar.jsx
function Avatar({ nome, foto }) {
    // Se não vier foto, usamos uma imagem genérica
    const fotoFinal = foto ?? "https://via.placeholder.com/80";

    return (
        <figure>
            <img src={fotoFinal} alt={`Avatar de ${nome}`} />
            <figcaption>{nome}</figcaption>
        </figure>
    );
}
```

### Erros comuns

-   Assumir que a prop existe e depois ter `undefined` no ecrã.
-   Usar `||` quando o valor pode ser `0` ou `""` (o fallback aparece sem querer).

### Boas práticas

-   Define valores por defeito para props opcionais.
-   Evita muitos defaults para não esconder erros.
-   Se uma prop é obrigatória, deixa claro no nome e na documentação.

### Checkpoint

-   Porque é que `||` pode falhar com `0` ou `""`?
-   Que vantagem tem um valor por defeito no parâmetro?

<a id="exercicios"></a>

## Exercícios - Props e composição

1. Cria um componente `Produto`. No `return`, mostra o `nome` e o `preco` recebidos por props.
2. No `App`, importa `Produto` e usa-o três vezes com dados diferentes.
3. Cria um componente `Aluno` com props `nome`, `curso` e `ano`. Mostra tudo num cartão simples.
4. Dentro do componente `Aluno`, adiciona uma prop `aprovado` e mostra “Aprovado” ou “Reprovado” com um ternário.
5. Cria um componente `Painel` que usa `props.children` para mostrar o conteúdo interno.
6. No `App`, usa o `Painel` e coloca dentro um título e uma lista com 3 itens.
7. Adiciona uma prop `cor` a um componente e usa-a num `style` para mudar a cor de fundo.
8. Corrige um erro de nome de prop (ex: passa `titulo` e lê `title`).
9. Cria um componente `Mensagem` com prop opcional `texto`.
10. Usa valores por defeito em pelo menos uma prop.

<a id="changelog"></a>

## Changelog

-   2026-01-11: criação do ficheiro.
-   2026-01-12: explicações detalhadas, exemplos extra e exercícios em formato passo a passo.
-   2026-01-12: secção ESSENCIAL sobre callbacks, fluxo de dados e levantar estado.
