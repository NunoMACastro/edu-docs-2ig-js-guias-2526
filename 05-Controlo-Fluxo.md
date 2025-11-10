# [5] Estruturas de Controlo (if/else, switch, truthy/falsy)

> **Objetivo**: tomar decisões no código de forma **clara e previsível**. Vais aprender quando usar `if/else` vs `switch`, evitar armadilhas de `truthy/falsy`, e escrever condições fáceis de ler com **guard clauses** (saídas rápidas).

---

## 1) `if / else if / else` — a base das decisões

**Sintaxe geral**

```js
if (condicao1) {
    // bloco 1
} else if (condicao2) {
    // bloco 2
} else {
    // bloco final (opcional)
}
```

**Boas práticas**

-   Usa **parênteses** quando a condição ficar longa (melhora leitura).
-   Se a ação for curta, podes pôr numa linha, mas para iniciantes é **mais seguro** usar bloco `{}` sempre.
-   Prefere **igualdade estrita** `===` (evita coerção implícita).

**Exemplo simples**

```js
const nota = 14;
if (nota >= 18) {
    console.log("Excelente");
} else if (nota >= 10) {
    console.log("Aprovado");
} else {
    console.log("Reprovado");
}
```

---

## 2) `switch` — muitos casos concretos

**Quando usar**: quando comparas **o mesmo valor** contra **vários casos**. Fica mais limpo que uma cadeia longa de `if/else if`.

**Sintaxe e `break`**

```js
const fruta = "maçã";
switch (fruta) {
    case "maçã":
    case "banana":
    case "laranja":
        console.log("Fruta comum");
        break; // sem isto, continua a executar os próximos casos (fall‑through)
    default:
        console.log("Outra");
        break;
}
```

**Agrupar casos**: basta omitir o `break` entre eles (como acima).

**`switch(true)` para intervalos (opcional)**  
Quando a decisão depende de **intervalos** (ex.: nota), podes usar o padrão `switch(true)`:

```js
const nota = 14;
switch (true) {
    case nota >= 18:
        console.log("Excelente");
        break;
    case nota >= 10:
        console.log("Aprovado");
        break;
    default:
        console.log("Reprovado");
        break;
}
```

> Padrão útil, mas **não abuses**; se a lógica crescer, um `if/else` bem identado é mais claro.

---

## 3) `truthy/falsy` — como JS avalia condições

Valores **falsy**: `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`.  
Tudo o resto é **truthy** (inclui `"0"`, `"false"`, `[]`, `{}`).

**Armadilha comum**

```js
const total = 0;
// if (total) { ... }  // NÃO faças isto se 0 for um valor válido
if (total !== null && total !== undefined) {
    // condição segura: aceita 0, "" e false como válidos
}
```

**Operadores úteis para defaults**

-   `||` usa o da direita quando o da esquerda é **falsy** (substitui 0/""/false).
-   `??` usa o da direita quando o da esquerda é **null/undefined** (preserva 0/""/false).

```js
const paginas = 0;
const p1 = paginas || 1; // 1 (0 é falsy → substitui)
const p2 = paginas ?? 1; // 0 (nullish → preserva 0)
```

---

## 4) Guard clauses — sair cedo para simplificar

Evita `ifs` profundamente aninhados. Valida e **sai cedo** quando algo falha.

```js
/**
 * Classifica a idade em categorias simples.
 * @param {number|null|undefined} i
 * @returns {string}
 */
function validarIdade(i) {
    if (i == null) return "Idade em falta"; // null ou undefined
    if (typeof i !== "number" || Number.isNaN(i)) return "Não numérico";
    if (i < 0) return "Idade inválida";
    if (i < 18) return "Menor";
    return "Maior";
}
```

**Porquê melhor?**

-   Lê-se de cima para baixo como uma **lista de condições**.
-   Cada erro/limite é tratado e a função termina logo.
-   Evita `else` desnecessários.

---

## 5) Compor condições — AND/OR e parênteses

-   `&&` (E) – todas verdadeiras
-   `||` (OU) – pelo menos uma verdadeira
-   Usa **parênteses** para deixar a intenção clara.

```js
const maior = idade >= 18;
const temAutorizacao = encarregado?.assinou === true;

if ((maior && escolaAberta) || (temAutorizacao && acompanhado)) {
    console.log("Pode entrar");
}
```

> Regras longas? Divide em **variáveis booleanas nomeadas** como `maior`, `temAutorizacao`, etc.

---

## 6) Ternário vs `if/else`

O **ternário** é ótimo para **escolher um valor**. Se houver mais de uma instrução, prefere `if/else`.

```js
const nota = 18;
const conceito =
    nota >= 18 ? "Excelente" : nota >= 10 ? "Aprovado" : "Reprovado";

// Versão mais legível quando cresce:
let conceito2;
if (nota >= 18) conceito2 = "Excelente";
else if (nota >= 10) conceito2 = "Aprovado";
else conceito2 = "Reprovado";
```

---

## 7) Exemplos completos

### 7.1 Estações do ano (mês → estação) com `switch` e agrupamento

```js
/**
 * Devolve a estação do ano em PT a partir do número do mês (1-12).
 * @param {number} mes
 * @returns {"Inverno"|"Primavera"|"Verão"|"Outono"|"Desconhecido"}
 */
function estacaoDoAno(mes) {
    switch (mes) {
        case 12:
        case 1:
        case 2:
            return "Inverno";
        case 3:
        case 4:
        case 5:
            return "Primavera";
        case 6:
        case 7:
        case 8:
            return "Verão";
        case 9:
        case 10:
        case 11:
            return "Outono";
        default:
            return "Desconhecido";
    }
}
```

### 7.2 Login simples com guard clauses

```js
/**
 * Valida credenciais triviais (apenas exemplo didático).
 * @param {{user?:string, pass?:string}} cred
 */
function login(cred) {
    if (!cred) return "Credenciais em falta";
    const { user, pass } = cred;
    if (!user || !pass) return "Preenche utilizador e palavra‑passe";
    if (user === "admin" && pass === "1234") return "OK";
    return "Credenciais inválidas";
}
```

### 7.3 Acesso seguro e defaults corretos

```js
const aluno = { nome: "Ana", encarregado: null };
const telefone = aluno.encarregado?.telefone ?? "sem telefone";
console.log(telefone);
```

---

## 8) Erros comuns a evitar

-   Usar `=` em vez de `===` dentro do `if` (um **atribui**, o outro **compara**).
-   Esquecer `break` no `switch` quando **não** queres _fall‑through_.
-   Confiar que `if (valor)` verifica “está preenchido” (lembra-te de 0/"" serem falsy).  
    Usa `valor != null` quando queres apenas excluir `null`/`undefined`.

---

## 9) Exercícios rápidos

1. **Classificador de notas**: lê uma nota (0–20) e imprime `"Excelente"` (≥18), `"Bom"` (14–17), `"Suficiente"` (10–13) ou `"Insuficiente"` (<10). Faz com `if/else` **e** com `switch(true)`.
2. **Mês → Estação**: implementa `estacaoDoAno(mes)` (1–12) como acima e testa.
3. **Validação de formulário**: cria `validarIdade(i)` com guard clauses:
    - `null/undefined` → `"Idade em falta"`
    - não numérico ou `NaN` → `"Não numérico"`
    - `<0` → `"Idade inválida"`
    - `<18` → `"Menor"`
    - caso contrário `"Maior"`
4. **Defaults seguros**: reescreve `const pagina = entrada || 1;` para preservar `0` como válido.
5. **Condições legíveis**: transforma `if (a && !b || c && d)` em versão com **variáveis booleanas nomeadas** e parênteses.

---

**Resumo**: usa `if/else` para lógica geral, `switch` quando tens muitos casos do **mesmo valor**, aplica **guard clauses** para reduzir aninhamentos, e trata `truthy/falsy` com cuidado (usa `??` quando queres preservar `0`, `""` e `false`).
