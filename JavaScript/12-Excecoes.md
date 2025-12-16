# [12] Exceções (11.º ano) — guia prático e sem classes

> **Objetivo**: entender o que é uma exceção, ler mensagens de erro, impedir que o programa morra de repente e criar estratégias simples para tratar problemas síncronos e assíncronos **com as ferramentas que já conheces** (funções, objetos, ciclos, arrays).

---

**Índice**

-   [0) Quando é que “rebenta”?](#sec0)
-   [1) Anatomia de um erro (stack trace)](#sec1)
-   [2) `try / catch / finally` com calma](#sec2)
-   [3) `throw`: avisar cedo e bem](#sec3)
-   [4) Erros personalizados sem classes](#sec4)
-   [5) `finally`: arrumar a casa](#sec5)
-   [6) Casos reais (JSON, divisões, inputs)](#sec6)
-   [7) Erros assíncronos (promessas e `async/await`)](#sec7)
-   [8) Padrões e checklist rápida](#sec8)
-   [9) Exercícios](#sec9)
-   [Changelog](#changelog)

---

## 0) Quando é que “rebenta”?

<a id="sec0"></a>

Uma **exceção** é o motor JavaScript a dizer: “Não consigo continuar, há aqui algo que não fez sentido”.  
Alguns exemplos que já viste nas aulas anteriores:

-   `JSON.parse("isto não é JSON")` → `SyntaxError`.
-   Aceder a `obj.algo.outra` quando `obj.algo` é `undefined` → `TypeError`.
-   Dividir por zero numa função mal validada → erro lançado por ti com `throw`.
-   Usar uma variável não declarada → `ReferenceError`.

Sem tratamento o navegador/Node mostra um **stack trace** e pára ali. Com tratamento consegues mostrar mensagens amigáveis, repetir pedidos ao utilizador ou seguir com valores por defeito.

---

## 1) Anatomia de um erro (stack trace)

<a id="sec1"></a>

Quando surge um erro, o motor constrói um **objeto `Error`** com:

-   `name`: tipo (`TypeError`, `RangeError`, …).
-   `message`: descrição curta (tu escreves ou o motor escreve).
-   `stack`: lista das funções chamadas até ao erro (útil para debugging).

Ordem dos acontecimentos:

1. Código executa normalmente dentro de uma pilha (stack) de funções.
2. Quando algo falha, é criado o objeto `Error`.
3. O motor sobe a stack à procura de um `try` com `catch`.
4. Se encontrar, executa o bloco `catch`.  
   Se não encontrar, o programa é interrompido e o erro aparece na consola.

> Lê sempre o tipo e a mensagem. Muitas vezes já dizem o que falta (`Cannot read properties of undefined`, `Unexpected token }`, etc.).

---

## 2) `try / catch / finally` com calma

<a id="sec2"></a>

Estrutura base:

```js
try {
    // código que pode falhar
} catch (erro) {
    console.error("Ups:", erro.message);
} finally {
    // limpa recursos, mostra logs finais, fecha ficheiros simulados, etc.
}
```

Regras importantes:

-   Só o código **dentro do `try`** é protegido. Coloca lá dentro apenas aquilo que pode falhar.
-   O `catch (erro)` recebe automaticamente o objeto criado pelo motor.
-   O `finally` corre sempre, exista erro ou não. É opcional, mas útil.
-   Podes ter `try/catch` dentro de funções e chamar essas funções noutros sítios. Tudo o que aprendeste sobre organização de código continua a aplicar-se aqui.

Exemplo básico:

```js
function dividir(a, b) {
    if (typeof a !== "number" || typeof b !== "number") {
        throw new TypeError("Preciso de números");
    }
    if (b === 0) {
        throw new RangeError("Divisão por zero");
    }
    return a / b;
}

try {
    console.log(dividir(10, 2));
} catch (erro) {
    console.warn(`${erro.name}: ${erro.message}`);
} finally {
    console.log("Fim do cálculo");
}
```

Se a divisão falhar, o `catch` mostra uma mensagem simpática e o `finally` corre na mesma.

---

## 3) `throw`: avisar cedo e bem

<a id="sec3"></a>

`throw` serve para dizer explicitamente que algo está inválido.  
Preferências:

-   Cria objetos com `new Error("mensagem")` ou tipos específicos:
    -   `TypeError` → tipo errado.
    -   `RangeError` → valor fora do intervalo.
    -   `SyntaxError`, `ReferenceError`, `URIError`, …
-   Personaliza a mensagem e, se precisares, adiciona dados extra:

```js
function lerIdade(texto) {
    const idade = Number(texto);
    if (Number.isNaN(idade)) {
        const erro = new TypeError("Idade inválida");
        erro.valorRecebido = texto;
        throw erro;
    }
    return idade;
}
```

-   Evita lançar strings soltas (`throw "falhou"`). Perdes o `stack` e confundes quem lê.

### Encadear causa (quando fizer sentido)

Se estiveres a tratar o erro e quiseres acrescentar contexto:

```js
try {
    JSON.parse("{ inválido }");
} catch (erroOriginal) {
    throw new Error("Configuração inválida", { cause: erroOriginal });
}
```

Funciona nos browsers modernos e em Node recente.

---

## 4) Erros personalizados sem classes

<a id="sec4"></a>

Normalmente usamos classes para criar erros personalizados (herdando de `Error`).
Mas como a matéria de classes só aparece mais à frente, vamos criar erros personalizados com **funções normais**:

```js
function criarErroNotaInvalida(nota) {
    const erro = new Error(`Nota inválida: ${nota}`);
    erro.name = "NotaInvalidaError"; // etiqueta personalizada
    erro.codigo = "NOTA_FORA_INTERVALO"; // podes inventar códigos
    return erro;
}

function classificar(nota) {
    if (typeof nota !== "number" || nota < 0 || nota > 20) {
        throw criarErroNotaInvalida(nota);
    }
    return nota >= 10 ? "Aprovado" : "Reprovado";
}

try {
    classificar(42);
} catch (erro) {
    if (erro.name === "NotaInvalidaError") {
        console.warn("Corrige a nota:", erro.message);
        console.log("Código interno:", erro.codigo);
    } else {
        throw erro; // erro inesperado → deixa seguir para debugging
    }
}
```

> Guardamos informação extra (`name`, `codigo`, `dados`) para o `catch` decidir o que fazer.

---

## 5) `finally`

<a id="sec5"></a>

Usa `finally` quando precisas de garantir que um recurso fica limpo:

```js
let recursoAberto = false;

function lerRecurso() {
    try {
        recursoAberto = true;
        // ... código que pode lançar
    } catch (erro) {
        console.error("Falhou ao ler recurso:", erro.message);
    } finally {
        recursoAberto = false; // corre SEMPRE
    }
}
```

Outros usos comuns: fechar animações, mostrar uma mensagem “processo terminado”, parar um spinner de carregamento, libertar arrays temporários, etc.

---

## 6) Casos reais (JSON, divisões, inputs)

<a id="sec6"></a>

### 6.1 Ler texto do utilizador

```js
function lerNumero(promptMsg) {
    const resposta = prompt(promptMsg);
    const numero = Number(resposta);
    if (Number.isNaN(numero)) {
        const erro = new TypeError("Preciso de um número válido.");
        erro.valor = resposta;
        throw erro;
    }
    return numero;
}

try {
    const idade = lerNumero("Qual é a tua idade?");
    console.log("Idade registada:", idade);
} catch (erro) {
    console.warn("Entrada inválida:", erro.message);
}
```

### 6.2 JSON vindo de um ficheiro / localStorage

```js
function lerJSONSeguro(texto, fallback = {}) {
    try {
        return JSON.parse(texto);
    } catch (erro) {
        console.warn("JSON inválido. A usar dados padrão.");
        return fallback;
    }
}
```

### 6.3 Validação de regras

```js
function calcularMedia(valores) {
    if (!Array.isArray(valores) || valores.length === 0) {
        throw new RangeError("Preciso de pelo menos um valor.");
    }
    let soma = 0;
    for (const v of valores) {
        const numero = Number(v);
        if (Number.isNaN(numero)) {
            throw new TypeError(`Valor inválido: ${v}`);
        }
        soma += numero;
    }
    return soma / valores.length;
}
```

Estes exemplos usam apenas funções simples (nada de classes) e os conceitos que tens até ao capítulo 9.

---

## 7) Erros assíncronos (promessas e `async/await`)

<a id="sec7"></a>

> Ver também o capítulo [15 - Assíncrono e Event Loop](15-Assincrono-EventLoop.md) quando lá chegares.

Mesmo sem entrares em detalhe, precisas de saber duas coisas:

1. **Promises** propagam rejeições pela cadeia:

```js
fetch("/api/dados")
    .then((resposta) => {
        if (!resposta.ok) {
            throw new Error("HTTP " + resposta.status);
        }
        return resposta.json();
    })
    .then((dados) => console.log("Tudo bem:", dados))
    .catch((erro) => console.error("Falhou:", erro.message))
    .finally(() => console.log("Pedido terminado"));
```

2. **`async/await`** permite usar `try/catch` “normal” desde que uses `await` no ponto certo:

```js
async function carregarDados() {
    try {
        const resposta = await fetch("/api/dados");
        if (!resposta.ok) throw new Error("HTTP " + resposta.status);
        return await resposta.json();
    } catch (erro) {
        console.error("Erro a carregar:", erro.message);
        return null;
    }
}
```

⚠️ `try/catch` não apanha erros que acontecem dentro de `setTimeout` ou callbacks independentes. O `try` tem de estar dentro desse callback ou tens de devolver uma Promise rejeitada.

---

## 8) Padrões e checklist rápida

<a id="sec8"></a>

-   **Valida cedo** (guard clauses): poupa-te dores de cabeça.
-   **Lança erros informativos** (`throw new TypeError("...")`).
-   **Decide o que devolver** quando algo falha:
    -   `null`, `undefined`, valores de fallback, objetos `{ ok: false, erro }`.
-   **Não engulas erros**: se não sabes o que fazer, volta a lançar (`throw erro;`).
-   **Regista contexto útil** (`erro.valor`, `erro.url`).  
    Ajuda-te a reproduzir o bug.
-   **Limpa sempre** recursos temporários no `finally`.
-   **Testa** com 3 casos: normal, inválido e extremo (como aprendeste no capítulo 9).

Snippet “utilitário”:

```js
function executarComSeguranca(fn) {
    try {
        return { ok: true, valor: fn() };
    } catch (erro) {
        return { ok: false, erro };
    }
}
```

---

## 9) Exercícios

<a id="sec9"></a>

1. **Leitor seguro**  
   Cria uma função `lerInteiro(mensagem)` que pede um número com `prompt`, valida com `Number.isInteger` e volta a pedir enquanto o utilizador insistir em valores inválidos. Usa `try/catch` para tratar a conversão e mostra mensagens claras.
2. **Média protegida**  
   Reaproveita o exercício de médias dos capítulos anteriores e adiciona `throw` quando:
    - o array vem vazio;
    - algum elemento não é número.
      No código que chama a função, usa `try/catch` para mostrar “Dados incompletos” e termina o programa com `return`.
3. **JSON ou padrão**  
   Escreve uma função `carregarConfig(texto)` que tenta fazer `JSON.parse`. Se falhar, devolve `{ tema: "claro", linguagem: "pt" }` e regista o erro com `console.warn`.
4. **Divisão segura com relatório**  
   Cria `dividirSeguro(a, b)` que devolve um objeto `{ ok: true, resultado }` ou `{ ok: false, erro }`. Usa `throw` dentro da função, apanha no final e devolve o relatório. Testa com valores válidos, strings e divisão por zero.
5. **Extra (quando chegares ao capítulo 15)**  
   Faz um `fetch` a um URL qualquer (mesmo que dê erro, usa `https://httpstat.us/404`), trata com `.catch` e garante que `finally` escreve “pedido terminado”.

> Antes de começar cada exercício faz o teu ritual: tabela E/S, pseudocódigo e testes (capítulo 9!).

---

## Changelog

<a id="changelog"></a>

-   **v1.2.0 — 2025-11-18**
    -   Reescrita completa sem classes, com mais exemplos comentados e exercícios graduais.
    -   Secções novas sobre leitura de stack trace, padrões e checklist.
-   **v1.1.0 — 2025-11-10**
    -   Mini desafios expandidos para sete propostas cobrindo erros síncronos e assíncronos.
    -   Changelog inaugurado para seguir alterações do capítulo.
