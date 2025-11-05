/*

TOC
============================================================================
[1] VARIÁVEIS, TIPOS E CONCEITOS IMPORTANTES
[2] INPUT/OUTPUT BÁSICO (console.log e nota sobre prompt)
[3] OPERADORES ESSENCIAIS (aritm., comparação, lógicos, ternário, ??, ?.)
[4] STRINGS (imutabilidade, métodos úteis, templates)
[5] ESTRUTURAS DE CONTROLO (if/else, switch, truthy/falsy)
[6] ESTRUTURAS DE REPETIÇÃO (for, while, do...while, for...of, for...in)
[7] ARRAYS (criação, mutáveis vs imutáveis, métodos comuns)
[8] FUNÇÕES DE ALTO NÍVEL EM ARRAYS (map, filter, reduce, find, etc.)
[9] OBJETOS (criar, ler/escrever, this, utilitários Object.*)
[10] EXCEÇÕES (try/catch/finally, throw, erros personalizados)
[11] FUNÇÕES (declaração, expressão, arrow, parâmetros, hoisting, scope, closures, this)
============================================================================

*/

/* ==========================================================================
[1] VARIÁVEIS, TIPOS E CONCEITOS IMPORTANTES
============================================================================ */

/*
JavaScript tem *tipagem dinâmica* (o tipo de uma variável pode mudar).
Palavras‑chave para declarar variáveis:
  • let   → variável mutável com *escopo de bloco* (preferida para valores que mudam).
  • const → constante (o identificador não pode ser reatribuído). Também tem escopo de bloco.
  • var   → *NÃO usar* em novos projetos (escopo de função; hoisting confuso; legados do ES5).

Escopos:
  • Global       → visível em todo o ficheiro (ou window no browser).
  • Função       → visível apenas dentro da função (var, function declaration).
  • Bloco { }    → visível dentro de if/for/while/etc. (let e const).
*/

let idade = 17; // let: pode mudar
const PAIS = "Portugal"; // const: não pode reatribuir (mas objetos/arrays ainda podem mutar internamente)
// Ex.: const arr = []; arr.push(1) é permitido; arr = [1] NÃO é.

// Tipos primitivos: number, string, boolean, null, undefined, symbol, bigint
let numero = 42; // number (inteiros e reais usam o mesmo tipo)
let preco = 3.99; // number
let nome = "Nuno"; // string (podes usar " " ou ' ' ou ` `)
let ativo = true; // boolean
let nada = null; // null (intencionalmente vazio)
let indefinido; // undefined (não inicializada)
let idSimbolo = Symbol("id"); // symbol (identificadores únicos)
let inteiroGrande = 123n; // bigint (inteiros muito grandes; nota: não misturar com number)

// typeof devolve o tipo, com uma famosa pegadinha: typeof null === "object"
console.log(typeof numero); // → "number"
console.log(typeof nome); // → "string"
console.log(typeof ativo); // → "boolean"
console.log(typeof nada); // → "object" (peculiaridade histórica)
console.log(typeof indefinido); // → "undefined"
console.log(typeof idSimbolo); // → "symbol"
console.log(typeof inteiroGrande); // → "bigint"

/*
Number: NaN, Infinity e operações
---------------------------------
• NaN (Not-a-Number) resulta de operações inválidas (ex.: Number("abc")).
• Infinity/-Infinity surgem em divisões por zero ou números muito grandes.
• isNaN(x) e Number.isNaN(x): preferir Number.isNaN (não faz coerção).
*/
console.log(Number("abc")); // → NaN
console.log(Number.isNaN(NaN)); // → true
console.log(isNaN("abc")); // → true (faz coerção; cuidado)
console.log(1 / 0); // → Infinity
console.log(-1 / 0); // → -Infinity

/*
Coerção, truthy/falsy e igualdade
---------------------------------
• Em JS muitos valores são "truthy" (avaliam a true) ou "falsy" (avaliam a false).
  falsy: 0, -0, 0n, "", null, undefined, NaN
  truthy: quase tudo o resto (ex.: "0", [], {}, "false")
• == faz coerção de tipo; === NÃO faz coerção (preferir ===).
*/
console.log(Boolean("")); // → false
console.log(Boolean("0")); // → true
console.log(Boolean([])); // → true
console.log(2 == "2"); // → true  (coerção)
console.log(2 === "2"); // → false (sem coerção; preferível)

/* ==========================================================================
[2] INPUT/OUTPUT BÁSICO (console.log e nota sobre prompt)
============================================================================ */

/*
• console.log(...)  → saída para consola (browser DevTools/Node.js).
• console.error(...), console.warn(...), console.table(...), etc. também existem.

• prompt(...)       → *apenas no navegador* (bloqueante; pede input ao utilizador).
• alert(...), confirm(...) também são APIs do *browser*. Evita-as em código real amplo.
*/
console.log("Olá, mundo!"); // Exemplo simples

/* ==========================================================================
[3] OPERADORES ESSENCIAIS (aritm., comparação, lógicos, ternário, ??, ?.)
============================================================================ */

// Aritméticos: +, -, *, /, %, **
console.log(5 + 2); // → 7
console.log(5 % 2); // → 1 (resto)
console.log(2 ** 3); // → 8 (potência)

// Atribuição: =, +=, -=, *=, /=, %=, **=
let x = 10;
x += 5; // x = 15

// Comparação: >, >=, <, <=, ==, ===, !=, !==
console.log(3 > 2); // → true
console.log("2" == 2); // → true  (evitar)
console.log("2" === 2); // → false (preferir)

// Lógicos: && (e), || (ou), ! (não)
// "Curtocircuito": com || retorna o primeiro *truthy*; com && retorna o primeiro *falsy*
console.log(true && "ok"); // → "ok"   (true && "ok" → "ok")
console.log(false && "ok"); // → false  (para e devolve false)
console.log("" || "vazio"); // → "vazio" ("" é falsy; devolve o da direita)

// Operador ternário: condicao ? valorSeVerdadeiro : valorSeFalso
const maiorDeIdade = idade >= 18 ? "Sim" : "Não";
console.log(maiorDeIdade);

// Nullish coalescing (??): só substitui null/undefined (não substitui 0, "", false)
let entrada = 0;
console.log(entrada || 100); // → 100 (|| trata 0 como falsy)
console.log(entrada ?? 100); // → 0   (?? só troca null/undefined)

// Encadeamento opcional (?.): evita erro ao aceder a caminhos possivelmente indefinidos
const aluno = { nome: "Ana", encarregado: null };
console.log(aluno.encarregado?.telefone); // → undefined (sem lançar erro)

/* ==========================================================================
[4] STRINGS (imutabilidade, métodos úteis, templates)
============================================================================ */

/*
Strings são imutáveis: métodos retornam *novas* strings; a original não muda.
Métodos úteis: length, toUpperCase, toLowerCase, trim, includes, indexOf, slice, substring, replace, startsWith, endsWith
*/
const s = "   JavaScript   ";
console.log(s.length); // inclui espaços → 16
console.log(s.trim()); // remove espaços extremos
console.log(s.toUpperCase()); // "   JAVASCRIPT   "
console.log("abc".includes("b")); // true
console.log("banana".indexOf("na")); // 2
console.log("banana".slice(1, 3)); // "an" (fim não incluído)
console.log("hello world".replace("world", "mundo")); // "hello mundo"

// Template literals (crases `): interpolação e multilinha
const a = 5,
    b = 7;
const frase = `A soma de ${a} + ${b} = ${a + b}`;
console.log(frase);

/* ==========================================================================
[5] ESTRUTURAS DE CONTROLO (if/else, switch, truthy/falsy)
============================================================================ */

// if / else if / else
const nota = 14;
if (nota >= 18) {
    console.log("Excelente");
} else if (nota >= 10) {
    console.log("Aprovado");
} else {
    console.log("Reprovado");
}

// if ternário

const resultado = nota >= 10 ? "Aprovado" : "Reprovado";
// Aqui o Aprovado ou Reprovado é atribuído a resultado dependendo da condição que está antes do ?

// switch (útil para muitos casos concretos). Lembra-te dos break!
const dia = 2;
switch (dia) {
    case 1:
        console.log("Segunda");
        break;
    case 2:
        console.log("Terça");
        break;
    default:
        console.log("Outro dia");
        break;
}

// Podemos combinar várias condições num caso:
const fruta = "maçã";
switch (fruta) {
    case "maçã":
    case "banana":
    case "laranja":
        console.log("Fruta comum");
        break;
    case "kiwi":
    case "manga":
        console.log("Fruta exótica");
        break;
    default:
        console.log("Fruta desconhecida");
        break;
}

// Guard clauses (saídas rápidas) ajudam a evitar ifs muito aninhados:
function validarIdade(i) {
    if (i == null) return "Idade em falta";
    if (i < 0) return "Idade inválida";
    if (i < 18) return "Menor";
    return "Maior";
}
console.log(validarIdade(20)); // "Maior"

/* ==========================================================================
[6] ESTRUTURAS DE REPETIÇÃO (for, while, do...while, for...of, for...in)
============================================================================ */

// for clássico (contador)
for (let i = 0; i < 3; i++) {
    // console.log("i =", i);
}

// while (repete enquanto a condição for verdadeira)
let contador = 0;
while (contador < 3) {
    contador++;
}

// do...while (executa pelo menos uma vez)
let n = 0;
do {
    n++;
} while (n < 1);

// for...of → itera *valores* de iteráveis (arrays, strings, Maps, Sets)
const arrEx = [10, 20, 30];
for (const valor of arrEx) {
    // console.log("valor:", valor);
}

// for...in → itera *chaves* enumeráveis (normalmente em objetos). Evita usar em arrays.
const objEx = { a: 1, b: 2, c: 3 };
for (const chave in objEx) {
    console.log(`chave: ${chave}, valor: ${objEx[chave]}`);
}

// break e continue
for (let i = 0; i < 10; i++) {
    if (i === 3) continue; // salta o 3
    if (i === 5) break; // termina no 5
    // console.log(i);
}

/* ==========================================================================
[7] ARRAYS (criação, mutáveis vs imutáveis, métodos comuns)
============================================================================ */

// Criar arrays
const vazio = [];
const numeros = [1, 2, 3];
const misto = [1, "dois", true, { x: 10 }];

// Acesso e propriedades
console.log(numeros[0]); // → 1
console.log(numeros.length);

// MUTÁVEIS (alteram o array original)
const A = [1, 2, 3];
A.push(4); // adiciona ao fim → [1,2,3,4]
A.pop(); // remove do fim
A.unshift(0); // adiciona ao início
A.shift(); // remove do início
A.splice(1, 1, "X"); // a partir do índice 1, remove 1 e insere "X" → [1,"X",3]
console.log(A);

// IMUTÁVEIS (não alteram o original; retornam novo array)
const B = [3, 1, 2];
const C = B.slice().sort((a, b) => a - b); // copia + ordena sem tocar em B
console.log(B, C); // B intacto

// Copiar/concatenar de forma imutável (spread ...)
const base = [1, 2];
const mais = [...base, 3, 4]; // novo array
const concat = [...base, ...[5, 6]];

// Desestruturação (arrays)
const [primeiro, segundo] = [10, 20];
const [cabeca, ...resto] = [1, 2, 3, 4]; // resto = [2,3,4]
console.log(primeiro, segundo, cabeca, resto);

/* ==========================================================================
[8] FUNÇÕES DE ALTO NÍVEL EM ARRAYS (map, filter, reduce, find, etc.)
============================================================================ */

/*
Todas estas recebem *callbacks* (funções passadas como argumento).
Assinaturas (formas simplificadas):
  - arr.map( (item, index, array) => novoItem )
  - arr.filter( (item, index, array) => boolean )
  - arr.reduce( (acc, item, index, array) => novoAcc, valorInicial )
  - arr.find( (item) => boolean ) → primeiro que satisfaz (ou undefined)
  - arr.findIndex( (item) => boolean ) → índice (ou -1)
  - arr.some( (item) => boolean ) → true se *algum*
  - arr.every( (item) => boolean ) → true se *todos*
  - arr.sort( compareFn ) → **muta o original**; copia antes se precisares!
*/

const alunos = [
    { nome: "Ana", nota: 17 },
    { nome: "Bruno", nota: 9 },
    { nome: "Carla", nota: 14 },
];

// map → transforma cada elemento
const nomes = alunos.map((al) => al.nome);
console.log(nomes); // → ["Ana","Bruno","Carla"]

// filter → mantém apenas os que passam no teste
const aprovados = alunos.filter((al) => al.nota >= 10);
console.log(aprovados); // → [{Ana,17},{Carla,14}]

// reduce → acumula num único valor (soma, média, contagens, etc.)
const somaNotas = alunos.reduce((acc, al) => acc + al.nota, 0);
const media = somaNotas / alunos.length;
console.log(somaNotas, media);

// find / findIndex → procura o primeiro que satisfaz a condição
const primeiroReprovado = alunos.find((al) => al.nota < 10);
const idxPrimeiroReprovado = alunos.findIndex((al) => al.nota < 10);
console.log(primeiroReprovado, idxPrimeiroReprovado);

// some / every
console.log(alunos.some((al) => al.nota >= 18)); // → false (algum tem 18?)
console.log(alunos.every((al) => al.nota >= 10)); // → false (todos >= 10?)

// sort → ordenação personalizada (cuidar com strings com acentos; usar localeCompare)
const porNotaCresc = alunos.slice().sort((a, b) => a.nota - b.nota);
const nomesOrdenadosPT = alunos
    .slice()
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt"));
console.log(porNotaCresc, nomesOrdenadosPT);

/* ==========================================================================
[9] OBJETOS (criar, ler/escrever, this, utilitários Object.*)
============================================================================ */

// Criar objetos (literal)
const pessoa = {
    nome: "Marta",
    idade: 22,
    "apelido-com-hifen": "Silva", // chave com hífen precisa de aspas
    falar: function () {
        // "this" dentro de método aponta para o objeto (desde que *não* uses arrow fn)
        return `Olá, eu sou a ${this.nome}.`;
    },
};

// Ler e escrever
console.log(pessoa.nome); // dot notation
console.log(pessoa["apelido-com-hifen"]); // bracket notation (quando há caracteres especiais)
pessoa.idade = 23; // mudar valor
pessoa.escola = "EPMS"; // adicionar nova propriedade
delete pessoa["apelido-com-hifen"]; // remover propriedade

// Métodos de objeto: cuidado com arrow functions e o "this"
const conta = {
    saldo: 100,
    debitar(valor) {
        this.saldo -= valor; // aqui "this" funciona
    },
    // NÃO uses arrow function para métodos que usam this:
    // debitar: (valor) => { this.saldo -= valor }  // "this" não seria o objeto
};

conta.debitar(10);
// console.log(conta.saldo); // 90

// Utilitários Object.*
const chaves = Object.keys(pessoa); // ["nome","idade","falar","escola"]
const valores = Object.values(pessoa); // ["Marta",23, f, "EPMS"]
const pares = Object.entries(pessoa); // [["nome","Marta"],["idade",23], ...]

// Clonar/mesclar (shallow)
const copiaShallow = { ...pessoa }; // spread
const mescla = { ...pessoa, cidade: "Viseu" }; // mesclar e adicionar
// Deep clone (aproximação simples para dados JSON-compatíveis):
const profundo = JSON.parse(JSON.stringify(pessoa));
// Alternativa moderna (navegadores/Node recentes): structuredClone(pessoa)

// Desestruturação (objetos)
const { nome: nomePessoa, idade: idadePessoa, escola = "N/D" } = pessoa;
console.log(nomePessoa, idadePessoa, escola);

// Acesso seguro a profundidade (?.) + valor por defeito (??)
const cliente = { perfil: { contacto: { email: "x@y.z" } } };
const email = cliente.perfil?.contacto?.email ?? "sem email";
console.log(email);

/* ==========================================================================
[10] EXCEÇÕES (try/catch/finally, throw, erros personalizados)
============================================================================ */

// try/catch captura erros em tempo de execução e permite lidar com eles
function dividir(a, b) {
    if (typeof a !== "number" || typeof b !== "number") {
        throw new TypeError("Os argumentos têm de ser números.");
    }
    if (b === 0) {
        throw new RangeError("Divisão por zero não é permitida.");
    }
    return a / b;
}

try {
    const resultado = dividir(10, 2);
    console.log("Resultado:", resultado); // 5
} catch (erro) {
    console.error("Ocorreu um erro:", erro.message);
} finally {
    // Executa sempre (com erro ou sem erro). Útil para libertar recursos.
}

// Erro personalizado
class NotaInvalidaError extends Error {
    constructor(nota) {
        super(`Nota inválida: ${nota}`);
        this.name = "NotaInvalidaError";
    }
}

function classificar(nota) {
    if (typeof nota !== "number" || nota < 0 || nota > 20) {
        throw new NotaInvalidaError(nota);
    }
    return nota >= 10 ? "Aprovado" : "Reprovado";
}

try {
    console.log(classificar(14)); // "Aprovado"
    // console.log(classificar(42)); // atira NotaInvalidaError
} catch (e) {
    if (e instanceof NotaInvalidaError) {
        console.error("Erro de nota:", e.message);
    } else {
        console.error("Erro desconhecido:", e);
    }
}

/* ==========================================================================
[11] FUNÇÕES (declaração, expressão, arrow, parâmetros, hoisting, scope, closures)
============================================================================ */

/*
Três formas mais comuns:
1) Declaração de função (Function Declaration)
   • Hoisting: é "içada", podes chamá-la antes de a declarar no código.
2) Expressão de função (Function Expression)
   • Atribuída a uma variável/const; NÃO é içada da mesma forma.
3) Arrow function (=>)
   • Sintaxe curta; NÃO tem this próprio, nem arguments, nem super, nem new.target.
   • Excelente para callbacks e funções curtas. Evita em métodos de objetos que usam this.

Scope:
  • let/const têm escopo de bloco.
  • funções criam escopo próprio.
  • variáveis de fora são capturadas por *closure* (ver exemplo).

Parâmetros:
  • default params, rest (...args), desestruturação de parâmetros.
*/

/*
this:
• O "this" é um termo especial que aponta para o contexto de execução.
• O contexto de execução é a forma como a função é chamada. Ou seja, “quem é o dono da chamada” naquele momento.
• É definido pela forma como a função é invocada (call-site), não pelo local onde foi escrita: por exemplo, em obj.metodo() o this é obj.
• Em funções normais, "this" depende de como a função é chamada (objeto antes do ponto).
 */

// 1) Declaração (hoisting total)
console.log(somarDeclaracao(2, 3)); // → 5 (chamada antes da declaração funciona)
function somarDeclaracao(a, b) {
    return a + b;
}

// 2) Expressão (sem hoisting "utilizável")
// console.log(somarExpressao(2, 3)); // ERRO se descomentares (não definida nesta linha)
const somarExpressao = function (a, b) {
    return a + b;
};
console.log(somarExpressao(2, 3)); // → 5

// 3) Arrow function (sintaxe curta; ideal para callbacks)
const somarArrow = (a, b) => a + b;
console.log(somarArrow(2, 3)); // → 5

// Arrow e "this": não usar arrow para métodos que precisam de this dinâmico
const relogio = {
    horas: 0,
    tick() {
        this.horas++;
    },
    // tick: () => { this.horas++ } // NÃO FAZER! "this" não será o objeto
};

// Parâmetros com valor por defeito
function saudacao(nome = "aluno") {
    return `Olá, ${nome}!`;
}
console.log(saudacao());
console.log(saudacao("Rita"));

// Parâmetros rest (...)
function somaTudo(...nums) {
    return nums.reduce((acc, n) => acc + n, 0);
}
console.log(somaTudo(1, 2, 3, 4)); // → 10

// Desestruturação em parâmetros
function imprimirAluno({ nome, nota }) {
    console.log(`${nome} tem ${nota}`);
}
imprimirAluno({ nome: "Ana", nota: 18 });

/*
Closures (fechos):
Uma função "lembra-se" do ambiente onde foi criada. Permitem encapsular estado.
*/
function criarContador(inicial = 0) {
    let valor = inicial; // variável privada dentro do closure
    return function () {
        // função interna captura "valor"
        valor++;
        return valor;
    };
}
const proximo = criarContador(10);
console.log(proximo()); // 11
console.log(proximo()); // 12

/*
Funções puras vs impuras:
- Pura: só depende dos argumentos e não causa efeitos colaterais (side effects).
- Impura: lê/escreve estados externos (ex.: alterar variáveis globais, I/O, etc.).
Preferir funções puras quando possível (mais testáveis e previsíveis).
*/

/*
QUANDO USAR CADA TIPO DE FUNÇÃO?
- Declaração: quando queres hoisting (chamar antes), ou para funções utilitárias
  "globais" do módulo.
- Expressão: quando queres controlar a ordem de definição, ou passar como valor
  facilmente.
- Arrow: excelente para callbacks curtos (map/filter/reduce) e funções de uma
  linha; evita em métodos de objetos que usam "this".

  Callbacks:
  Callbacks são funções passadas como argumentos para outras funções.
  Normalmente as callbacks são executadas quando um evento ocorre ou quando uma
  operação assíncrona é concluída.
  Regras práticas:
  • Usa arrow functions para callbacks simples (ex.: arr.map(x => x * 2)).
  • Usa funções nomeadas (declaração ou expressão) para callbacks mais complexos
    ou reutilizáveis.

*/
