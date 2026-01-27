# [14] Classes e OOP (11.º ano)

> **Objetivo**: entender, com linguagem simples e muitos exemplos, o que são **classes** e **objetos** em JavaScript, como usar **constructor**, **métodos**, **getters/setters**, **campos privados `#`**, **métodos/variáveis estáticas**, **herança (`extends/super`)**, e quando faz sentido **preferir composição**. No fim tens desafios para praticar.

---

## 0) Classes: molde → objeto

- **Classe**: Pensa numa receita ou molde (ex.: **bolo**). Define como são os objetos (ex.: **ingredientes** e **passos**).
- **Objeto (instância)**: o **bolo** feito a partir do molde / receita. Cada bolo tem os **seus próprios valores**.
- **Propriedades** = dados (ex.: `nome`, `idade`). **Métodos** = ações (ex.: `apresentar()`).
- Em JavaScript, **classes** são uma forma prática de escrever algo que por baixo funciona com **protótipos** (vamos ver mais tarde).
- Este capítulo assume que já dominas **objetos e `this`** (capítulo 8) e **funções** (capítulos 10/11). Vamos construir em cima disso com calma, mas sempre lembrando que o valor de `this` **depende de como a função é chamada**: com `new` aponta para a instância, solta (ex.: `const fn = pessoa.apresentar; fn();`) fica `undefined` em modo strict, e com `.call/.apply/.bind` podemos forçar um objeto específico. Esta ideia volta várias vezes ao longo do capítulo.

---

## 1) A tua primeira classe

```js
class Pessoa {
    // Campos declarados aqui ajudam a ver o que existe
    nome;
    idade;

    // constructor: corre quando fazemos "new Pessoa(...)"
    constructor(nome, idade) {
        this.nome = nome; // "this" aponta para o objeto que está a nascer
        this.idade = idade; // guarda valores nesse objeto
    }

    // método de instância (ação que cada pessoa sabe fazer)
    apresentar() {
        return `Olá, eu sou a/o ${this.nome} e tenho ${this.idade} anos.`;
    }
}

const ana = new Pessoa("Ana", 16); // criamos um objeto (instância)
console.log(ana.apresentar()); // "Olá, eu sou a/o Ana..."
```

**Pontos‑chave**

- `new` cria um **novo objeto** e corre o `constructor`.
- `this` dentro dos métodos da classe refere‑se ao **objeto atual**. O `this` é um “atalho” para o objeto e é um dos principais conceitos de OOP pois permite associar o objeto aos seus dados e comportamentos.
- Podes definir **valores por defeito** para propriedades logo na classe (`idade = 18;`) ou nos parâmetros do `constructor` (`constructor(nome, idade = 18)`).
- Se não precisares de um `constructor` personalizado, podes omitir; o JavaScript cria um vazio (`constructor() {}`) automaticamente.

> **Nota rápida (hoisting)**: classes não são “hoisted” como funções.  
> Usar `new Pessoa()` antes de `class Pessoa { ... }` dá erro.  
> Resultado típico: `ReferenceError: Cannot access 'Pessoa' before initialization`.

---

## 2) Controlar acesso: getters e setters

Às vezes, antes de **guardar** um valor, queremos **validar** ou definir como e em que condições pode ser acedido. Para isso, usamos `get` e `set`.

- `get` define um **método de leitura**.
- `set` define um **método de escrita**.

```js
class Aluno {
    nome;
    #nota; // vamos falar de "privado" já a seguir

    constructor(nome, nota) {
        this.nome = nome;
        this.nota = nota; // usa o setter em vez de mexer diretamente
    }

    get nota() {
        // ler: al.nota
        return this.#nota;
    }
    set nota(v) {
        // escrever: al.nota = 18
        if (typeof v !== "number" || v < 0 || v > 20) {
            throw new RangeError("Nota inválida (0–20).");
        }
        this.#nota = v;
    }
}

// Exemplo de utilização
const aluno = new Aluno("Bruno", 15);
console.log(aluno.nota); // usa o getter → 15
aluno.nota = 18; // usa o setter
console.log(aluno.nota); // 18
```

> Usamos o # no `set` em `this.#nota` para indicar que é um campo privado (ver §3).

**Ideia**: o **setter** bloqueia valores errados e o **getter** expõe o valor com segurança.

Um exemplo mais prático e útil:

```js
class ContaBancaria {
    #saldo = 0;

    depositar(valor) {
        if (valor <= 0) throw new RangeError("Valor inválido.");
        this.#saldo += valor;
    }

    levantar(valor) {
        if (valor <= 0 || valor > this.#saldo)
            throw new RangeError("Saldo insuficiente.");
        this.#saldo -= valor;
    }

    get saldo() {
        if (this.#saldo < 0) {
            throw new Error("Erro: saldo negativo.");
        }
        return this.#saldo;
    }
    set saldo(v) {
        throw new Error("Não podes definir o saldo diretamente.");
    }
}
```

---

## 3) Encapsulamento: campos **privados `#`**

- Um campo que começa por `#` é **privado**: **só** pode ser usado dentro da própria classe.
- Ajuda a **proteger o estado** de alterações acidentais.

```js
class Conta {
    #saldo = 0; // começa a 0 e é privado
    #registar(op, valor) {
        /* guardar histórico internamente */
    }

    depositar(v) {
        if (v <= 0) throw new RangeError("valor inválido");
        this.#saldo += v;
        this.#registar("DEP", v);
    }

    levantar(v) {
        if (v <= 0 || v > this.#saldo)
            throw new RangeError("saldo insuficiente");
        this.#saldo -= v;
        this.#registar("LEV", v);
    }

    get saldo() {
        return this.#saldo;
    } // só leitura
}

// Exemplo de não poder aceder
const c = new Conta();
c.depositar(100);
console.log(c.saldo); // 100
c.#saldo = 1000; // ERRO: campo privado (não executar)
c.#registar("DEP", 50); // ERRO: método privado (não executar)
```

> Em JS **não existe** o modificador “protegido” (protected). Se precisares que subclasses interajam, expõe **métodos públicos** específicos em vez de abrir o estado.

> Se precisares **MESMO** de algo acessível só dentro da classe e subclasses, considera usar **WeakMap** ou **Symbol** (avançado, não é comum).

> Nota de compatibilidade: campos privados `#` e class fields exigem um JavaScript moderno. Em ambientes antigos podem falhar; nesse caso, prefere padrões com `function` + `prototype` ou transpila com Babel.

---

## 4) Métodos e campos **estáticos** (da classe, não do objeto)

- `static` vive na **classe**, não nas instâncias. Útil para **constantes** e **utilitários** comuns.

```js
class Util {
    static PI = 3.14159;
    static clamp(v, min, max) {
        return Math.min(max, Math.max(min, v));
    }
}
console.log(Util.PI); // 3.14159
console.log(Util.clamp(10, 0, 5)); // 5
```

Também podem ser **privados** na classe:

```js
class Contador {
    static #total = 0;
    constructor() {
        Contador.#total++;
    }
    static total() {
        return Contador.#total;
    }
}
new Contador();
new Contador();
console.log(Contador.total()); // 2
```

---

## 5) Herança: `extends` e `super`

Usa herança quando a relação é claramente **“é‑um”** (um Aluno **é uma** Pessoa).

```js
class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
    apresentar() {
        return `Sou ${this.nome}`;
    }
}

class Aluno extends Pessoa {
    constructor(nome, turma) {
        super(nome); // chama constructor da "Pessoa"
        this.turma = turma;
    }
    apresentar() {
        // sobrepõe e reutiliza
        return `${super.apresentar()} e estou na turma ${this.turma}`;
    }
}

const c = new Aluno("Carla", "11.º IG");
console.log(c.apresentar());
```

**Notas rápidas**

- Tem de chamar `super(...)` antes de usar `this` no `constructor`.
- Podes chamar `super.metodo()` para **reaproveitar** lógica da classe‑pai.

---

## 6) Composição (muitas vezes melhor que herança)

Usa composição quando a relação é **“tem‑um”** (um Relógio **tem um** Temporizador).

```js
class Temporizador {
    #id = null;
    start(ms, cb) {
        this.stop();
        this.#id = setInterval(cb, ms);
    }
    stop() {
        if (this.#id) {
            clearInterval(this.#id);
            this.#id = null;
        }
    }
}

class Relogio {
    #t = new Temporizador();
    #seg = 0;
    iniciar() {
        this.#t.start(1000, () => this.#seg++);
    }
    parar() {
        this.#t.stop();
    }
    get segundos() {
        return this.#seg;
    }
}
```

**Regra prática**

- **Herança**: quando a subclasse **cumpre o contrato** da classe‑base.
- **Composição**: quando queres **juntar capacidades** sem criar uma árvore de heranças difícil de manter.

---

## 7) `this` em classes e callbacks

- Dentro de um **método**, `this` é a **instância** criada com `new`.
- O corpo de uma `class` corre em **strict mode** por defeito. Por isso, quando perdes o contexto, o `this` tende a ficar `undefined` e rebenta.
- Fora de uma chamada normal `instancia.metodo()`, o `this` **deixa de apontar** para a instância. Isto acontece muito quando usamos esse método como callback de eventos/temporizadores, ou quando fazemos `const func = instancia.metodo; func();`.
- Ao passar métodos como **callback** (ex.: para um evento), podes **perder** o `this`. Quando isso acontece, o valor fica `undefined` e acabas com erros do género “Cannot read properties of undefined”. Duas soluções comuns:

```js
class Timer {
    nome = "Timer oficial";
    iniciar() {
        // ERRO: this.iniciar é passado "solto" para setTimeout
        setTimeout(this.reportar, 1000);
    }
    reportar() {
        console.log(`Sou ${this.nome}`); // this === undefined, rebenta
    }
}
```

**A) Fazer `bind` no constructor**

```js
class Botao {
    constructor() {
        // bind cria uma NOVA função cujo this fica preso à instância
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        console.log("this é a instância:", this);
    }
}
```

**B) Usar campos de classe com arrow functions**

```js
class Botao {
    handleClick = () => {
        console.log("this aponta sempre para a instância.");
    };
}
```

Ao declarar o método como propriedade (`handleClick = () => { ... }`), o `this` fica automaticamente “preso” à instância porque arrow functions não criam `this` próprio. É a abordagem mais simples para eventos no browser.

**Trade-off rápido**

- Método normal: fica no `prototype`, uma função partilhada por todas as instâncias (mais leve).
- Arrow como class field: cria uma função por instância (mais memória), mas mantém o `this` preso.
- Regra prática: começa com método normal.
- Usa arrow quando precisas de passar o método como callback muitas vezes.
- Se não precisas, evita o custo extra por instância.

> Regra rápida: se um método vai ser passado como callback, define-o como arrow (`metodo = () => { ... }`) ou faz `bind` no `constructor`.

**Resumo rápido**

- `bind` devolve uma nova função **fixando** o `this`. Usa-se quando queres manter o método como função normal mas garantir a ligação (`document.addEventListener("click", this.handleClick.bind(this))`).
- Arrow functions como campos de classe já “capturam” o `this` lexical, por isso dispensam `bind`.
- Métodos normais **sem** `bind` só funcionam enquanto são chamados diretamente da instância. Assim que lhes retiras o contexto (`const fn = instancia.metodo;`), perdes o `this`.

---

> **Nota sobre timers**: `setTimeout`/`setInterval` são assíncronos; o tempo é aproximado; lembra-te de parar com `clearInterval`. Ver [15] §7 e §8.

## 8) Estudo guiado: sistema simples de alunos

Vamos juntar vários conceitos num mini‑projeto. Objetivo: gerir uma turma com alunos, validar notas e calcular média/aprovados.

1. **Classe base (`Pessoa`)** - só guarda nome e apresenta.

```js
class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
    apresentar() {
        return `Sou ${this.nome}`;
    }
}
```

2. **Subclasse (`Aluno`)** - herda de `Pessoa`, adiciona nota privada + validação (get/set).

```js
class Aluno extends Pessoa {
    #nota = 0;
    constructor(nome, nota) {
        super(nome);
        this.nota = nota; // usa setter
    }
    get nota() {
        return this.#nota;
    }
    set nota(valor) {
        if (typeof valor !== "number" || valor < 0 || valor > 20) {
            throw new RangeError("Nota inválida.");
        }
        this.#nota = valor;
    }
    apresentar() {
        return `${super.apresentar()} e tenho ${this.nota} valores.`;
    }
}
```

3. **Classe compositora (`Turma`)** - possui um array privado com alunos e métodos utilitários.

```js
class Turma {
    #alunos = [];
    adicionarAluno(aluno) {
        if (!(aluno instanceof Aluno)) {
            throw new TypeError("Preciso de um Aluno.");
        }
        this.#alunos.push(aluno);
    }
    media() {
        if (this.#alunos.length === 0) return 0;
        const soma = this.#alunos.reduce((acc, aluno) => acc + aluno.nota, 0);
        return Math.round((soma / this.#alunos.length) * 10) / 10;
    }
    aprovados() {
        return this.#alunos.filter((aluno) => aluno.nota >= 10);
    }
    listar() {
        console.table(
            this.#alunos.map((aluno) => ({
                nome: aluno.nome,
                nota: aluno.nota,
            })),
        );
    }
}
```

4. **Usar tudo junto**

```js
const turma = new Turma();
turma.adicionarAluno(new Aluno("Ana", 18));
turma.adicionarAluno(new Aluno("Bruno", 9));
turma.listar();
console.log("Média:", turma.media());
console.log(
    "Aprovados:",
    turma.aprovados().map((a) => a.nome),
);
```

Este exemplo mostra:

- Herança (`Aluno extends Pessoa`).
- Encapsulamento (`#nota`, `#alunos`).
- Validação com setters.
- Composição (Turma **tem** Alunos).
- Uso de métodos utilitários de array vistos no capítulo 11.

Usa-o como referência para os teus próprios projetos: define a classe base, cria subclasses quando fizer sentido e encapsula coleções em classes “gestoras”.

---

## 9) JSON e classes (nota útil)

- Converter para JSON **não inclui** métodos nem campos privados. Normalmente só os **dados públicos** são serializados.
- Se precisares, cria um método que devolve um **objeto simples** pronto para `JSON.stringify`:

```js
class Pessoa {
    #idade;
    constructor(nome, idade) {
        this.nome = nome;
        this.#idade = idade;
    }
    // ...
    toJSON() {
        return { nome: this.nome };
    } // exemplo básico
}
```

---

## 10) Fábricas vs Classes (quando usar cada uma)

**Fábrica**: função que devolve um objeto, muitas vezes com **estado privado por closure** (sem `new`).  
**Classe**: quando queres **herdar**, usar **`instanceof`** e uma API de OOP clara para a turma.

- Usa **fábricas** quando precisas de algo super rápido, sem herança e onde `this` só vai baralhar. O “estado” fica guardado em variáveis normais dentro da função.
- Usa **classes** quando precisas de comunicar explicitamente que existe um tipo, quando vais compor heranças ou quando queres aproveitar ferramentas do ecossistema que fazem `obj instanceof MinhaClasse`.
- Ambas podem ter encapsulamento: fábricas usam **closures** (variáveis internas), classes usam `#privado`. A principal diferença é mesmo o modo de criação e a possibilidade de herdar.
- Não há certo/errado - escolhe o que tornar a intenção mais clara para a tua equipa/colegas.

```js
// FÁBRICA (leve, sem herança)
function criarTermometro() {
    let c = 20;
    return {
        aquecer() {
            c++;
        },
        arrefecer() {
            c--;
        },
        get c() {
            return c;
        },
    };
}

// CLASSE (quando pedes OOP explícito)
class Termometro {
    #c = 20;
    aquecer() {
        this.#c++;
    }
    arrefecer() {
        this.#c--;
    }
    get c() {
        return this.#c;
    }
}
```

Fábricas também podem receber dependências e devolver métodos pré‑configurados, por exemplo:

```js
function criarBotao(texto, onClick) {
    return {
        texto,
        clicar() {
            onClick?.(texto);
        },
    };
}
```

Neste caso não tocamos em `new` nem precisamos de `this`. Para objetos que vivem pouco tempo ou são altamente personalizados, este estilo é mais direto. Já quando precisas de algo reutilizável com herança (`class TermometroBluetooth extends Termometro`), a classe dá-te uma fundação formal.

---

## 11) Boas práticas e armadilhas

- **Valida** dados nos **setters** ou em métodos que mudam estado.
- Usa **`#privado`** para proteger o que não deve ser alterado de fora.
- **Não abuses** da herança; **composição** é mais flexível na maioria dos casos.
- Lembra‑te do `new` ao criar instâncias (sem `new` não corre o `constructor`).
- Em callbacks, **garante** o `this` (ver §7).

---

## 12) Dicionário rápido

- **Classe**: molde/receita de como os objetos são.
- **Objeto/Instância**: “coisa” criada a partir da classe.
- **Propriedade**: dado (ex.: `nome`).
- **Método**: ação (ex.: `apresentar()`).
- **Constructor**: função especial que corre ao criar um objeto.
- **Getter/Setter**: ler/escrever com controlo/validação.
- **`#privado`**: campo só acessível dentro da classe.
- **`static`**: pertence à classe, não às instâncias.
- **Herança**: uma classe “filha” aproveita e ajusta a lógica da “mãe”.
- **Composição**: construir por peças (tem‑um).

---

## 13) Mini desafios

1. **Saudação** - cria `class Saudacao` com `mensagem` no constructor e um método `falar()` que devolve `Olá + mensagem`. Instancia duas versões e mostra o texto no `console`.

> Resolução

```js
class Saudacao {
    mensagem;
    constructor(mensagem) {
        this.mensagem = mensagem;
    }
    falar() {
        return `Olá ${this.mensagem}`;
    }
}

// Teste

const s1 = new Saudacao("Mundo");
console.log(s1.falar()); // "Olá Mundo"

const s2 = new Saudacao("Ana");
console.log(s2.falar()); // "Olá Ana"
```

---

2. **Contador simples** - cria `class Contador` com um atributo `valor = 0` e um método `incrementar()` que soma 1. Mostra o valor após três chamadas.

> Resolução

```js
class Contador {
    valor = 0;
    incrementar() {
        this.valor++;
    }
}

// Teste
const c = new Contador();
c.incrementar();
c.incrementar();
c.incrementar();
console.log(c.valor); // 3
```

---

3. **Pessoa básica** - cria `class Pessoa` com `nome` e `apresentar()`. Cria 3 pessoas e imprime as apresentações.

> Resolução

```js
class Pessoa {
    nome;
    constructor(nome) {
        this.nome = nome;
    }
    apresentar() {
        return `Olá, eu sou ${this.nome}.`;
    }
}

// Teste

const p1 = new Pessoa("João");
const p2 = new Pessoa("Maria");
const p3 = new Pessoa("Carlos");
console.log(p1.apresentar()); // "Olá, eu sou João."
console.log(p2.apresentar()); // "Olá, eu sou Maria."
console.log(p3.apresentar()); // "Olá, eu sou Carlos."
```

---

4. **Getter introdutório** - cria `class Termometro` com um campo privado `#celsius` e um getter `fahrenheit` que devolve `#celsius * 1.8 + 32`. Mostra ambos os valores.

> Resolução

```js
class Termometro {
    #celsius;
    constructor(celsius) {
        this.#celsius = celsius;
    }
    get fahrenheit() {
        return this.#celsius * 1.8 + 32;
    }
}

// Teste

const t = new Termometro(25);
console.log(`Fahrenheit: ${t.fahrenheit}`); // 77
```

Podemos fazer um getter para os celsius também:

```js
get celsius() {
    return this.#celsius;
}
```

Depois podemos aceder a ambos:

```js
console.log(`Celsius: ${t.celsius}`); // 25
console.log(`Fahrenheit: ${t.fahrenheit}`); // 77
```

---

5. **Setter introdutório** - cria `class Produto` com `#preco` e um setter `preco` que rejeita valores negativos (lança `RangeError`). Usa o getter correspondente para ler o valor atual.

> Resolução

```js
class Produto {
    #preco = 0;
    get preco() {
        return this.#preco;
    }
    set preco(v) {
        if (v < 0) {
            throw new RangeError("Preço não pode ser negativo.");
        }
        this.#preco = v;
    }
}

// Teste

const p = new Produto();

try {
    p.preco = 50; // usa o setter
    console.log(p.preco); // usa o getter → 50
    p.preco = -10; // força erro
} catch (e) {
    console.log(e.message);
}
```

---

6. **Validação** - cria `class Aluno` com `#nota` e um `set nota(v)` que só aceita 0–20 (lança `RangeError` caso contrário).

> Resolução com nome e nota

```js
class Aluno {
    nome;
    #nota = 0;
    constructor(nome, nota) {
        this.nome = nome;
        this.nota = nota; // usa o setter
    }
    get nota() {
        return this.#nota;
    }
    set nota(v) {
        if (typeof v !== "number" || v < 0 || v > 20) {
            throw new RangeError("Nota inválida (0–20).");
        }
        this.#nota = v;
    }
}
// Teste
const aluno = new Aluno("Pedro", 15);
console.log(aluno.nome, aluno.nota); // Pedro 15
try {
    aluno.nota = 25; // força erro
} catch (e) {
    console.log(e.message); // "Nota inválida (0–20)."
}
```

---

7. **Turma de alunos** - cria `class Turma` que guarda um array privado de `Aluno`. Adiciona método `adicionarAluno(aluno)` (verifica se é instância de `Aluno`), `media()` e `aprovados()` (nota ≥ 10).

> Resolução

```js
class Turma {
    #alunos = [];
    adicionarAluno(aluno) {
        if (!(aluno instanceof Aluno)) {
            throw new TypeError("Preciso de um Aluno.");
        }
        this.#alunos.push(aluno);
    }
    media() {
        if (this.#alunos.length === 0) return 0;
        const soma = this.#alunos.reduce((acc, aluno) => acc + aluno.nota, 0);
        /*
        Sem usar o reduce: 
        let soma = 0;
        for (const aluno of this.#alunos) {
            soma += aluno.nota;
        }

        */
        return Math.round((soma / this.#alunos.length) * 10) / 10;
    }
    aprovados() {
        return this.#alunos.filter((aluno) => aluno.nota >= 10);
    }
}

// Teste

const turma = new Turma();
turma.adicionarAluno(new Aluno("Ana", 18));
turma.adicionarAluno(new Aluno("Bruno", 9));
console.log("Média:", turma.media()); // 13.5
// Aprovados mais organizado e bonito do género:

// Aluno: nota

console.log(
    "Aprovados:",
    turma.aprovados().map((a) => `${a.nome}: ${a.nota}`),
);
```

---

8. **Escola** - cria `class Escola` que tem várias `Turma`. Adiciona método `adicionarTurma(turma)` e `mediaGeral()` que calcula a média de todas as turmas.

> Resolução

```js
class Escola {
    #turmas = [];
    adicionarTurma(turma) {
        if (!(turma instanceof Turma)) {
            throw new TypeError("Preciso de uma Turma.");
        }
        this.#turmas.push(turma);
    }
    // Média geral sem reduce
    mediaGeral() {
        if (this.#turmas.length === 0) return 0;
        let soma = 0;
        let totalAlunos = 0;
        for (const turma of this.#turmas) {
            for (const aluno of turma.#alunos) {
                soma += aluno.nota;
                totalAlunos++;
            }
        }
        return Math.round((soma / totalAlunos) * 10) / 10;
    }
    // Média geral sem reduce e usando a função media() da Turma
    /*
    mediaGeral() {
        if (this.#turmas.length === 0) return 0;
        let soma = 0;
        let totalAlunos = 0;
        for (const turma of this.#turmas) {
            soma += turma.media() * turma.#alunos.length;
            totalAlunos += turma.#alunos.length;
        }
        return Math.round((soma / totalAlunos) * 10) / 10;
    }
    */
}

// Teste

const escola = new Escola();
const turma1 = new Turma();
turma1.adicionarAluno(new Aluno("Ana", 18));
turma1.adicionarAluno(new Aluno("Bruno", 9));
const turma2 = new Turma();
turma2.adicionarAluno(new Aluno("Carla", 15));
turma2.adicionarAluno(new Aluno("David", 12));
escola.adicionarTurma(turma1);
escola.adicionarTurma(turma2);
console.log("Média Geral:", escola.mediaGeral()); // 13.5
```

---

9. **Cria um cronómetro (timer)**  
   **Enunciado**: Vais construir um **cronómetro** que conta segundos. No fim, deves conseguir **iniciar**, **parar** e **consultar** o tempo. O objetivo é praticar `setInterval`, getters e campos privados.

**Explicação curta (setInterval)**  
`setInterval` repete uma função a cada X milissegundos.  
Exemplo: contar segundos de 1 em 1 segundo.

```js
let s = 0;
const id = setInterval(() => {
    s++;
    console.log("segundos:", s);
}, 1000);

// parar quando já não precisas
clearInterval(id);
```

Repara que o setInterval recebe uma arrow function que é chamada repetidamente. A isto chamamos um callback.

**Passos**

1. Cria `class Cronometro`.
2. Campo privado `#segundos = 0`.
3. Campo privado `#id = null` para guardar o intervalo.
4. Método `iniciar()` que começa a contar 1 em 1 segundo.
5. Método `parar()` que faz `clearInterval`.
6. Getter `segundos` para ler o valor atual.

> Resolução

```js
class Cronometro {
    #segundos = 0;
    #id = null;

    iniciar() {
        if (this.#id !== null) return; // já está a contar
        this.#id = setInterval(() => {
            this.#segundos++;
        }, 1000);
    }

    parar() {
        if (this.#id !== null) {
            clearInterval(this.#id);
            this.#id = null;
        }
    }

    get segundos() {
        return this.#segundos;
    }
}

// teste
const cron = new Cronometro();
// Pedir ao user quantos segundos quer com prompt e Number:
let tempo = Number(prompt("Quantos segundos queres contar?"));
cron.iniciar();
setTimeout(() => {
    cron.parar();
    console.log(`Contaste ${cron.segundos} segundos.`);
}, tempo * 1000);
```

---

10. **Conta bancária (com validação simples)**  
    **Enunciado**: Cria uma conta com saldo privado. A conta deve permitir **depositar**, **levantar** e **consultar** o saldo, mas nunca deve permitir levantar mais do que existe.

**Explicação curta**  
Validar dados evita estados inválidos (ex.: saldo negativo sem querer).

**Passos**

1. Cria `class ContaBancaria` com `#saldo = 0`.
2. `depositar(valor)` só aceita `valor > 0`.
3. `levantar(valor)` só permite se houver saldo suficiente.
4. Getter `saldo` para consultar.

**Teste mínimo**

```js
const conta = new ContaBancaria();
conta.depositar(50);
conta.levantar(20);
console.log(conta.saldo); // 30
```

> Resolução

```js
class ContaBancaria {
    #saldo = 0;
    depositar(valor) {
        if (valor <= 0) throw new RangeError("Valor inválido.");
        this.#saldo += valor;
    }
    levantar(valor) {
        if (valor <= 0 || valor > this.#saldo)
            throw new RangeError("Saldo insuficiente.");
        this.#saldo -= valor;
    }
    get saldo() {
        return this.#saldo;
    }
}

// Teste com try

const conta = new ContaBancaria();
try {
    conta.depositar(50);
    conta.levantar(20);
    console.log(conta.saldo); // 30
    conta.levantar(40); // força erro
} catch (e) {
    console.log(e.message); // "Saldo insuficiente."
}
```

---

11. **`this` em callbacks (lista formatada)**  
    **Enunciado**: Vais criar um objeto que **acrescenta um prefixo** a palavras.

    Por exemplo, com prefixo `"Olá, "` e palavra `"Ana"`, o resultado é `"Olá, Ana"`.

    Depois vais usar esse método num `map` para formatar várias palavras que se encontram num array.

**Passos**

1. Cria `class Prefixador` com `prefixo`.
2. Cria o método `formatar(texto)` que devolve `prefixo + texto`.
3. Usa `map` num array de palavras.
4. Garante o `this` com `bind` ou com método em arrow.

O que é o `bind`? Consulta o capitulo 7, sobre `this` em callbacks. Mas aqui fica um resumo rápido:

- `bind(this)` cria uma nova função com o `this` fixo. Ou seja, mesmo que a função seja chamada fora do contexto original, o `this` continua a apontar para o objeto correto.

> Resolução

```js
class Prefixador {
    prefixo;
    constructor(prefixo) {
        this.prefixo = prefixo;
        // Opção A: bind no constructor
        this.formatar = this.formatar.bind(this);
    }
    // Opção B: método como arrow function (descomenta esta linha e comenta a anterior)
    /*
    formatar = (texto) => {
        return this.prefixo + texto;
    };
    */
    formatar(texto) {
        return this.prefixo + texto;
    }
}

// Teste
const p = new Prefixador("Olá, ");
const nomes = ["Ana", "Bruno", "Carla"];
const formatados = nomes.map(p.formatar); // sem bind, rebenta
console.log(formatados); // ["Olá, Ana", "Olá, Bruno", "Olá, Carla"]
```

---

12. **Método privado (cofre)**
    **Enunciado**: Vais criar um cofre com código secreto. O código só deve ser validado **dentro** da classe, e o cofre bloqueia após 3 tentativas falhadas. O código deve ter um segredo que é revelado se o código estiver correto.

**Explicação curta**
Campos e métodos privados (`#`) escondem detalhes internos e protegem o estado.

**Passos**

1. Cria `class Cofre` com `#segredo`, `#codigo` e `#tentativas = 0`.
2. Cria método privado `#validar(c)` que devolve `true/false`.
3. Método público `abrir(c)`:
    - se acertar → `"Aberto"` e mostra o segredo.
    - se falhar → `"Código errado"`
    - após 3 falhas → `"Bloqueado"`

**Teste mínimo**

```js
const cofre = new Cofre("1234", "O tesouro está aqui!");
console.log(cofre.abrir("0000")); // Código errado
console.log(cofre.abrir("1111")); // Código errado
console.log(cofre.abrir("2222")); // Bloqueado
console.log(cofre.abrir("1234")); // Bloqueado
```

---

13. **Estáticos (conversor simples)**
    **Enunciado**: Vais criar um conversor de moedas com métodos que pertencem à **classe**, não às instâncias. O objetivo é praticar `static`.

**Explicação curta**
Métodos `static` são usados diretamente na classe, sem `new`.

**Passos**

1. Cria `class Conversor`.
2. `static eurParaUsd(valor)` e `static usdParaEur(valor)` (usa 2 taxas simples).
3. Chama direto pela classe, sem `new`.

**Teste mínimo**

```js
console.log(Conversor.eurParaUsd(10));
console.log(Conversor.usdParaEur(10));
```

---

14. **Herança (pessoas)**  
    **Enunciado**: Vais criar uma classe base `Pessoa` e uma classe `Professor` que herda dela. O objetivo é praticar `extends` e `super`.

**Explicação curta**  
Subclasses reaproveitam o que já existe na classe base.

**Passos**

1. `class Pessoa` com `nome` e `apresentar()`.
2. `class Professor extends Pessoa` com `disciplina`.
3. No `constructor`, chama `super(nome)`.
4. Reescreve `apresentar()` e reutiliza `super.apresentar()`.

**Teste mínimo**

```js
const p1 = new Professor("Ana", "Matemática");
const p2 = new Professor("Luís", "Física");
console.log(p1.apresentar());
console.log(p2.apresentar());
```

---

15. **Herança (animais)**  
    **Enunciado**: Vais criar animais com sons diferentes. O objetivo é praticar herança com valores fixos no `constructor`.

**Explicação curta**  
A classe base guarda o comportamento comum, as subclasses só ajustam detalhes.

**Passos**

1. `class Animal` com `nome`, `som` e `falar()`.
2. `class Cao` chama `super(nome, "au")`.
3. `class Gato` chama `super(nome, "miau")`.
4. Instancia um de cada e chama `falar()`.

**Teste mínimo**

```js
const cao = new Cao("Rex");
const gato = new Gato("Mimi");
console.log(cao.falar());
console.log(gato.falar());
```

---

16. **Herança (veículos)**  
    **Enunciado**: Vais criar um veículo e uma bicicleta que herda desse veículo. O objetivo é praticar sobrescrita de métodos.

**Explicação curta**  
Quando sobrescreves um método, podes chamar o original com `super.metodo()`.

**Passos**

1. `class Veiculo` com `marca` e `mover()`.
2. `class Bicicleta extends Veiculo` com `tipo`.
3. Reescreve `mover()` para incluir o tipo e chama `super.mover()`.

**Teste mínimo**

```js
const b = new Bicicleta("Trek", "BTT");
console.log(b.mover());
```

---

17. **Composição (casa/porta)**  
    **Enunciado**: Vais modelar uma casa que **tem** uma porta. O objetivo é praticar composição em vez de herança.

**Explicação curta**  
Composição significa juntar objetos: "tem-um".

**Passos**

1. `class Porta` com `aberta = false`, `abrir()` e `fechar()`.
2. `class Casa` que **tem uma** `Porta`.
3. `abrirPorta()` e `fecharPorta()` chamam a porta.

**Teste mínimo**

```js
const casa = new Casa();
casa.abrirPorta();
casa.fecharPorta();
```

---

18. **Composição (playlist)**  
    **Enunciado**: Vais criar uma playlist que guarda músicas. O objetivo é praticar composição e validação com `instanceof`.

**Explicação curta**  
A playlist **tem** várias músicas, não é uma música.

**Passos**

1. `class Musica` com `titulo`.
2. `class Playlist` com array privado e `adicionar(musica)` com `instanceof`.
3. `listar()` devolve só os títulos.

**Teste mínimo**

```js
const p = new Playlist();
p.adicionar(new Musica("Tema 1"));
p.adicionar(new Musica("Tema 2"));
console.log(p.listar());
```

---

19. **Composição (carro/motor)**  
    **Enunciado**: Vais criar um carro que controla um motor interno. O objetivo é praticar delegação de responsabilidades.

**Explicação curta**  
O carro expõe métodos que chamam o motor.

**Passos**

1. `class Motor` com `ligado = false`, `ligar()` e `desligar()`.
2. `class Carro` cria `this.motor = new Motor()` no `constructor`.
3. `ligar()` e `desligar()` chamam o motor.
4. Getter `estado` devolve se o motor está ligado.

**Teste mínimo**

```js
const carro = new Carro();
carro.ligar();
console.log(carro.estado); // true
carro.desligar();
console.log(carro.estado); // false
```

---

20. **JSON (esconder dados privados)**  
    **Enunciado**: Vais controlar o que aparece em `JSON.stringify`. O objetivo é praticar `toJSON()` e proteger dados privados.

**Explicação curta**  
`JSON.stringify` usa `toJSON()` se existir.

**Passos**

1. Na `class Aluno`, cria `toJSON()` que devolve `{ nome, turma }`.
2. Cria um aluno e usa `JSON.stringify(aluno)`.
3. Confirma que `#nota` não aparece.

**Teste mínimo**

```js
const a = new Aluno("Inês", 16);
a.turma = "11.º A";
console.log(JSON.stringify(a)); // {"nome":"Inês","turma":"11.º A"}
```

---

21. **Fábrica x Classe (estado isolado)**  
    **Enunciado**: Vais comparar dois estilos: **fábrica** com closure e **classe** com campos privados. O objetivo é perceber como cada instância mantém o seu próprio estado.

**Explicação curta**  
Fábricas usam variáveis internas; classes usam `#privado`.

**Passos**

1. `criarContador()` devolve `{ inc(), valor() }` e usa `let n = 0`.
2. `class Contador` com `#n`, `inc()` e `get valor()`.
3. Cria **duas instâncias** de cada e confirma que não misturam o estado.

**Teste mínimo**

```js
const c1 = criarContador();
const c2 = criarContador();
c1.inc();
console.log(c1.valor(), c2.valor()); // 1, 0

const k1 = new Contador();
const k2 = new Contador();
k1.inc();
console.log(k1.valor, k2.valor); // 1, 0
```

---

22. **Fatura profissional (get/set com regras reais)**  
    **Enunciado**: Vais criar uma classe `Fatura` com regras reais de negócio. O objetivo é treinar getters/setters que **calculam**, **validam**, **normalizam** e **disparam efeitos colaterais**.

**Explicação curta**  
Getters parecem propriedades mas executam cálculos; setters permitem validar antes de guardar.

**Requisitos**

- `itens` (array de `{ descricao, qtd, precoUnit }`)
- `estado` (`"RASCUNHO" | "EMITIDA" | "PAGA"`)
- `descontoPct`, `nifCliente`, `emitidaEm`, `pagaEm`, `atualizadoEm`

**Getters**

- `subtotal` -> soma dos itens (`qtd * precoUnit`)
- `total` -> subtotal - desconto + IVA (23%), arredondado a 2 casas
- `podeEditar` -> `true` apenas se `estado === "RASCUNHO"`
- `resumo` -> string pronta para UI/relatório (ex.: "Fatura #X - TOTAL: YEUR - ESTADO: Z")

**Setters**

- `descontoPct(v)` -> valida 0-20; só permite se `estado === "RASCUNHO"`; atualiza `atualizadoEm`
- `estado(v)` -> só permite transições `RASCUNHO -> EMITIDA -> PAGA`; ao mudar:
    - se `EMITIDA`, define `emitidaEm = new Date()`
    - se `PAGA`, define `pagaEm = new Date()`
    - atualiza `atualizadoEm`
- `nifCliente(v)` -> normaliza (remove espaços/pontos) e valida 9 dígitos

**Teste mínimo**  
Cria uma fatura, adiciona itens, altera desconto, emite e paga, e mostra `total` e `resumo`.

---

23. **Projeto completo** — Sistema de Gestão de Utilizadores (OOP)

**Objetivo:** criar um sistema de gestão de utilizadores usando classes em JavaScript. Deves aplicar **encapsulamento**, **herança**, **composição**, **abstração** e **polimorfismo**. O sistema deve permitir criar diferentes tipos de utilizadores e gerir permissões e ações.

**Requisitos obrigatórios**

**1) Abstração (classe base)**

- Cria uma classe **abstrata** `Utilizador`.
- Deve ter:
    - `#id`, `#email`, `#password`, `#ativo`, `#criadoEm` (privados)
    - `nome` (público)
- O `constructor` deve **impedir instanciação direta** de `Utilizador` (ex.: lançar `Error`).
- Métodos:
    - `get id()`, `get email()`, `set email(v)` (valida formato)
    - `set password(v)` (mínimo 6 caracteres)
    - `get ativo()`, `desativar()`, `ativar()`
    - `resumo()` (método a **sobrescrever** nas subclasses)

**2) Herança**

- Cria subclasses:
    - `Admin`
    - `Moderador`
    - `Visitante`
- Cada subclasse deve:
    - Definir um `role` próprio
    - Sobrescrever `resumo()` para devolver uma frase diferente (polimorfismo)

**3) Composição**

- Cria uma classe `Perfil` com:
    - `bio`, `avatarUrl`, `website` (com validação simples)
- Cada `Utilizador` deve **ter um Perfil** (composição).

**4) Permissões**

- Cria uma classe `Permissao` com:
    - `acao` (ex.: `"criar_post"`, `"apagar_utilizador"`)
- `Admin` tem todas as permissões.
- `Moderador` tem permissões específicas (pelo menos 2).
- `Visitante` tem permissões mínimas.
- Implementa `pode(acao)` em `Utilizador` e **sobrescreve** conforme o tipo (polimorfismo).

**5) Gestão central**

- Cria uma classe `SistemaUtilizadores` que:
    - Guarda um array privado `#utilizadores`.
    - Métodos:
        - `adicionar(user)` (valida tipo)
        - `removerPorId(id)`
        - `listarAtivos()`
        - `buscarPorEmail(email)`
        - `contarPorRole(role)`

**6) Estáticos**

- Em `Utilizador`, cria um método `static validarEmail(email)`.

**Requisitos de teste (mínimo)**

- Cria pelo menos:
    - 1 `Admin`, 1 `Moderador`, 1 `Visitante`
- Mostra:
    - `resumo()` de cada um (polimorfismo)
    - Pelo menos 3 verificações com `pode(acao)`
    - Uso de `SistemaUtilizadores` (adicionar, remover, listar, contar)

**Extra (opcional)**

- Implementa `toJSON()` em `Utilizador` para não expor `#password`
- Cria logs de ações no sistema (ex.: `#logs`)

### Repetição espaçada (revisão rápida)

- Hoje: explica a diferença entre classe e instância com um exemplo simples.
- Amanhã: reescreve o exercício 14 sem olhar.
- Em 1 semana: refaz o exercício 17 e explica porque é composição.
- Em 1 mês: repete os exercícios 9 e 11 e justifica o `this` e os timers.

## 14) Resumo final

- **Classe** = molde; **objeto** = instância do molde.
- **Encapsula** com `#privado` e valida com **getters/setters**.
- Usa **`static`** para utilitários e informação da classe.
- **Herança** só quando for claramente “**é‑um**”; caso contrário, **composição**.
- Cuida do **`this`** quando passares métodos como callbacks.

## Changelog

- **v1.7.0 - 2026-01-19**
    - Atualização e expansão dos Mini desafios (1–21) + repetição espaçada.
    - Normalização de naming (ContaBancaria).
    - Reforço do strict mode nas classes (`this` indefinido em callbacks).
    - Nota sobre hoisting de classes.
    - Callout de timers com referência ao cap. 15.
- **v1.6.0 - 2025-11-18**
    - Simplificação de conceitos
- **v1.5.0 - 2025-11-16**
    - Incluído estudo guiado “Turma” combinando herança, encapsulamento e composição.
    - Secção sobre `this` em callbacks agora cobre também arrow functions como classe field.
    - Mais contexto introdutório e notas sobre valores por defeito no `constructor`.
- **v1.4.0 - 2025-11-10**
    - Adicionados dois desafios introdutórios específicos para getters e setters antes do exercício de validação.
- **v1.3.0 - 2025-11-10**
    - Mini desafios reorganizados para começarem com exercícios muito simples e progressivos (Saudação e Contador) antes dos tópicos avançados.
- **v1.2.0 - 2025-11-10**
    - Mini desafios simplificados para focar em padrões básicos (classes, getters/setters, estáticos e herança direta).
- **v1.1.0 - 2025-11-10**
    - Secção de desafios renomeada para Mini desafios para reforçar o caráter avançado.
    - Adicionado changelog inicial para registar futuras alterações no capítulo.

```

```
