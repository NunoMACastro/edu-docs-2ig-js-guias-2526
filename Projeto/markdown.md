# [19] Markdown — Guia Prático (11.º ano)

> **Objetivo:** aprender a escrever documentos claros e bem formatados usando **Markdown** (MD).  
> Vamos cobrir **o essencial**, **boas práticas**, **modelos prontos** e **exercícios**. O foco é poderes escrever README.md, relatórios de exercícios e apontamentos de aula.

---

## 0) O que é Markdown? E para que serve?

-   **Markdown** é uma forma **simples** de escrever texto formatado usando **símbolos** (`# * - [] ()` …).
-   Foi criado para poderes escrever rapidamente e converter para **HTML** (web), **PDF**, **slides**, etc.
-   É usado em **GitHub**, **GitLab**, **VS Code**, **Obsidian**, sistemas de documentação e fóruns.

> Pensa no Markdown como “**texto com sinais**” que indicam títulos, listas, código, imagens…

---

## 1) Como escrever e ver Markdown

-   **VS Code**: cria um ficheiro `*.md`. Atalhos úteis:
    -   Abrir _preview_: `Ctrl+Shift+V` (Windows/Linux) ou `Cmd+Shift+V` (macOS)
    -   _Split preview_: `Ctrl+K V` (Windows/Linux) ou `Cmd+K V` (macOS)
-   **GitHub**: ao abrir um `README.md`, o site mostra logo o ficheiro **renderizado**.
-   **Outros**: Obsidian, Typora, Dillinger, extensões do navegador.

> Nota: há pequenas diferenças de sabores de Markdown. O **GitHub Flavored Markdown (GFM)** adiciona tabelas, listas de tarefas, ~~risco~~, autolinks e _footnotes_.

---

## 2) Sintaxe Essencial

### 2.1 Parágrafos e quebras de linha

-   Um **parágrafo** é uma ou mais linhas sem linhas vazias entre si.
-   Para **quebra de linha** dentro do parágrafo, termina a linha com **dois espaços** ou usa uma linha vazia.

**Exemplo (escrever):**

```md
Este é o primeiro parágrafo.

Este é o segundo.
```

### 2.2 Títulos (headings)

Usa `#` antes do texto. Um `#` é título de nível 1; `##` é nível 2; até `######`.

```md
# Título 1

## Título 2

### Título 3
```

### 2.3 Ênfase (itálico, negrito, risco)

```md
_itálico_ ou _itálico_
**negrito** ou **negrito**
~~texto riscado~~
```

### 2.4 Listas (não ordenadas e ordenadas)

```md
-   Item A
-   Item B
    -   Subitem B1
    -   Subitem B2

1. Passo um
2. Passo dois
    1. Subpasso
```

> Dica: usa **dois espaços** antes de subitens para criar níveis.

### 2.5 Citações (blockquote)

```md
> Esta é uma citação. Útil para notas, destaques e referências.
```

### 2.6 Links

```md
[Texto do link](https://exemplo.com)
[Ir para a secção Tabelas](#tabelas)
```

### 2.7 Imagens

```md
![Texto alternativo descrevendo a imagem](https://site.com/imagem.jpg "Título opcional")
```

### 2.8 Código (inline e blocos)

-   **Inline**: usa crases \`código\` dentro da frase.
-   **Blocos**: usa três crases e, opcionalmente, indica a linguagem para _highlight_.

````md
Código inline: `console.log("Olá")`

```js
function soma(a, b) {
    return a + b;
}
```

> Atenção: no exemplo acima há **duas** sequências de três crases. Ao copiares, mantém exatamente as crases de abertura/fecho.

### 2.9 Tabelas (GFM)

```md
| Nome  | Nota | Observações      |
| ----- | ---: | ---------------- |
| Ana   |   18 | Excelente        |
| Bruno |    9 | Precisa de apoio |
```
````

-   `:` alinha a coluna (`:---` esquerda, `:---: ` centro, `---:` direita).
-   Cabeçalhos e separadores são obrigatórios na primeira e segunda linhas.

### 2.10 Linha horizontal (separador)

```md
---
```

ou `***`

---

## 3) Recursos Extras do GFM (GitHub Flavored Markdown)

### 3.1 Listas de tarefas (checkboxes)

```md
-   [x] Ler enunciado
-   [ ] Escrever pseudocódigo
-   [ ] Implementar e testar
```

### 3.2 Autolinks e menções

-   URLs coladas no texto são frequentemente reconhecidas automaticamente.
-   Em GitHub, `#123` pode referir _issues_, `@utilizador` menciona alguém (em repositórios).

### 3.3 Footnotes (notas de rodapé)

```md
Texto com nota[^1].

[^1]: Esta é a nota de rodapé com mais detalhes.
```

### 3.4 Escapar caracteres especiais

Se precisares de mostrar um asterisco sem fazer itálico, usa `\*`.  
Caracteres comuns para escapar: `\* \_ \# \| \` \[ \] \( \)`

### 3.5 HTML inline (usar com cuidado)

Podes usar HTML simples quando o Markdown não chega, **mas** nem todas as plataformas permitem tudo.

```md
<span style="color: #333;">Texto com estilo inline</span>
```

---

## 4) Boas práticas (para documentos limpos)

-   **Um título H1 por ficheiro** (`# Título`), depois estrutura hierárquica (`##`, `###`…).
-   **Linhas curtas** (~80–100 caracteres) para facilitar _diffs_ no Git.
-   **Âncoras internas**: cria secções com títulos claros e usa links internos.
-   **Imagens com alt** descritivo (acessibilidade).
-   **Código com linguagem** nos blocos para _syntax highlighting_.
-   **Evitar HTML** quando houver sintaxe MD equivalente.
-   **Sem emojis** desnecessários em documentação técnica/formal.
-   **Consistência**: decide entre `-` ou `*` para listas e mantém.

---

## 5) Erros comuns (e como evitar)

-   **Listas “partidas”**: falta de linha vazia antes da lista ou indentação inconsistente.
    _Solução_: adiciona uma linha vazia antes, usa 2 espaços para subitens.
-   **Tabelas desalinhadas**: faltam pipes ou linhas do cabeçalho.
    _Solução_: usa sempre a linha de separadores `|---|---|` e confere os `|`.
-   **Blocos de código sem fechar**: número errado de crases.
    _Solução_: certifica-te que abres e fechas com **três** crases.
-   **Links/imagens quebrados**: caminhos errados ou sem aspas no título.
    _Solução_: testa os links na _preview_ e usa caminhos relativos corretos.
-   **Abusar de HTML**: torna o ficheiro frágil em diferentes plataformas.
    _Solução_: prefere sempre a sintaxe MD nativa.

---

## 6) Referência rápida (cheatsheet)

| Quero…          | Escreve…               | Nota                       |
| --------------- | ---------------------- | -------------------------- |
| Título nível 1  | `# Título`             | até `######`               |
| Negrito         | `**texto**`            | ou `__texto__`             |
| Itálico         | `*texto*`              | ou `_texto_`               |
| Riscado         | `~~texto~~`            | GFM                        |
| Lista           | `- item`               | subitens com 2 espaços     |
| Lista ordenada  | `1. item`              | numeração automática       |
| Citação         | `> texto`              | pode ter vários parágrafos |
| Link            | `[texto](url)`         | links internos: `#secao`   |
| Imagem          | `![alt](url "título")` | alt = acessibilidade       |
| Código inline   | `` `código` ``         | usa crases                 |
| Bloco de código | ` ```js … ``` `        | indica linguagem           |
| Tabela          | ver modelo             | GFM                        |
| Separador       | `---`                  | ou `***`                   |
| Tarefa          | `- [ ]` / `- [x]`      | GFM                        |
| Footnote        | `[^1]` + definição     | GFM                        |

---

## Changelog

-   **v1.0.0 — 2025-11-25**
    -   Versão inicial: sintaxe essencial, GFM, boas práticas, 3 modelos prontos, exercícios por níveis, checklist e cheatsheet.
