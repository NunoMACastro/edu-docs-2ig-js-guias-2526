# React.js (11.º Ano) - 02 · JSX e componentes

> **Objetivo deste ficheiro**
> Perceber o que é JSX e porque é diferente de HTML.
> Aprender as regras essenciais do JSX e criar componentes funcionais.
> Organizar pequenos componentes para montar uma página.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] O que é JSX](#sec-1)
-   [2. [ESSENCIAL] Regras importantes do JSX](#sec-2)
-   [3. [ESSENCIAL] Componentes funcionais e exportação](#sec-3)
-   [4. [EXTRA] Componentes pequenos e composição visual](#sec-4)
-   [Exercícios - JSX e componentes](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** foca primeiro as secções [ESSENCIAL]; usa [EXTRA] para consolidar.
-   **Como estudar:** escreve o JSX, testa, muda valores e observa o resultado.
-   **Ligações:** se não tens o projeto criado, volta a `01_fundamentos_e_setup.md`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] O que é JSX

### Modelo mental

JSX é uma sintaxe que permite escrever uma estrutura parecida com HTML **dentro do JavaScript**. O React transforma esse JSX em chamadas JavaScript que criam elementos na página. Ou seja: **JSX não é HTML**, é uma forma mais simples e legível de criar UI.

Pensa no JSX como uma **tradução automática**: tu escreves algo parecido com HTML, e a ferramenta de build converte tudo para JavaScript.

### Sintaxe base (passo a passo)

-   **JSX é uma expressão JavaScript:** podes guardar JSX numa variável ou devolver no `return`.
-   **Parênteses para multi-linha:** quando o JSX ocupa várias linhas, envolve com `(` e `)`.
-   **Um único elemento pai (elemento raiz):** o `return` tem de devolver **uma** tag que envolve as outras. “Elemento pai” é a tag que fica por fora e engloba todas as restantes.
-   **Fragmentos para não criar `<div>` extra:** usa `<>...</>` quando não queres criar uma tag real no HTML.
-   **Chavetas `{}` para expressões:** servem para inserir variáveis, contas, chamadas simples ou valores calculados.
-   **Texto normal escreve-se direto:** só usas `{}` quando queres colocar JavaScript.
-   **Comentários no JSX:** usam `{/* comentário */}`.
-   **Tags auto-fechadas:** `<img />`, `<input />`, `<br />` precisam de `/>`.
-   **Atributos recebem valores:** strings com aspas; valores JS com `{}` (detalhado na secção 2).

### JSX vs HTML (comparação rápida)

| JSX                      | HTML                     | O que muda                                                        |
| ------------------------ | ------------------------ | ----------------------------------------------------------------- |
| `<h1>Olá</h1>`           | `<h1>Olá</h1>`           | Igual na maioria das tags de texto                                |
| `<img src="..." />`      | `<img src="...">`        | Em JSX as tags sem conteúdo fecham com `/>`                       |
| `{nome}`                 | _(não existe)_           | JSX permite inserir valores JS dentro do texto                    |
| `{/* comentário */}`     | `<!-- comentário -->`    | Comentários têm sintaxe diferente                                 |
| `<>...</>`               | `<div>...</div>`         | Fragmento evita criar uma `<div>` extra                           |
| `<button onClick={...}>` | `<button onclick="...">` | Eventos usam `camelCase` e recebem funções, não strings           |
| `<p className="...">`    | `<p class="...">`        | `class` é palavra reservada em JS, por isso muda para `className` |
| `<label htmlFor="...">`  | `<label for="...">`      | `for` também é palavra reservada, por isso muda para `htmlFor`    |

### Exemplo

```jsx
const nome = "Rita";

function App() {
    return (
        <main>
            {/* As chavetas permitem inserir valores JS dentro do JSX */}
            <h1>Olá, {nome}</h1>
            {/* Podemos mostrar o resultado de uma conta */}
            <p>2 + 3 = {2 + 3}</p>
        </main>
    );
}

export default App;
```

### Mais exemplos de sintaxe

```jsx
const nome = "Rita";
const estaLogado = true;

function App() {
    // JSX pode ser guardado numa variável
    const cabecalho = (
        <>
            <h1>Olá, {nome}</h1>
            {/* Expressão simples dentro de JSX */}
            <p>2 + 3 = {2 + 3}</p>
        </>
    );

    return (
        <section>
            {cabecalho}
            {/* Operador ternário para escolher texto */}
            <p>{estaLogado ? "Bem-vinda" : "Faz login"}</p>
        </section>
    );
}
```

### Erros comuns

-   **Usar `if` diretamente no JSX:** JSX aceita expressões, não instruções. Faz o `if` antes do `return` ou usa `condição ? A : B`.
-   **Devolver dois elementos “soltos”:** o `return` precisa de um elemento pai (uma tag que envolve todas as outras). Usa `<div>` ou `<>...</>`.
-   **Esquecer `/>` em tags sem conteúdo:** `<img>` e `<input>` precisam de `/>` no JSX.
-   **Colocar texto simples entre `{}`:** chavetas só para valores JS. Texto normal escreve-se direto.

### Exemplo de erro e correção

```jsx
// ERRADO: dois elementos soltos
return (
    <h1>Olá</h1>
    <p>Bem-vindo</p>
);
```

```jsx
// CERTO: um elemento pai
return (
    <div>
        <h1>Olá</h1>
        <p>Bem-vindo</p>
    </div>
);
```

### Boas práticas

-   Mantém JSX simples e legível.
-   Se a expressão for grande, calcula antes e usa a variável.
-   Usa fragments `<>...</>` quando não precisas de uma `<div>` extra.

### Checkpoint

-   Porque é que o `return` precisa de um elemento pai?
-   Quando é que usas `{}` dentro do JSX?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Regras importantes do JSX

### Modelo mental

JSX parece HTML, mas tem regras próprias para evitar conflitos com JavaScript. Algumas palavras são diferentes, e os atributos seguem o estilo do JS (camelCase).

### Sintaxe base (mais completa)

-   **Nomes diferentes:** `className` em vez de `class`, `htmlFor` em vez de `for`.
-   **Eventos em `camelCase`:** `onClick`, `onChange`, `onMouseEnter`.
-   **Atributos JS com `{}`:** valores dinâmicos usam chavetas, por exemplo `src={fotoUrl}`.
-   **`style` é um objeto:** `style={{ backgroundColor: "tomato" }}` (chaves a dobrar).
-   **Booleans:** `disabled` ou `disabled={true}`; `checked={estado}`.
-   **`data-*` e `aria-*`:** escrevem-se igual ao HTML, por exemplo `data-id="42"`.
-   **Componentes começam por maiúscula:** `<Card />` é componente; `<card>` é visto como HTML.

### HTML vs JSX (atributos comuns)

| HTML                 | JSX                        | Nota                                 |
| -------------------- | -------------------------- | ------------------------------------ |
| `class="menu"`       | `className="menu"`         | `class` é palavra reservada em JS    |
| `for="email"`        | `htmlFor="email"`          | `for` também é palavra reservada     |
| `onclick="..."`      | `onClick={...}`            | Eventos recebem funções, não strings |
| `tabindex="0"`       | `tabIndex={0}`             | `camelCase` e valor numérico         |
| `style="color: red"` | `style={{ color: "red" }}` | `style` é objeto JS                  |

### Exemplos comentados

```jsx
function Card() {
    return (
        <section className="card">
            {/* htmlFor liga a label ao input */}
            <label htmlFor="email">Email</label>
            <input id="email" type="email" />
            {/* Eventos usam camelCase */}
            <button onClick={() => alert("Clicaste no botão")}>Enviar</button>
        </section>
    );
}

export default Card;
```

```jsx
function Aviso({ ativo }) {
    return (
        <div
            // style é objeto JS; as propriedades estão em camelCase
            style={{ backgroundColor: "tomato", padding: "12px" }}
            // booleano controlado por variável
            aria-hidden={!ativo}
        >
            Atenção: verifica os teus dados.
        </div>
    );
}
```

### Erros comuns

-   **Usar `class` e ver que o estilo não funciona:** em JSX o certo é `className`.
-   **Escrever `onclick` em vez de `onClick`:** os eventos seguem camelCase.
-   **Escrever `style="..."` como no HTML:** em JSX tens de usar um objeto JS.
-   **Usar nome de componente em minúsculas:** o React interpreta como HTML e não como componente.

### Boas práticas

-   Guarda numa lista as principais diferenças de JSX.
-   Quando der erro, confirma se a tag está bem fechada e se o atributo está correto.

### Checkpoint

-   Qual é a diferença entre `class` e `className`?
-   Porque é que `style` em JSX é um objeto?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Componentes funcionais e exportação

### Modelo mental

Componentes funcionais são **funções que devolvem JSX**. Pensa neles como **peças de LEGO**: cada peça faz uma parte da interface e depois juntas tudo no `App`.

### Mini-seção: render = chamar a função

-   **Componente é função:** `function Card() { return <div />; }`
-   **Render é chamar a função:** o React chama o componente para obter o JSX.
-   **Re-render é chamar de novo:** quando o estado/props mudam, o React volta a chamar a função e recalcula o JSX.

Para usares um componente noutro ficheiro, tens de o **exportar** no ficheiro onde foi criado e **importar** onde o queres usar.

### Sintaxe base (passo a passo)

-   **Nome em PascalCase:** `Titulo`, `CardProduto`, `Header`. O React só trata nomes com maiúscula como componentes.
-   **Função que devolve JSX:** sem `return`, não aparece nada no ecrã.
-   **Um componente por ficheiro (recomendado):** facilita a organização.
-   **Exportação:** usa `export default` para o componente principal do ficheiro.
-   **Importação:** usa `import Nome from "./caminho"` no ficheiro que o vai usar.
-   **Uso:** escreve o componente como uma tag `<Titulo />`.

> **Nota rápida:** se o nome começar por minúscula, o React pensa que é uma tag HTML.

### Exemplo

```jsx
// src/components/Title.jsx
function Title() {
    // Um componente é uma função que devolve JSX
    return <h1>Página inicial</h1>;
}

// export default torna este componente o "principal" do ficheiro
export default Title;
```

```jsx
// src/App.jsx
import Title from "./components/Title.jsx";

function App() {
    return (
        <main>
            {/* Usamos o componente como se fosse uma tag HTML */}
            <Title />
        </main>
    );
}

export default App;
```

### Erros comuns

-   **Escrever o componente em minúsculas:** o React acha que é HTML e não chama a função.
-   **Esquecer o `export default`:** o `import` falha ou fica `undefined`.
-   **Não fazer `return`:** o componente não mostra nada.
-   **Caminho errado no `import`:** erro de ficheiro não encontrado.

### Boas práticas

-   Um componente por ficheiro (regra simples e segura).
-   Usa nomes que expliquem a função do componente.
-   Mantém o componente pequeno; quando cresce muito, divide-o.

### Checkpoint

-   Porque é que os componentes têm de começar por maiúscula?
-   O que faz o `export default`?

<a id="sec-4"></a>

## 4. [EXTRA] Componentes pequenos e composição visual

### Modelo mental

Criar componentes pequenos facilita a leitura e reutilização. Em vez de uma página enorme, partes em blocos e montas a página como um puzzle.

### Sintaxe base (passo a passo)

-   **Divide a página em áreas:** cabeçalho, conteúdo, rodapé, barra lateral.
-   **Cria um componente por área:** `Header`, `Main`, `Footer`.
-   **Junta tudo no `App`:** o `App` é o componente que organiza a página.
-   **Evita repetição:** se uma parte aparece várias vezes, transforma em componente.
-   **Personalização:** quando precisares de mudar conteúdo, vais usar props (ver ficheiro 03).

### Exemplo

```jsx
// src/components/Header.jsx
function Header() {
    // Componente simples para o topo da página
    return (
        <header>
            <h1>Minha App</h1>
        </header>
    );
}

export default Header;
```

```jsx
// src/components/Footer.jsx
function Footer() {
    // Componente simples para o rodapé
    return (
        <footer>
            <small>© 2026 Escola X</small>
        </footer>
    );
}

export default Footer;
```

```jsx
// src/App.jsx
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

function App() {
    return (
        <div>
            {/* A página é composta por vários componentes pequenos */}
            <Header />
            <main>
                <p>Conteúdo principal</p>
            </main>
            <Footer />
        </div>
    );
}

export default App;
```

### Erros comuns

-   Criar componentes gigantes e difíceis de ler.
-   Criar componentes demasiado pequenos sem necessidade (ex.: um componente só para um `<span>`).
-   Repetir o mesmo bloco em vários sítios em vez de o transformar num componente.
-   Criar componentes com nomes confusos (`Coisa`, `Teste1`, `Div`).

### Boas práticas

-   Se um componente ultrapassar muitas linhas, divide.
-   Mantém cada componente focado numa única responsabilidade.
-   Usa uma pasta `components` para manter tudo organizado.

### Checkpoint

-   Que partes de uma página costumam virar componentes?
-   Qual é o benefício principal da composição?

<a id="exercicios"></a>

## Exercícios - JSX e componentes

1. Cria um ficheiro novo, chamado `Saudacao.jsx`. Dentro, cria um componente chamado Saudacao, que devolve um `<h1>` com a mensagem “Olá, Mundo!”.
2. Importa o componente `Saudacao` no `App` e coloca a tag `<Saudacao />` dentro do `return` do `App`. Abre a página e confirma que aparece.
3. Cria um ficheiro e componente `Cartao` que devolve um `<div>` com um título `<h2>` e um parágrafo `<p>`. Importa e usa no `App`.
4. No componente `Cartao`, adiciona uma imagem e um comentário em JSX. Garante que a imagem é uma tag auto-fechada e que o `return` continua com um único elemento pai.
5. Escreve um `return` com dois elementos “soltos” (ex.: `<h1>` e `<p>`). Corrige a seguir colocando um elemento pai à volta.
   Por exemplo:

```jsx
return (
    <h1>Olá</h1>
    <p>Bem-vindo</p>
);
```

Corrige para:

```jsx
return (
    <div>
        <h1>Olá</h1>
        <p>Bem-vindo</p>
    </div>
);
```

6. Escolhe um componente e adiciona uma classe CSS. Troca `class` por `className` e confirma no HTML final.
7. Cria um botão com `onClick`. Quando clicares, mostra um `alert` com o teu nome.
   Por exemplo:

```jsx
<button onClick={() => alert("O meu nome é Ana")}>Clica aqui</button>
```

8. Divide a página em `Header`, `Main` e `Footer` e monta tudo no `App`. Cria um ficheiro para cada componente e importa-os no `App`.
   Por exemplo:

```jsx
// Header.jsx
function Header() {
    return (
        <header>
            <h1>Bem-vindo à minha página</h1>
        </header>
    );
}
export default Header;
```

```jsx
// App.jsx
import Header from "./Header.jsx";
function App() {
    return (
        <div>
            <Header />
        </div>
    );
}
export default App;
```

9. Adiciona um comentário em JSX a explicar o que faz um bloco específico.
10. Cria um componente `ListaLinks` com 3 links simples e um título antes da lista.

<a id="changelog"></a>

## Changelog

-   2026-01-11: criação do ficheiro.
-   2026-01-12: detalhe extra nas secções 3 e 4 e exemplos adicionais.
-   2026-01-12: exercícios iniciais reescritos em formato passo a passo.
-   2026-01-12: mini-seção sobre render e re-render em componentes funcionais.
