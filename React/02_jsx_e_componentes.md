# React.js (12.º Ano) - 02 · JSX e componentes

> **Objetivo deste ficheiro**
>
> - Perceber o que é **JSX** e porque é diferente de HTML.
> - Aprender as regras essenciais do JSX (expressões, atributos, eventos, fragmentos).
> - Criar **componentes funcionais** e organizá-los por ficheiros.
> - Montar uma página com **composição** (vários componentes pequenos a trabalhar juntos).

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] O que é JSX](#sec-1)
- [2. [ESSENCIAL] Regras importantes do JSX](#sec-2)
- [3. [ESSENCIAL] Componentes funcionais e exportação](#sec-3)
- [4. [EXTRA] Componentes pequenos e composição visual](#sec-4)
- [Exercícios - JSX e componentes](#exercicios)
- [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **ESSENCIAL vs EXTRA:** começa pelas secções [ESSENCIAL]. O [EXTRA] ajuda-te a organizar melhor e a evitar erros comuns quando o projeto cresce.
- **Como estudar:**
    1. Copia um exemplo para o `App.jsx`.
    2. Guarda e vê o resultado no browser.
    3. Muda um detalhe (texto, variável, classe, condição) e confirma o que mudou.
    4. Se der erro, lê a mensagem do terminal e do browser (consola).
- **Ligações:**
    - Se ainda não tens projeto criado, volta ao `01_fundamentos_e_setup.md`.
    - Se já estás confortável com JSX e queres passar dados entre componentes, segue depois para `03_props_e_composicao.md`.

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] O que é JSX

### 1.1 A ideia central

JSX é uma forma de escrever **estrutura de interface** (parecida com HTML) **dentro do JavaScript**.

Importante:

- **JSX não é HTML.**
- O browser não “entende JSX” diretamente.
- Quem trata disso é o **Vite** (a ferramenta do projeto), que converte o JSX em JavaScript antes da página correr.

Pensa nisto assim:

- Tu escreves JSX porque é mais simples e legível.
- O projeto converte isso para JavaScript que o React consegue usar para criar os elementos.

---

### 1.2 O que é que o React faz com JSX (sem complicar)

Tu escreves:

```jsx
<h1>Olá</h1>
```

O React acaba por criar um “elemento React” (um objeto que representa o que deve aparecer no ecrã). Não precisas de decorar o formato interno. O que interessa é:

> JSX é uma forma prática de escrever “o desenho” da interface.

---

### 1.3 JSX é uma expressão (isto é mesmo importante)

Em JavaScript, uma **expressão** é algo que produz um valor.

Exemplos de expressões:

- `2 + 3` (produz `5`)
- `nome` (produz o valor da variável)
- `condicao ? "A" : "B"` (produz um texto dependendo da condição)

JSX também é uma expressão. Isso permite coisas como:

- guardar JSX numa variável,
- devolver JSX no `return`,
- inserir JSX dentro de outro JSX.

---

### 1.4 Regras base de JSX (as que aparecem logo no início)

- **Um único elemento “por fora” (elemento raiz)**: o `return` tem de devolver **uma** tag que envolva tudo.
- **Fragmentos** `<>...</>`: servem para envolver sem criar uma `<div>` extra.
- **Chavetas `{}`**: servem para colocar **expressões JavaScript** dentro do JSX.
- **Tags sem conteúdo** fecham com `/>`: `<img />`, `<input />`, `<br />`.
- **Comentários** no JSX: `{/* comentário */}`.

---

### 1.5 Experiência rápida: texto normal vs `{}`

```jsx
/**
 * Demonstra a diferença entre texto normal e inserção de JavaScript com {}.
 */
function App() {
    const nome = "Rita";
    const idade = 17;

    return (
        <main>
            <h1>Olá, {nome}</h1>
            <p>Idade: {idade}</p>
            <p>Daqui a 1 ano: {idade + 1}</p>
            <p>{"Isto também é texto, mas veio de uma expressão"}</p>
        </main>
    );
}

export default App;
```

O que deves reter:

- `Olá, Rita` aparece porque `{nome}` é uma expressão.
- `{idade + 1}` mostra o resultado da conta.
- As chavetas não servem para “meter texto à toa”. Servem para JavaScript.

---

### 1.6 Erros comuns nesta fase

- **Devolver dois elementos soltos** (sem elemento raiz).
- **Esquecer `/>`** em `<img>` e `<input>`.
- **Tentar usar `if` dentro do JSX** (o `if` é instrução, não é expressão).

Exemplo de erro e correção:

```jsx
// ERRADO: dois elementos soltos
return (
    <h1>Olá</h1>
    <p>Bem-vindo</p>
);
```

```jsx
// CERTO: um elemento a envolver tudo
return (
    <div>
        <h1>Olá</h1>
        <p>Bem-vindo</p>
    </div>
);
```

Ou com fragmento:

```jsx
return (
    <>
        <h1>Olá</h1>
        <p>Bem-vindo</p>
    </>
);
```

---

### 1.7 Boas práticas

- Mantém o JSX simples e legível.
- Se a expressão ficar grande, calcula antes do `return` e usa uma variável.
- Usa fragmentos quando não precisas mesmo de uma `<div>` extra.

### 1.8 Checkpoint

- Porque é que o `return` precisa de um elemento raiz?
- Para que servem as chavetas `{}` dentro do JSX?
- Em que casos usas `<>...</>`?

---

<a id="sec-2"></a>

## 2. [ESSENCIAL] Regras importantes do JSX

JSX parece HTML, mas tem regras próprias porque está dentro de JavaScript. Estas regras evitam conflitos e deixam o código mais consistente.

### 2.1 Atributos: o que muda do HTML para JSX

Alguns nomes mudam porque certas palavras têm significado em JavaScript:

- `class` (HTML) → `className` (JSX)
- `for` (HTML) → `htmlFor` (JSX)

Tabela rápida:

| HTML                 | JSX                        | Nota                                 |
| -------------------- | -------------------------- | ------------------------------------ |
| `class="menu"`       | `className="menu"`         | `class` tem significado em JS        |
| `for="email"`        | `htmlFor="email"`          | `for` também tem significado em JS   |
| `onclick="..."`      | `onClick={...}`            | eventos recebem funções, não strings |
| `tabindex="0"`       | `tabIndex={0}`             | camelCase e valor numérico           |
| `style="color: red"` | `style={{ color: "red" }}` | `style` é objeto                     |

---

### 2.2 Eventos: `onClick`, `onChange`, …

Em JSX, eventos:

- usam **camelCase** (`onClick`, não `onclick`),
- recebem **funções** (não texto).

Exemplo:

```jsx
/**
 * Demonstra um evento simples.
 */
function App() {
    function dizerOla() {
        alert("Olá!");
    }

    return (
        <main>
            <button onClick={dizerOla}>Clica aqui</button>
        </main>
    );
}

export default App;
```

Repara:

- `onClick={dizerOla}` passa a função (não a executa logo).
- Se escreveres `onClick={dizerOla()}`, a função é executada imediatamente (e isso quase nunca é o que queres).

---

### 2.3 `style` em JSX: é um objeto

No HTML podes escrever `style="color: red"`.
No JSX, `style` recebe um **objeto**:

```jsx
/**
 * Demonstra style com objeto.
 */
function Caixa() {
    const estilos = {
        backgroundColor: "tomato",
        padding: 12, // números em CSS normalmente significam px
        borderRadius: 8,
    };

    return <div style={estilos}>Caixa com estilo</div>;
}

export default Caixa;
```

Regras práticas:

- propriedades em **camelCase** (`backgroundColor`, não `background-color`)
- valores podem ser texto (`"tomato"`) ou números (`12` → normalmente `12px`)

---

### 2.4 Inserir condições no JSX (sem usar `if` dentro do return)

No JSX podes usar **expressões**. As duas mais comuns são:

#### A) Operador ternário

```jsx
/**
 * Mostra uma mensagem dependendo da condição.
 */
function App() {
    const estaLogado = false;

    return (
        <main>
            <p>{estaLogado ? "Bem-vindo!" : "Faz login para continuar."}</p>
        </main>
    );
}

export default App;
```

#### B) `&&` (mostra só se a condição for verdadeira)

```jsx
/**
 * Mostra aviso apenas quando ativo é true.
 */
function Aviso({ ativo }) {
    return <>{ativo && <p>Atenção: verifica os teus dados.</p>}</>;
}

export default Aviso;
```

Regra prática:

- usa `ternário` quando tens **duas opções**
- usa `&&` quando queres **mostrar ou não mostrar**

---

### 2.5 `data-*` e `aria-*` continuam iguais

Exemplos:

- `data-id="42"`
- `aria-label="Fechar"`

Isto é útil para acessibilidade e para testes.

---

### 2.6 Componentes começam por maiúscula (mesmo a sério)

- `<Header />` → React entende como **componente**
- `<header>` → browser entende como **tag HTML**

Se fizeres `<meuComponente />` (minúsculas), o React vai pensar que é uma tag HTML que não existe.

---

### 2.7 Erros comuns (e como os reconhecer)

- `class` em vez de `className` → estilos não aplicam como esperas.
- `onclick` em vez de `onClick` → o evento não dispara.
- `style="..."` como no HTML → dá erro ou não funciona.
- tag mal fechada → erro no terminal a dizer que o JSX está inválido.

### 2.8 Checkpoint

- Porque é que `className` existe?
- Porque é que `onClick` recebe uma função e não uma string?
- O que significa `style={{ ... }}` (chaves a dobrar)?

---

<a id="sec-3"></a>

## 3. [ESSENCIAL] Componentes funcionais e exportação

### 3.1 O que é um componente funcional

Um componente funcional é uma **função** que devolve JSX.

Pensa em componentes como blocos:

- um bloco para o cabeçalho,
- um bloco para um cartão,
- um bloco para o rodapé.

Depois juntas tudo no `App`.

---

### 3.2 Regras de nomes (para o React reconhecer)

- nomes de componentes em **PascalCase**: `Header`, `CartaoProduto`, `ListaLinks`
- ficheiros costumam usar o mesmo nome: `Header.jsx`, `CartaoProduto.jsx`

---

### 3.3 Exportar e importar (para usar componentes noutros ficheiros)

O padrão mais comum (e mais simples) é **export default**:

#### Exemplo (componente num ficheiro)

```jsx
// src/components/Title.jsx

/**
 * Mostra o título da página.
 */
function Title() {
    return <h1>Página inicial</h1>;
}

export default Title;
```

#### Usar no App

```jsx
// src/App.jsx
import Title from "./components/Title.jsx";

/**
 * Componente principal da app.
 */
function App() {
    return (
        <main>
            <Title />
        </main>
    );
}

export default App;
```

---

### 3.4 O que significa “render” aqui

- o React **chama** o componente para obter JSX.
- quando algo muda (mais tarde: estado/props), o React volta a chamar a função.

Não é “executar uma vez e acabou”. É normal o componente correr várias vezes.

---

### 3.5 Exportações alternativas (para quando precisares)

Às vezes queres exportar mais do que uma coisa do mesmo ficheiro. Aí usas **named exports**:

```jsx
// src/components/Texto.jsx

export function Titulo() {
    return <h2>Título</h2>;
}

export function Paragrafo() {
    return <p>Texto</p>;
}
```

E importas assim:

```jsx
import { Titulo, Paragrafo } from "./components/Texto.jsx";
```

Para já, o mais comum no início é **um componente por ficheiro com export default**.

---

### 3.6 Erros comuns

- componente com nome minúsculo → o React trata como HTML.
- esquecer `export default` → o import falha.
- caminho errado no import → erro a dizer que não encontrou o ficheiro.
- esquecer `return` → não aparece nada no ecrã.

### 3.7 Boas práticas

- Um componente por ficheiro (regra simples e segura).
- Nomes claros (evita `Teste`, `Coisa`, `Div`).
- Se um componente crescer muito, divide em dois.

### 3.8 Checkpoint

- Porque é que os componentes começam por maiúscula?
- Qual é a diferença entre `export default` e `export` (named)?

---

<a id="sec-4"></a>

## 4. [EXTRA] Componentes pequenos e composição visual

### 4.1 O que é “compor” uma página

Compor uma página é montar a interface com componentes pequenos, em vez de ter um ficheiro gigante.

Regra prática:

- se uma parte se repete ou faz sentido como “bloco”, vira componente.

Exemplos de blocos comuns:

- `Header`, `Footer`
- `Cartao`, `Botao`, `Avatar`
- `Sidebar`, `Menu`, `ListaLinks`

---

### 4.2 Mini-projeto guiado: “Página de perfil” (só UI)

Objetivo: criar 4 componentes e juntá-los no `App`:

- `Header`
- `Avatar`
- `CartaoPerfil`
- `Footer`

#### A) `Header.jsx`

```jsx
// src/components/Header.jsx

/**
 * Cabeçalho simples.
 */
function Header() {
    return (
        <header>
            <h1>Perfil</h1>
        </header>
    );
}

export default Header;
```

#### B) `Avatar.jsx`

```jsx
// src/components/Avatar.jsx

/**
 * Mostra uma imagem de perfil.
 * Nota: por agora o URL é fixo. Mais tarde vais passar por props.
 */
function Avatar() {
    return (
        <img
            src="https://i.pravatar.cc/120"
            alt="Foto de perfil"
            width="120"
            height="120"
            style={{ borderRadius: 999 }}
        />
    );
}

export default Avatar;
```

#### C) `CartaoPerfil.jsx`

```jsx
// src/components/CartaoPerfil.jsx
import Avatar from "./Avatar.jsx";

/**
 * Cartão com informação de perfil.
 */
function CartaoPerfil() {
    const nome = "Rita";
    const curso = "Informática e Gestão";

    return (
        <section className="card">
            <Avatar />
            <h2>{nome}</h2>
            <p>{curso}</p>
        </section>
    );
}

export default CartaoPerfil;
```

#### D) `Footer.jsx`

```jsx
// src/components/Footer.jsx

/**
 * Rodapé simples.
 */
function Footer() {
    return (
        <footer>
            <small>© 2026 - React (12.º ano)</small>
        </footer>
    );
}

export default Footer;
```

#### E) Montar tudo no `App.jsx`

```jsx
// src/App.jsx
import Header from "./components/Header.jsx";
import CartaoPerfil from "./components/CartaoPerfil.jsx";
import Footer from "./components/Footer.jsx";

/**
 * Página composta por componentes pequenos.
 */
function App() {
    return (
        <div>
            <Header />
            <main>
                <CartaoPerfil />
            </main>
            <Footer />
        </div>
    );
}

export default App;
```

---

### 4.3 Erros comuns nesta fase

- Fazer um componente gigante com tudo lá dentro (fica difícil de ler e de corrigir).
- Criar componentes demasiado pequenos sem necessidade (ex.: um componente só para um `<span>`).
- Repetir blocos iguais em vários sítios em vez de criar um componente reutilizável.

### 4.4 Boas práticas

- Pastas e nomes consistentes: `src/components/...`
- Cada componente com uma responsabilidade clara.
- Se uma parte precisa de “variar”, normalmente é sinal de que vais precisar de **props** (ficheiro 03).

### 4.5 Checkpoint

- Qual é a vantagem de ter componentes pequenos?
- Quando é que faz sentido criar um componente novo?

---

<a id="exercicios"></a>

## Exercícios - JSX e componentes

> Faz os exercícios dentro do teu projeto Vite + React. Se um exercício der erro, lê a mensagem e tenta descobrir a causa (tag mal fechada, import errado, etc.).

1. **Chavetas `{}`**
    - Cria `const nome = "Ana"` no `App` e mostra “Olá, Ana” no `<h1>`.

2. **Elemento raiz**
    - Escreve um `return` com `<h1>` e `<p>` soltos (para dar erro).
    - Corrige com `<div>` ou `<>...</>`.

3. **Tag auto-fechada**
    - Adiciona uma imagem com `<img ... />` (garante o `/>`).

4. **className**
    - Cria uma `<div className="card">...</div>`.
    - Confirma no inspector do browser que aparece `class="card"` no HTML final.

5. **Evento**
    - Cria um botão com `onClick` que faz `alert("Clicaste!")`.

6. **style como objeto**
    - Cria um `<p>` com `style={{ color: "tomato", fontWeight: 700 }}`.

7. **Condição com ternário**
    - Cria `const estaLogado = true/false` e mostra uma mensagem diferente dependendo do valor.

8. **Criar e usar um componente**
    - Cria `src/components/Saudacao.jsx` com `<h2>Olá!</h2>` e usa no `App`.

9. **Header / Main / Footer**
    - Divide a página em `Header.jsx`, `Main.jsx` e `Footer.jsx`.
    - Importa e monta tudo no `App`.

10. **Diagnóstico (import/export)**

- Remove `export default` de um componente de propósito e lê o erro.
- Corrige e confirma que volta a funcionar.

11. **Mini-projeto**

- Faz a “Página de perfil” da secção 4 e altera:
    - nome,
    - curso,
    - texto do footer.

<a id="changelog"></a>

## Changelog

- 2026-01-11: criação do ficheiro.
- 2026-01-12: detalhe extra nas secções 3 e 4 e exemplos adicionais.
- 2026-01-12: exercícios iniciais reescritos em formato passo a passo.
- 2026-01-12: mini-seção sobre render e re-render em componentes funcionais.
- 2026-01-26: expansão didática (JSX como expressão, condições, style como objeto com regras práticas, export default vs named export, mini-projeto guiado e exercícios com diagnóstico).
