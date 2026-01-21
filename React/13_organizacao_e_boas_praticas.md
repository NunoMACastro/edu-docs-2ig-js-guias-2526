# React.js (11.º Ano) - 13 · Organização e boas práticas

> **Objetivo deste ficheiro**
> Aprender a organizar pastas e ficheiros de um projeto React.
> Criar nomes consistentes e componentes mais fáceis de manter.
> Ganhar hábitos de leitura de erros e debug básico.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Estrutura de pastas](#sec-1)
-   [2. [ESSENCIAL] Nomeação consistente](#sec-2)
-   [3. [ESSENCIAL] Boas práticas de componentes](#sec-3)
-   [4. [EXTRA] Debug e leitura de erros](#sec-4)
-   [Checklist - Organização e boas práticas](#checklist)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** organiza o projeto antes de pensar em debug avançado.
-   **Como estudar:** aplica as regras a um projeto existente.
-   **Ligações:** usa exemplos anteriores, principalmente `05_listas_e_condicionais.md`.

<a id="sec-1"></a>

## 1. [ESSENCIAL] Estrutura de pastas

### Modelo mental

Uma boa estrutura ajuda-te a encontrar rapidamente ficheiros e a manter o projeto limpo. Para projetos pequenos, poucas pastas chegam.

Pensa na estrutura como um armário com gavetas:

-   Se tudo está na mesma gaveta, perdes tempo à procura.
-   Se cada tipo de coisa tem o seu lugar, encontras mais rápido.

### Sintaxe base (passo a passo)

-   **`src/components`:** componentes reutilizáveis.
-   **`src/pages`:** páginas completas (Home, Sobre, Contactos).
-   **`src/assets`:** imagens, ícones e ficheiros estáticos.
-   **`src/styles`:** estilos globais (se usares CSS separado).
-   **`src/services`:** pedidos à API (opcional, mas útil).

### Exemplo

```text
# Estrutura simples para um projeto pequeno
src/
# Componentes reutilizáveis
|-- components/
# Páginas completas
|-- pages/
# Imagens e outros ficheiros estáticos
`-- assets/
```

```text
# Estrutura um pouco maior (ainda simples)
src/
|-- components/
|-- pages/
|-- services/
|-- styles/
`-- assets/
```

### Erros comuns

-   Misturar tudo na raiz de `src`.
-   Criar pastas vazias sem necessidade.
-   Criar pastas diferentes para a mesma coisa (ex.: `componentes` e `components`).

### Boas práticas

-   Começa simples e só cria novas pastas quando fizer sentido.
-   Mantém nomes curtos e claros.
-   Se um tipo de ficheiro cresce, cria uma pasta específica.

### Checkpoint

-   Porque é que uma estrutura simples ajuda em projetos pequenos?
-   O que pode correr mal se tiveres pastas duplicadas?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Nomeação consistente

### Modelo mental

Nomes consistentes evitam confusão e erros. Se um componente se chama `ListaProdutos`, o ficheiro deve refletir isso.

Quando os nomes são previsíveis:

-   Os imports são mais fáceis.
-   Os erros são mais rápidos de corrigir.
-   O projeto é mais legível para toda a gente.

### Sintaxe base (passo a passo)

-   **Componentes em PascalCase:** `ListaProdutos`.
-   **Ficheiros com o mesmo nome do componente:** `ListaProdutos.jsx`.
-   **Pastas em minúsculas:** `components`, `pages`, `services`.
-   **Funções utilitárias em camelCase:** `formatarData`.

### Exemplo

```jsx
// src/components/ListaProdutos.jsx
function ListaProdutos() {
    // O nome do ficheiro e do componente são iguais
    return <p>Lista de produtos</p>;
}

export default ListaProdutos;
```

### Erros comuns

-   Misturar `listaProdutos` com `ListaProdutos`.
-   Ter um ficheiro com nome diferente do componente.
-   Usar acentos em nomes de ficheiros (pode criar problemas).

### Boas práticas

-   Segue um padrão e não o quebres.
-   Se mudares o nome, atualiza todos os imports.
-   Evita abreviações pouco claras.

### Checkpoint

-   Porque é que o ficheiro deve ter o mesmo nome do componente?
-   O que acontece se mudares o nome e não atualizares os imports?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Boas práticas de componentes

### Modelo mental

Um componente deve ter uma responsabilidade principal. Se faz demasiadas coisas, fica difícil de testar e reutilizar.

Uma regra simples: se o componente ficou grande e estás a fazer scroll para o entender, provavelmente está a fazer demasiado.

### Sintaxe base (passo a passo)

-   **Divide componentes grandes em blocos menores.**
-   **Mantém o estado perto de onde é usado.**
-   **Passa props de forma explícita.**
-   **Evita efeitos e estado que não são usados.**

### Exemplo

```jsx
// src/components/PerfilResumo.jsx
function PerfilResumo({ nome, curso }) {
    // Componente pequeno, apenas mostra informação
    return (
        <div>
            <h2>{nome}</h2>
            <p>{curso}</p>
        </div>
    );
}

export default PerfilResumo;
```

### Erros comuns

-   Misturar lógica e UI num único componente gigante.
-   Criar estados duplicados em componentes diferentes.
-   Usar um componente para "tudo" em vez de separar.

### Boas práticas

-   Move a lógica para cima quando vários componentes precisam dela.
-   Usa props para comunicar entre componentes.
-   Se um componente for usado várias vezes, torna-o reutilizável.

### Checkpoint

-   Quando é que um componente está "grande demais"?
-   O que significa "responsabilidade única" num componente?

<a id="sec-4"></a>

## 4. [EXTRA] Debug e leitura de erros

### Modelo mental

Erros são normais. O importante é ler a mensagem e seguir as pistas: ficheiro, linha e descrição.

Um erro típico tem três partes:

-   **Onde está:** ficheiro e linha.
-   **O que está errado:** a mensagem de erro.
-   **Contexto:** o que estavas a fazer quando aconteceu.

### Sintaxe base (passo a passo)

-   **O terminal mostra erros de compilação.**
-   **O browser mostra erros de execução.**
-   **Começa pela linha indicada.**
-   **Lê de cima para baixo.**

### ESLint/Prettier (curto)

-   **ESLint:** avisa sobre erros e más práticas.
-   **Prettier:** formata o código de forma consistente.
-   Em projetos com Vite, podes adicionar depois, quando o básico estiver sólido.

### Exemplo

```text
# Exemplo de mensagem do terminal (linha e ficheiro ajudam a localizar)
[plugin:vite:react-swc] /src/App.jsx:12:5: Expected "," but found "}"
```

### Erros comuns

-   Ignorar a linha indicada e procurar no sítio errado.
-   Mudar vários ficheiros ao mesmo tempo e não saber o que causou o erro.
-   Copiar e colar mensagens sem as ler.

### 5 erros comuns que vais ver muitas vezes

1. **Import em falta:** "is not defined" ou "Failed to resolve import".
2. **JSX mal fechado:** tag sem `</...>` ou sem `/>`.
3. **Hook fora do sítio:** `useState`/`useEffect` fora do componente.
4. **`map` sem `key`:** aviso no console.
5. **`class` em vez de `className`:** estilos não aplicam.

### Boas práticas

-   Corrige um erro de cada vez.
-   Se não perceberes, comenta o bloco e confirma o problema.
-   Usa `console.log` para confirmar valores quando estiveres perdido.

### Checkpoint

-   O que deves ler primeiro numa mensagem de erro?
-   Porque é que corrigir um erro de cada vez ajuda?

<a id="checklist"></a>

## Checklist - Organização e boas práticas

-   Estrutura de pastas simples e consistente em `src/`.
-   Componentes com nomes em PascalCase e ficheiros com o mesmo nome.
-   Páginas separadas em `pages` e componentes reutilizáveis em `components`.
-   Componentes pequenos com responsabilidades claras.
-   Estado no nível certo (nem demasiado alto nem demasiado baixo).
-   Imports limpos e sem caminhos confusos.
-   Erros lidos com atenção (ficheiro, linha, mensagem).
-   Debug feito com passos pequenos e controlados.
-   Linting e formatação (ESLint/Prettier) quando fizer sentido.

<a id="changelog"></a>

## Changelog

-   2026-01-11: renumeração do ficheiro.
-   2026-01-11: criação do ficheiro.
-   2026-01-12: explicações detalhadas e exercícios iniciais em formato guia.
-   2026-01-12: checkpoints por secção e checklist de validação.
-   2026-01-12: notas sobre ESLint/Prettier e lista de erros comuns.
