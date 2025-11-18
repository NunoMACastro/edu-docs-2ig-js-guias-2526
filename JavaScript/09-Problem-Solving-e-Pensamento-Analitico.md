# [09] Problem Solving e Pensamento Analítico (11.º ano) - guia completo e didático

> **Objetivo:** dar-te um **processo simples, repetível e confiável** para resolver problemas de programação.  
> Vais aprender a **ler problemas**, **modelar dados**, **planear em português**, **transformar o plano em código** e **testar** como alguém que sabe o que está a fazer.

---

**Índice**

-   [1) Processo em 5 passos (usa sempre este roteiro)](#processo-5-passos)
-   [2) Templates](#templates)
-   [3) Tecnicas Usuais (com mini-exemplos)](#tecnicas-usuais)
-   [4) Tipos de problemas (e soluções rápidas)](#tipos-de-problemas)
-   [5) Exemplo 1 - Contar palavras (duas soluções)](#exemplo-contar-palavras)
-   [6) Exemplo 2 - Média com validação (numérica, arredondar)](#exemplo-media)
-   [7) Exemplo 3 - Agrupar alunos por situação](#exemplo-agrupar)
-   [8) Exemplo 4 - Palíndromo simples (com normalização)](#exemplo-palindromo)
-   [9) Debugging (passo a passo)](#debugging)
-   [10) Testes rápidos (sem frameworks)](#testes-rapidos)
-   [11) Código limpo (regras simples)](#codigo-limpo)
-   [12) Estratégia de tempo (testes/provas)](#estrategia-de-tempo)
-   [13) Desafios (Resolve usando o conteúdo deste capítulo)](#desafios)
-   [Changelog](#changelog)

---

## 1) Processo em 5 passos (usa sempre este roteiro)

<a id="processo-5-passos"></a>

**Ler → Modelar → Planear → Codificar → Testar**

1. **Ler**: destacar Entradas/Saídas (E/S) e regras. Ou seja, que dados recebes (incluindo o seu tipo e a sua origem) e o que deves devolver (formato, tipo). Identificar casos especiais (vazio, `null`, duplicados, maiúsculas/minúsculas, etc.).
2. **Modelar**: escolher estruturas (array? objeto?) adequada e preparar uma **tabela E/S**. Se vou ter uma lista de valores, uso um array. Se vou ter pares chave/valor, uso um objeto. Se vou ter várias categorias, talvez um objeto com arrays dentro. etc.
3. **Planear**: escrever **pseudocódigo** (4–8 linhas) e/ou **simular à mão** com um exemplo. Isto ajuda a clarificar o raciocínio antes de começares a programar. Não é necessário ser completo, apenas para ser um mapa mental do que vais fazer.
4. **Programar**: transformar o plano em funções **pequenas**; começar pela versão simples que funciona. Se um problema for complexo, divide em subproblemas e resolve um de cada vez. Usa a **tecnicas usuais** (guard clauses, acumuladores, métodos de array, etc.) para facilitar o trabalho.
5. **Testar**: 3 testes mínimos (normal, extremo, vazio/erro) e **corrigir** o que falhar.

> Se travares em 4), volta a 3). Se 3) não flui, volta a 2).

---

## 2) Templates

<a id="templates"></a>

### 2.1 Tabela E/S

| Entrada (nome/tipo) | Exemplo | Observações |
| ------------------- | ------- | ----------- |
|                     |         |             |

| Saída (formato) | Exemplo | Observações |
| --------------- | ------- | ----------- |
|                 |         |             |

**Casos especiais:** (vazio, `null`, espaços, maiúsculas/minúsculas, números em string, duplicados…)

### 2.2 Pseudocódigo (4–8 linhas)

```text
1) …
2) …
3) …
4) …
```

### 2.3 Exemplo de simulação

Exercício de exemplo: Cria uma função que recebe um array de números e devolve a soma dos números pares. Depois, pede 10 números ao utilizador, usa a função e mostra o resultado.

| Entrada (nome/tipo)       | Exemplo         | Observações                |
| ------------------------- | --------------- | -------------------------- |
| números (array de number) | [1, 2, 3, 4, 5] | array com números inteiros |

| Saída (tipo) | Exemplo | Observações            |
| ------------ | ------- | ---------------------- |
| number       | 6       | soma dos pares (2 + 4) |

**Casos especiais:** array vazio → 0; sem pares → 0; números negativos.

**Pseudocódigo**

```text
1) Definir função somaPares(array)
2) Verificar se array está vazio → devolver 0
3) Inicializar soma a 0
4) Para cada número no array:
    Se for par, adicionar à soma
5) Devolver soma
6) Pedir 10 números ao utilizador e guardar num array
7) Chamar somaPares com o array a entrar como argumento e mostrar resultado
8) Avisar se não houver pares
```

---

## 3) Tecnicas Usuais (com mini-exemplos)

<a id="tecnicas-usuais"></a>

### 3.1 Guard clause (sair cedo)

> Uma guard clause é uma verificação no início de uma função que permite sair imediatamente se uma condição não for cumprida. Isto ajuda a evitar aninhamentos profundos e torna o código mais legível.

Por exemplo, se fizermos uma função que divide dois números, podemos usar uma guard clause para verificar se o divisor é zero e sair cedo:

```js
function dividir(a, b) {
    if (b === 0) return null; // guard clause
    return a / b;
}
```

-   Exemplos de guard clauses comuns:

    -   Verificar se um parâmetro é `null` ou `undefined`.
    -   Verificar se um array está vazio.
    -   Verificar se um número está dentro de um intervalo válido.
    -   Verificar se uma string não está vazia antes de processá-la.
    -   Verificar se uma operação é permitida (ex.: autenticação).
    -   Verificar se um número é um número.

### 3.2 Acumuladores (somar/contar)

> Um acumulador é uma variável que vai sendo atualizada ao longo de um ciclo para acumular um valor, como uma soma ou uma contagem.

```js
let soma = 0;
for (const x of [3, 5, 7]) soma += x; // soma = 15

// Isto é o mesmo que:
const nums = [3, 5, 7];
let soma2 = 0;
for (let i = 0; i < nums.length; i++) {
    soma2 += nums[i];
}
```

### 3.3 Limpeza de texto

> Muitas vezes é necessário normalizar strings para comparação ou processamento. Isto pode incluir remover espaços, converter para minúsculas, etc.

Por exemplo, pedir ao utilizador um nome e compará-lo sem se preocupar com espaços ou maiúsculas/minúsculas:

```js
function normalizarNome(nome) {
    return nome.trim().toLowerCase(); // remove espaços e põe em minúsculas
}

const nome1 = prompt("Nome 1:");
const nome2 = prompt("Nome 2:");

if (normalizarNome(nome1) === normalizarNome(nome2)) {
    console.log("Os nomes são iguais!");
} else {
    console.log("Nomes diferentes.");
}

// Assim, se o nome1 for " Ana " e o nome2 for "ana", serão considerados iguais.
```

---

## 4) Tipos de problemas (e soluções rápidas)

<a id="tipos-de-problemas"></a>

-   **Strings**:
    -   normalizar (`trim` + `toLowerCase`),
    -   remover pontuação com regex simples (`/[^\p{L}\p{N}\s]/gu`),
    -   partir por espaços (`split(/\s+/)`).
-   **Arrays** (a ver no ficheiro 12):
    -   filtrar lixo,
    -   transformar,
    -   acumular.
-   **Números**:
    -   converter com `Number(x)`,
    -   evitar `parseInt` para médias,
    -   verificar se é número: `Number.isNaN`.
    -   arredondar com `Math.round(x * 100) / 100` ou `toFixed(2)`.

---

## 5) Exemplo 1 - Contar palavras (duas soluções)

<a id="exemplo-contar-palavras"></a>

**Problema:** Dada uma frase, contar ocorrências de cada palavra.
Ex.: `"Ana ana, bruno!"` → `{ "ana": 2, "bruno": 1 }`

### E/S (preenchido)

| Entrada       | Exemplo           | Observações                        |
| ------------- | ----------------- | ---------------------------------- |
| frase: string | "Ana ana, bruno!" | pode ter pontuação, espaços a mais |

| Saída                          | Exemplo              | Observações               |
| ------------------------------ | -------------------- | ------------------------- |
| objeto `{ palavra: contagem }` | `{ ana:2, bruno:1 }` | minúsculas, sem pontuação |

**Casos especiais:** string vazia → `{}`; só pontuação → `{}`.

### Pseudocódigo

```text
1) Se frase vazia → {}
2) Normalizar: minúsculas, remover pontuação, trim
3) Partir por 1+ espaços
4) Contar palavras num objeto { palavra: contagem }
5) Devolver o objeto
```

### Versão A - imperativa (for + if)

```js
/**
 * Conta palavras numa frase (versão imperativa, passo a passo).
 */
function contarPalavrasA(frase) {
    // Guard clause
    // Se frase vazia ou só espaços, devolver objeto vazio
    if (!frase || !frase.trim()) return {};

    // "Limpar" a frase: minúsculas, remover pontuação, trim
    const normalizada = frase
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, "") // remove pontuação
        .trim();

    // Se ficou vazia depois da limpeza
    if (!normalizada) return {};

    // Partir em palavras (1+ espaços)
    // O split pega numa string e separa em várias partes consoante o separador. Neste caso, usamos uma expressão regular que corresponde a um ou mais espaços em branco (/\s+/).
    const palavras = normalizada.split(/\s+/);
    const freq = {};

    // Contar ocorrências
    for (const p of palavras) {
        // Mais uma guard clause: ignorar strings vazias (se houver)
        if (!p) continue;
        // Incrementar contagem (inicializa a 0 se não existir)
        if (freq[p] === undefined) {
            freq[p] = 1;
        } else {
            freq[p] += 1;
        }
    }
    return freq;
}
```

**Testes**

```js
console.log(contarPalavrasA("Ana ana, bruno!")); // { ana:2, bruno:1 }
console.log(contarPalavrasA("   ")); // {}
```

---

## 6) Exemplo 2 - Média com validação (numérica, arredondar)

<a id="exemplo-media"></a>

**Problema:** receber um array com números e strings numéricas e devolver a **média** arredondada a 2 casas decimais. Ignorar entradas não numéricas.

### E/S (preenchido)

| Entrada        | Exemplo              | Observações                    |
| -------------- | -------------------- | ------------------------------ |
| valores: array | [10, "12", "abc", 8] | pode ter strings não numéricas |

| Saída       | Exemplo | Observações                                              |
| ----------- | ------- | -------------------------------------------------------- |
| number/null | 10      | média arredondada a 2 casas ou null se sem dados válidos |

**Casos especiais:** array vazio → `null`; só lixo → `null`.

### Pseudocódigo

```text
1) Se não é array ou está vazio → null
2) Converter cada item com Number(x); ignorar NaN
3) Somar válidos e contar quantos
4) Se contagem = 0 → null
5) média = soma / contagem; arredondar a 2 casas
6) devolver a média
```

**Solução**

```js
/**
 * Calcula a média de valores numéricos (ignora não-números).
 * Devolve número arredondado a 2 casas decimais ou null se não há dados válidos.
 */
function media2casas(valores) {
    if (!Array.isArray(valores) || valores.length === 0) return null;

    let soma = 0,
        cont = 0;
    for (const v of valores) {
        const x = Number(v);
        if (Number.isNaN(x)) continue; // ignora lixo
        soma += x;
        cont += 1;
    }
    if (cont === 0) return null;
    return Math.round((soma / cont) * 100) / 100;
}

console.log(media2casas([10, "12", "abc", 8])); // 10
console.log(media2casas([])); // null
```

---

## 7) Exemplo 3 - Agrupar alunos por situação

<a id="exemplo-agrupar"></a>

**Problema:** Dado um array de objetos `{ nome, nota }`, devolver um objeto com arrays de nomes agrupados por situação: `aprovados` (nota ≥ 10) e `reprovados` (nota < 10).

### E/S (preenchido)

| Entrada                  | Exemplo                                                   | Observações                                   |
| ------------------------ | --------------------------------------------------------- | --------------------------------------------- |
| alunos: array de objetos | [ { nome: "Ana", nota: 18 }, { nome: "Bruno", nota: 9 } ] | cada objeto tem nome (string) e nota (number) |

| Saída                        | Exemplo                                       | Observações                         |
| ---------------------------- | --------------------------------------------- | ----------------------------------- |
| objeto com arrays de strings | { aprovados: ["Ana"], reprovados: ["Bruno"] } | arrays com nomes, conforme situação |

**Casos especiais:** array vazio → `{ aprovados: [], reprovados: [] }`.

### Pseudocódigo

```text
1) Se não é array ou está vazio → { aprovados: [], reprovados: [] }
2) Inicializar objeto resultado com arrays vazios
3) Para cada aluno no array:
    Se nota ≥ 10 → adicionar nome a aprovados
    Senão → adicionar nome a reprovados
4) Devolver o objeto resultado
```

**Solução**

```js
/**
 * Agrupa alunos por situação (aprovados/reprovados).
 */
function agruparAlunos(alunos) {
    // Guard clause - Se não é array ou está vazio → { aprovados: [], reprovados: [] }
    if (!Array.isArray(alunos) || alunos.length === 0) {
        return { aprovados: [], reprovados: [] };
    }
    const resultado = { aprovados: [], reprovados: [] };
    for (const aluno of alunos) {
        if (aluno.nota >= 10) {
            resultado.aprovados.push(aluno.nome);
        } else {
            resultado.reprovados.push(aluno.nome);
        }
    }
    return resultado;
}

console.log(
    agruparAlunos([
        { nome: "Ana", nota: 18 },
        { nome: "Bruno", nota: 9 },
    ])
); // { aprovados: ["Ana"], reprovados: ["Bruno"] }
```

---

## 8) Exemplo 4 - Palíndromo simples (com normalização)

<a id="exemplo-palindromo"></a>

**Problema:** Dada uma string, verificar se é um palíndromo (lê-se igual de trás para a frente), ignorando espaços, pontuação e maiúsculas/minúsculas.
Exemplo de uma palavra palíndroma: "Ana".

### E/S (preenchido)

| Entrada       | Exemplo | Observações                        |
| ------------- | ------- | ---------------------------------- |
| texto: string | "Ana"   | pode ter pontuação, espaços a mais |

| Saída   | Exemplo | Observações                         |
| ------- | ------- | ----------------------------------- |
| boolean | true    | true se for palíndromo, senão false |

**Casos especiais:** string vazia → true; só pontuação → true.

### Pseudocódigo

```text
1) Se texto vazio → true
2) Normalizar: minúsculas, remover pontuação, trim
3) Verificar se é igual ao reverso
4) Devolver true/false
```

**Solução**

```js
/**
 * Verifica se uma string é palíndroma (ignora espaços, pontuação, maiúsculas).
 */
function ehPalindromo(texto) {
    // Guard clause - Se texto vazio → true
    if (!texto || !texto.trim()) return true;

    // "Limpar" o texto: minúsculas, remover pontuação, trim
    const normalizado = texto
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]/gu, "") // remove pontuação e espaços
        .trim();
    // Verificar se é igual ao reverso
    const reverso = normalizado.split("").reverse().join("");
    return normalizado === reverso;
}

console.log(ehPalindromo("Ana")); // true
console.log(ehPalindromo("A man, a plan, a canal: Panama")); // true
console.log(ehPalindromo("Hello")); // false
```

---

## 9) Debugging (passo a passo)

<a id="debugging"></a>

1. **Ver o que tens**: imprime entradas/saídas e variáveis intermédias (`console.log`, `console.table`).
2. **Isolar**: põe a parte suspeita numa função pequena e testa com 2–3 inputs.
3. **Hipótese → teste → conclusão**: “Dá `NaN` → será por strings? → converto com `Number` → problema desapareceu.”
4. **Mini-asserts** (barato e útil):

```js
console.assert(Number.isNaN(Number("abc")), "Deveria ser NaN");
```

---

## 10) Testes rápidos (sem frameworks)

<a id="testes-rapidos"></a>

-   **Normal**: dados típicos corretos.
-   **Extremo/Erro**: vazio, `null`, tipos errados, limites.
-   **Vazio**: nada a processar → resposta neutra (`{}`, `null`, `0`, `[]`), consoante o problema.

---

## 11) Código limpo (regras simples)

<a id="codigo-limpo"></a>

-   **Funções curtas** (5–20 linhas). Cada uma faz **uma coisa**.
-   **Nomes claros** (`mediaTurma`, `contarPalavras`) e **variáveis autoexplicativas** (`soma`, `cont`).
-   **Comentários** só onde a intenção **não é óbvia**. Usar JSDoc para funções.
-   **Sem duplicação**: se repetes lógica, transforma em função.
-   **Espaçamento consistente**: linhas em branco entre blocos lógicos; indentação de 2 ou 4 espaços.

---

## 12) Estratégia de tempo (testes/provas)

<a id="estrategia-de-tempo"></a>

1. Lê todos os exercícios (2–3 min). Marca **fáceis** primeiro.
2. Resolve com o **roteiro 5 passos** logo no ínicio; escreve **pseudocódigo** antes de programar.
3. Se ficares preso 3–4 min, **passa ao próximo** e volta depois.

---

## 13) Desafios (Resolve usando o conteúdo deste capítulo)

<a id="desafios"></a>

1. **Conta ocorrências** Cria uma função que recebe uma frase e devolve quantas letras "a" (maiúsculas e minúsculas) tem.
2. **Números pares** Cria uma função que recebe um array de números e devolve um novo array só com os números pares.
3. **Top N palavras**: dada uma frase, devolve as N palavras mais frequentes com suas contagens.
4. **União de listas**: Pede dois arrays de 5 números ao utilizador e devolve um array com os números únicos de cada array.
5. **Resumo de notas**: dado um array de objetos `{ nome, nota }`, devolve a média, maior e menor nota.
6. **Normalizador de nomes**: Cria uma função que recebe um array de nomes e devolve um array com os nomes normalizados (todas as letras minusculas, sem espaços extra).

---

## Changelog

<a id="changelog"></a>

-   **v1.3.0 - 2025-11-18**
    -   Versão **ampliada e didática**: novas secções de leitura de problemas, tipos de problemas com “receitas”, 4 **exemplos completos**, debugging passo a passo, testes rápidos, estratégia de tempo, checklist e glossário.
-   **v1.2.0 - 2025-11-18**
    -   Reescrita didática com roteiro 5 passos, templates (E/S, pseudocódigo, simulação), exemplo em 2 estilos (imperativo/array methods), checklist, armadilhas e mini‑rubrica.
-   **v1.1.1 - 2025-11-11**
    -   Exercícios reorganizados com progressão suave, evitando funções independentes e focando numa tarefa por conceito.
-   **v1.1.0 - 2025-11-10**
    -   Secção de Exercícios ampliada com sete atividades práticas e inclusão do changelog.
