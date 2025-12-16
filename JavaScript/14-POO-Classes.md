# [14] Classes e OOP (11.º ano)

> **Objetivo**: entender, com linguagem simples e muitos exemplos, o que são **classes** e **objetos** em JavaScript, como usar **constructor**, **métodos**, **getters/setters**, **campos privados `#`**, **métodos/variáveis estáticas**, **herança (`extends/super`)**, e quando faz sentido **preferir composição**. No fim tens desafios para praticar.

---

## 0) Classes: molde → objeto

-   **Classe**: Pensa numa receita ou molde (ex.: **bolo**). Define como são os objetos (ex.: **ingredientes** e **passos**).
-   **Objeto (instância)**: o **bolo** feito a partir do molde / receita. Cada bolo tem os **seus próprios valores**.
-   **Propriedades** = dados (ex.: `nome`, `idade`). **Métodos** = ações (ex.: `apresentar()`).
-   Em JavaScript, **classes** são uma forma prática de escrever algo que por baixo funciona com **protótipos** (vamos ver mais tarde).
-   Este capítulo assume que já dominas **objetos e `this`** (capítulo 8) e **funções** (capítulos 10/11). Se o `this` ainda causar estranheza, guarda em mente a §7 para um refresco enquanto fores lendo.
-   Lembra-te: uma classe **não é magia nova**; é apenas uma forma organizada de juntar dados + comportamento que já usaste.

---

## 1) A tua primeira classe

```js
class Pessoa {
    // (opcional) campos declarados aqui ajudam a ver o que existe
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

-   `new` cria um **novo objeto** e corre o `constructor`.
-   `this` dentro dos métodos da classe refere‑se ao **objeto atual**. O `this`é um “atalho” para o objeto e é um dos principais conceitos de OOP pois permite associar o objeto aos seus dados e comportamentos.
-   Podes definir **valores por defeito** para propriedades logo na classe (`idade = 18;`) ou nos parâmetros do `constructor` (`constructor(nome, idade = 18)`).
-   Se não precisares de um `constructor` personalizado, podes omitir; o JavaScript cria um vazio (`constructor() {}`) automaticamente.

---

## 2) Controlar acesso: getters e setters

Às vezes, antes de **guardar** um valor, queremos **validar** ou definir como e em que condições pode ser acedido. Para isso, usamos `get` e `set`.

-   `get` define um **método de leitura**.
-   `set` define um **método de escrita**.

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
```

> Usamos o # no `set` em `this.#nota` para indicar que é um campo privado (ver §3).

**Ideia**: o **setter** bloqueia valores errados e o **getter** expõe o valor com segurança.

Um exemplo mais pratico e útil:

```js
class Conta_Bancaria {
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

-   Um campo que começa por `#` é **privado**: **só** pode ser usado dentro da própria classe.
-   Ajuda a **proteger o estado** de alterações acidentais.

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
```

> Em JS **não existe** o modificador “protegido” (protected). Se precisares que subclasses interajam, expõe **métodos públicos** específicos em vez de abrir o estado.

> Se precisares **MESMO** de algo acessível só dentro da classe e subclasses, considera usar **WeakMap** ou **Symbol** (avançado, não é comum).

---

## 4) Métodos e campos **estáticos** (da classe, não do objeto)

-   `static` vive na **classe**, não nas instâncias. Útil para **constantes** e **utilitários** comuns.

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

-   Tem de chamar `super(...)` antes de usar `this` no `constructor`.
-   Podes chamar `super.metodo()` para **reaproveitar** lógica da classe‑pai.

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

-   **Herança**: quando a subclasse **cumpre o contrato** da classe‑base.
-   **Composição**: quando queres **juntar capacidades** sem criar uma árvore de heranças difícil de manter.

---

## 7) `this` em classes e callbacks

-   Dentro de um **método**, `this` é a **instância**.
-   O valor de `this` é **dinâmico**: depende de **quem chama** a função. Quando fazemos `inst.metodo()`, o `this` aponta para `inst`, mas se guardarmos uma referência `const ref = inst.metodo; ref();`, o `this` deixa de apontar para a instância e passa a ser `undefined` (modo estrito) ou `window`/`globalThis`.
-   Ao passar métodos como **callback** (eventos do DOM, `setTimeout`, `map`, listeners de Node.js...), essa mudança de contexto acontece automaticamente — daí “perdermos” o `this`.

```js
class Contador {
    valor = 0;
    incrementar() {
        this.valor++;
    }
}
const contador = new Contador();
const botao = document.querySelector("button");
// BUG: dentro de incrementar, this === botao
botao.addEventListener("click", contador.incrementar);
```

### Manter o `this` com `bind`

`Function.prototype.bind` cria uma **nova função** onde o `this` fica preso ao valor que indicarmos. Assim podemos continuar a partilhar o mesmo método no protótipo sem perder o contexto.

```js
botao.addEventListener("click", contador.incrementar.bind(contador));
```

> Lembra-te: `bind` não executa a função — apenas devolve outra função com o `this` definido. Se quiseres executar na hora, usa `metodo.call(instancia, arg1, arg2)` ou `metodo.apply(instancia, [arg1, arg2])`.

### Fazer `bind` no `constructor`

Para não repetires `bind` sempre que adicionas o listener, cria a versão “presa” assim que a instância nasce:

```js
class Botao {
    constructor(elemento) {
        this.elemento = elemento;
        this.handleClick = this.handleClick.bind(this); // prende o this uma vez
        this.elemento.addEventListener("click", this.handleClick);
    }
    handleClick() {
        console.log("this é a instância:", this);
    }
}
```

### Arrow functions como campos de classe

Outra abordagem é declarar o método como propriedade usando uma **arrow function**. Arrow functions **não criam um `this` próprio**; herdam o `this` do contexto exterior (a instância), logo o método mantém sempre o contexto correto.

```js
class Botao {
    constructor(elemento) {
        this.elemento = elemento;
        this.elemento.addEventListener("click", this.handleClick);
    }
    handleClick = () => {
        console.log("this aponta sempre para a instância.");
    };
}
```

**Desvantagem**: cada instância recebe a **sua própria cópia** da função arrow. Em cenários com milhares de instâncias, podes preferir o `bind` para manter uma única função partilhada.

> Regra rápida: se um método vai ser passado como callback, define-o como arrow (`metodo = () => { ... }`) ou faz `bind` no `constructor`. Assim o `this` não se perde e evitas bugs difíceis de detetar.

---

## 8) Estudo guiado: sistema simples de alunos

Vamos juntar vários conceitos num mini‑projeto. Objetivo: gerir uma turma com alunos, validar notas e calcular média/aprovados.

1. **Classe base (`Pessoa`)** — só guarda nome e apresenta.

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

2. **Subclasse (`Aluno`)** — herda de `Pessoa`, adiciona nota privada + validação (get/set).

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

3. **Classe compositora (`Turma`)** — possui um array privado com alunos e métodos utilitários.

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
            }))
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
    turma.aprovados().map((a) => a.nome)
);
```

Este exemplo mostra:

-   Herança (`Aluno extends Pessoa`).
-   Encapsulamento (`#nota`, `#alunos`).
-   Validação com setters.
-   Composição (Turma **tem** Alunos).
-   Uso de métodos utilitários de array vistos no capítulo 11.

Usa-o como referência para os teus próprios projetos: define a classe base, cria subclasses quando fizer sentido e encapsula coleções em classes “gestoras”.

---

## 9) JSON e classes (nota útil)

-   Converter para JSON **não inclui** métodos nem campos privados. Normalmente só os **dados públicos** são serializados.
-   Se precisares, cria um método que devolve um **objeto simples** pronto para `JSON.stringify`:

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

Há duas formas populares de criar objetos reutilizáveis:

-   **Fábricas**: funções normais que devolvem objetos. Aproveitam **closures** para guardar estado privado sem `#` e não precisam de `new`.
-   **Classes**: sintaxe dedicada a OOP. Funcionam com `new`, suportam `extends`, `instanceof`, campos privados `#`, `static`, etc.

### Como pensar em fábricas

```js
function criarTermometro() {
    let c = 20; // variável privada dentro da closure
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
const t1 = criarTermometro();
const t2 = criarTermometro();
```

-   Cada chamada cria **novas funções** e um novo “pacote” de variáveis privadas (`c`).
-   Útil quando queres algo muito simples, rápido de escrever e não precisas de herança ou `new`.
-   Dá jeito quando estás a criar utilitários e queres evitar `this`. Lembra-te de que métodos definidos dentro da fábrica **não partilham protótipo**, logo o custo de memória é um pouco superior (cada instância tem as suas funções).

### Como pensar em classes

```js
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
const t1 = new Termometro();
const t2 = new Termometro();
```

-   Métodos no corpo da classe vivem no **protótipo**, logo todas as instâncias partilham o mesmo código (mais eficiente quando crias muitas).
-   Podes usar `extends`, `super`, `static`, `instanceof` e integrar melhor com bibliotecas que esperam classes.
-   O `#c` privado só funciona com classes; se precisares de compatibilidade com código muito antigo, fábricas com closure são alternativa.

### Quando usar cada uma?

-   **Fábricas** brilham quando: queres encapsular estado de forma rápida, preferes evitar `this`, vais devolver objetos muito flexíveis (ex.: opções para uma função) ou precisas de algo configurável antes de criar o objeto final (fábricas que devolvem outras fábricas).
-   **Classes** brilham quando: o modelo mental “molde → instância” faz sentido, vais criar várias instâncias, precisas de herança, tens de verificar `obj instanceof Tipo`, ou queres expor uma API familiar a quem já aprendeu OOP.

> Dica de exame/entrevista: fábricas são funções, por isso não precisas de `new`. Se esqueceres do `new` numa classe (`Termometro()`), o `this` fica `undefined` e rebenta; numa fábrica nada de mal acontece.

Em aplicações reais podes até **combinar** ambas. Ex.: uma classe `Jogador` pode receber objetos criados por fábricas (`criarInventario()`), ou podes expor uma fábrica `criarPessoa()` que internamente faz `return new Pessoa(...)` para esconder detalhes de implementação.

---

## 11) Boas práticas e armadilhas

-   **Valida** dados nos **setters** ou em métodos que mudam estado.
-   Usa **`#privado`** para proteger o que não deve ser alterado de fora.
-   **Não abuses** da herança; **composição** é mais flexível na maioria dos casos.
-   Lembra‑te do `new` ao criar instâncias (sem `new` não corre o `constructor`).
-   Em callbacks, **garante** o `this` (ver §7).

---

## 12) Dicionário rápido

-   **Classe**: molde/receita de como os objetos são.
-   **Objeto/Instância**: “coisa” criada a partir da classe.
-   **Propriedade**: dado (ex.: `nome`).
-   **Método**: ação (ex.: `apresentar()`).
-   **Constructor**: função especial que corre ao criar um objeto.
-   **Getter/Setter**: ler/escrever com controlo/validação.
-   **`#privado`**: campo só acessível dentro da classe.
-   **`static`**: pertence à classe, não às instâncias.
-   **Herança**: uma classe “filha” aproveita e ajusta a lógica da “mãe”.
-   **Composição**: construir por peças (tem‑um).

---

## 13) Mini desafios

1. **Saudação** — cria `class Saudacao` com `mensagem` no constructor e um método `falar()` que devolve `Olá + mensagem`. Instancia duas versões e mostra o texto no `console`.
2. **Contador simples** — cria `class Contador` com uma propriedade `valor = 0` e um método `incrementar()` que soma 1. Mostra o valor após três chamadas.
3. **Pessoa básica** — cria `class Pessoa` com `nome` e `apresentar()`. Cria 3 pessoas e imprime as apresentações.
4. **Getter introdutório** — cria `class Termometro` com um campo privado `#celsius` e um getter `fahrenheit` que devolve `#celsius * 1.8 + 32`. Mostra ambos os valores.
5. **Setter introdutório** — cria `class Produto` com `#preco` e um setter `preco` que rejeita valores negativos (lança `RangeError`). Usa o getter correspondente para ler o valor atual.
6. **Validação** — cria `class Aluno` com `#nota` e um `set nota(v)` que só aceita 0–20 (lança `RangeError` caso contrário).
7. **Conta bancária** — implementa `depositar`, `levantar` e `get saldo`; lança erro se tentar levantar mais do que o saldo.
8. **Estáticos** — cria `class Conversor` com `static eurParaUsd(valor)` e `static usdParaEur(valor)` e usa-os em dois exemplos.
9. **Herança** — `class Pessoa` → `class Professor` (com `disciplina`). Sobrepõe `apresentar()` para incluir a disciplina mas chama `super.apresentar()`.
10. **Composição** — `class Relogio` que usa internamente `setInterval` para contar segundos e expõe `iniciar()`, `parar()` e `get segundos`.
11. **JSON** — adiciona `toJSON()` a `class Aluno` para devolver `{ nome, turma }` e confirma com `JSON.stringify` que só esses campos aparecem.
12. **Fábrica x Classe** — escreve uma função `criarContador()` (fábrica) e `class Contador`. Usa ambos para mostrar que guardam estado.

## 14) Resumo final

-   **Classe** = molde; **objeto** = instância do molde.
-   **Encapsula** com `#privado` e valida com **getters/setters**.
-   Usa **`static`** para utilitários e informação da classe.
-   **Herança** só quando for claramente “**é‑um**”; caso contrário, **composição**.
-   Cuida do **`this`** quando passares métodos como callbacks.

## Changelog

-   **v1.5.0 — 2025-11-18**
    -   Incluído estudo guiado “Turma” combinando herança, encapsulamento e composição.
    -   Secção sobre `this` em callbacks agora cobre também arrow functions como classe field.
    -   Mais contexto introdutório e notas sobre valores por defeito no `constructor`.
-   **v1.4.0 — 2025-11-10**
    -   Adicionados dois desafios introdutórios específicos para getters e setters antes do exercício de validação.
-   **v1.3.0 — 2025-11-10**
    -   Mini desafios reorganizados para começarem com exercícios muito simples e progressivos (Saudação e Contador) antes dos tópicos avançados.
-   **v1.2.0 — 2025-11-10**
    -   Mini desafios simplificados para focar em padrões básicos (classes, getters/setters, estáticos e herança direta).
-   **v1.1.0 — 2025-11-10**
    -   Secção de desafios renomeada para Mini desafios para reforçar o caráter avançado.
    -   Adicionado changelog inicial para registar futuras alterações no capítulo.
