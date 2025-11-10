# [13] Classes e OOP moderno (constructor, métodos, getters/setters, `#privado`, `static`, `extends`, composição)

> **Objetivo**: dominar a sintaxe moderna de **classes** em JavaScript, perceber como funcionam **por baixo** (protótipos), usar **encapsulamento** (campos privados), **métodos estáticos**, **herança** com `extends/super`, e saber quando **preferir composição**. Inclui exemplos e exercícios.

---

## 1) Porque usar classes?

-   Para **modelar entidades** do teu domínio (Aluno, Conta, Produto), com **estado** (propriedades) e **comportamento** (métodos).
-   Melhor **organização** e **reutilização** de código, com regras claras de **acesso**.
-   Em JS, _classes são açúcar sintático_ sobre **funções construtoras + protótipos** (ver §7).

---

## 2) Anatomia de uma classe

```js
class Pessoa {
    // Campos de instância (iniciais)
    nome; // público
    #idade; // privado (apenas dentro da classe)
    static especie = "Homo sapiens"; // campo estático (na classe, não na instância)

    constructor(nome, idade) {
        this.nome = nome;
        this.#idade = idade; // usa o campo privado
    }

    // Método de instância
    apresentar() {
        return `Olá, sou ${this.nome} e tenho ${this.#idade} anos.`;
    }

    // Getter/Setter (controlam acesso e validam)
    get idade() {
        return this.#idade;
    }
    set idade(v) {
        if (v < 0 || v > 130) throw new RangeError("Idade inválida");
        this.#idade = v;
    }

    // Método estático (utilitário relacionado com a classe)
    static compararPorIdade(a, b) {
        return a.#idade - b.#idade;
    }
}

const ana = new Pessoa("Ana", 20);
console.log(ana.apresentar()); // "Olá, sou Ana ..."
console.log(Pessoa.especie); // "Homo sapiens" (na classe)
console.log([ana].sort(Pessoa.compararPorIdade));
```

**Ideias-chave**

-   **Campos privados** começam por `#` e **só** são visíveis dentro da classe.
-   **`static`** vive na **classe**, não nas instâncias (ex.: `Pessoa.especie`).

---

## 3) Encapsulamento (proteger o estado)

-   Usa **`#privado`** para impedir acessos diretos indesejados.
-   Usa **getters/setters** para validar e expor uma API controlada.
-   Podes também criar **métodos privados** com `#`:

```js
class Conta {
    #saldo = 0;
    #registar(op, valor) {
        /* guardar log internamente */
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
    }
}
```

> **“Protected” em JS?** Não existe um modificador nativo “protegido” (acessível às subclasses). Tens duas abordagens:
>
> 1. **Convenção**: prefixo `_campo` para “não toques fora/subclasses”.
> 2. **API controlada**: mantém `#privado` e expõe **métodos públicos** para o que as subclasses precisam (preferível).

---

## 4) Campos e métodos estáticos

-   **Campos/Métodos estáticos** pertencem à **classe** (não às instâncias).
-   Úteis para **constantes**, **fábricas** e **utilitários**.

```js
class Util {
    static PI = 3.14159;
    static clamp(v, min, max) {
        return Math.min(max, Math.max(min, v));
    }
}
console.log(Util.PI, Util.clamp(10, 0, 5)); // 3.14159 5
```

**Campo estático privado**

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
        super(nome); // chama o constructor da superclasse
        this.turma = turma;
    }
    apresentar() {
        // override (sobreposição)
        return `${super.apresentar()} e estou na turma ${this.turma}`;
    }
}

const c = new Aluno("Carla", "11.º IG");
console.log(c.apresentar());
```

**Notas**

-   Chama `super(...)` no `constructor` **antes** de usar `this` (obrigatório).
-   `super.metodo()` permite **reutilizar** lógica do pai no override.
-   **Polimorfismo**: podes tratar `Aluno` como `Pessoa` quando só precisas da interface do pai.

---

## 6) Composição vs Herança (regra prática)

> **Prefere composição** quando queres **partilhar capacidades** sem “é‑um” rígido.

-   **Herança** modela **“é‑um”** (Aluno **é uma** Pessoa).
-   **Composição** modela **“tem‑um”** (Relógio **tem um** Temporizador).

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

**Quando herdar?** Só se a subclasse **cumpre o contrato** do pai (princípio de substituição). Se começas a pôr muitos `if (this instanceof ...)`, é sinal de composição.

---

## 7) Como classes funcionam por baixo (protótipos)

-   Uma classe cria **função construtora** e define métodos em **`Nome.prototype`**.
-   As instâncias ligam‑se a esse **protótipo**; ao aceder a um método, o JS procura na instância e depois no protótipo.

```js
class X {
    m() {
        return 1;
    }
}
const x = new X();
console.log(Object.getPrototypeOf(x) === X.prototype); // true
console.log(x.m === X.prototype.m); // true
```

**Vantagem**: 1 cópia do método é partilhada por todas as instâncias (memória eficiente).

---

## 8) `this` em classes + binding de callbacks

-   Em métodos de instância, `this` é a **instância**.
-   Se passares o método como **callback**, podes **perder** o `this` (como em objetos).

**Soluções comuns**

1. **`bind`** no `constructor` (padrão clássico):

```js
class Botao {
    constructor() {
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        /* this é a instância */
    }
}
```

2. **Class fields + arrow** (padrão moderno):

```js
class Botao {
    handleClick = (e) => {
        /* this é a instância (capturado lexicalmente) */
    };
}
```

> Em projetos atuais (browser/Node recentes), a opção 2 é comum e prática.

---

## 9) Fábricas vs Classes (quando escolher)

**Fábrica com closure** (sem `new`, sem protótipos; estado privado via _closure_):

```js
function criarConta() {
    let saldo = 0; // privado por closure
    return {
        depositar(v) {
            saldo += v;
        },
        get saldo() {
            return saldo;
        },
    };
}
const c1 = criarConta();
c1.depositar(10);
```

**Classes** (quando precisas de **herança**, **`instanceof`**, **API familiar**):

```js
class Conta {
    /* ... */
}
const c2 = new Conta();
```

> Para projetos escolares: **classe** quando queres treinar OOP; **fábrica** quando queres algo leve e encapsulado sem herança.

---

## 10) Ferramentas úteis do runtime

```js
c instanceof Aluno; // true/false
Object.getPrototypeOf(c); // protótipo da instância
Aluno.prototype.isPrototypeOf(c); // true se c herda de Aluno.prototype
```

**Armadilhas**

-   Esqueceres‑te do `new` → em strict mode dá erro, noutros contextos pode gerar bugs.
-   Tentar aceder a `#privado` fora da classe (não compila). Usa getters.
-   “Protected” real não existe; usa `_convencao` ou API pública bem pensada.
-   Serialização JSON **ignora** campos/métodos; só serializa **dados públicos**.

---

## 11) Padrões práticos

### 11.1 Método de fábrica estático

```js
class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
    static fromString(s) {
        return new Pessoa(s.trim());
    }
}
const p = Pessoa.fromString("  Rita ");
```

### 11.2 “Classe base” (pseudo‑abstrata)

```js
class Forma {
    area() {
        throw new Error("Implementa na subclasse");
    }
}
class Retangulo extends Forma {
    constructor(l, a) {
        super();
        this.l = l;
        this.a = a;
    }
    area() {
        return this.l * this.a;
    }
}
```

### 11.3 Imutabilidade superficial com getters apenas

```js
class Config {
    #porta;
    #modo;
    constructor(porta, modo) {
        this.#porta = porta;
        this.#modo = modo;
    }
    get porta() {
        return this.#porta;
    }
    get modo() {
        return this.#modo;
    }
}
```

---

## 12) Exercícios

1. **Pessoa/Aluno**: adiciona `#idade` privado em `Pessoa`, valida no setter e faz `Aluno` herdar e sobrepor `apresentar()` usando `super`.
2. **Conta**: implementa `depositar/levantar/get saldo` com validação e método privado `#log`. Cria uma função que ordena contas por saldo usando um método **estático**.
3. **Temporizador/Relógio**: como no exemplo, com **composição**. Adiciona `get segundos()` e um método `reset()`.
4. **Fábrica vs classe**: cria `criarTermometro()` (fábrica com closure) e `class Termometro` (classe). Compara prós/contras.
5. **Binding**: cria uma classe com `handleClick` que é passado como callback a `addEventListener`. Mostra a versão com `bind` e com **class field + arrow**.
6. **Protótipos**: prova com `Object.getPrototypeOf(instancia) === Classe.prototype` e explica por escrito o que isso demonstra.

---

## 13) Resumo

-   Usa **`#privado`** + **getters/setters** para **encapsular** e validar.
-   **`static`** para utilitários e contadores de classe.
-   **`extends/super`** para herança quando houver uma relação “**é‑um**”; caso contrário, **composição**.
-   Tem atenção ao **`this`** em callbacks; usa `bind` ou **arrow em class fields**.
