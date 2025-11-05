/* 

TOC
============================================================================
[12] MÓDULOS ES (import/export, script type="module", default vs named)
[13] CLASSES E OOP MODERNO (constructor, métodos, getters/setters, private, static, extends)
[14] ASSÍNCRONO E EVENT LOOP (Promises, async/await, microtasks vs tasks)
[15] DOM BÁSICO (seletores, criar elementos, classes, atributos, eventos, delegação, forms)
[16] FETCH / AJAX (GET/POST, JSON, erros, timeout/AbortController, upload)
[17] OUTROS TÓPICOS ÚTEIS NO BROWSER
============================================================================

*/

/* ==========================================================================
[12] MÓDULOS ES (import/export, script type="module", default vs named)
============================================================================ */
/*
O ecossistema moderno do JavaScript usa **ES Modules (ESM)**. Cada ficheiro é um módulo.
- `export` → torna valores disponíveis para outros módulos. Normalmente no final do ficheiro que queremos exportar.
- `import` → traz valores de outro módulo. Normalmente no início do ficheiro em que queremos usar.
- Os módulos são **"deferidos" por defeito** no browser (executam depois do parse do HTML).
- Cada módulo tem o seu **escopo próprio** (variáveis do módulo não "vazam" para o global).
- **Top‑level await** é permitido em módulos (podes usar `await` fora de funções async).
(Definição de Top-level await: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top-level_await))

*/

/* ===== Exemplo básico ===== */
/* ===== Exportações (math.js) ===== */
export const PI = 3.14159;
export function soma(a, b) {
    return a + b;
}
export function media(nums) {
    return nums.reduce((acc, n) => acc + n, 0) / nums.length;
}
// export default: só pode haver um por ficheiro (nome à tua escolha ao importar)
export default function quadrado(x) {
    return x * x;
}

/* ===== Importações (main.js) ===== */
/*
// Importar específicos: */
import quadrado, { PI, soma as add, media } from "./math.js";
console.log(PI, add(2, 3), media([10, 20, 30]), quadrado(5));

// Importar tudo:
import * as MathPT from "./math.js";
console.log(MathPT.PI, MathPT.soma(1, 2));

// Import dinâmico (carregamento tardio – retorna uma Promise - Ver mais abaixo o que são Promises):
const { default: quad, soma } = await import("./math.js");
console.log(quad(6), soma(7, 8));

/*
 **Live bindings**: valores exportados são "vivos" (se o módulo de origem alterar, os importadores veem a alteração).
 */

/* ==========================================================================
[13] CLASSES E OOP MODERNO (constructor, métodos, getters/setters, private, static, extends)
============================================================================ */
/*
Classes são modelos para criar objetos com propriedades e métodos partilhados.
Boas práticas:
- Usar `constructor` para inicializar instâncias.
- Usar `get`/`set` para controlar acesso a propriedades.
- Usar campos privados (`#campo`) para encapsulamento.
- Usar métodos estáticos para utilitários relacionados com a classe.
- Usar `extends`/`super` para herança quando faz sentido.
-
Preferir **composição** a herança quando possível.
*/

class Pessoa {
    // Campos públicos
    nome;
    #idade; // campo privado (só acessível dentro da classe)
    static especie = "Homo sapiens"; // propriedade estática (na classe, não na instância)

    constructor(nome, idade) {
        this.nome = nome;
        this.#idade = idade;
    }

    // Getter/Setter (controlam acesso)
    get idade() {
        return this.#idade;
    }
    set idade(v) {
        if (v < 0 || v > 130) throw new RangeError("Idade inválida");
        this.#idade = v;
    }

    // Método de instância
    apresentar() {
        return `Olá, sou ${this.nome} e tenho ${this.#idade}.`;
    }

    // Método estático (utilitário da classe)
    static compararPorIdade(a, b) {
        return a.#idade - b.#idade;
    }
}

const ana = new Pessoa("Ana", 20);
const bruno = new Pessoa("Bruno", 18);
// console.log(ana.apresentar());
// console.log(Pessoa.especie);
// console.log([ana, bruno].sort(Pessoa.compararPorIdade));

/* ===== Herança (extends/super) ===== */
class Aluno extends Pessoa {
    turma;
    constructor(nome, idade, turma) {
        super(nome, idade); // chama o constructor da superclasse
        this.turma = turma;
    }
    apresentar() {
        // sobreposição (override) + reutilização
        return `${super.apresentar()} Estou na turma ${this.turma}.`;
    }
}
const carla = new Aluno("Carla", 19, "12ºIG");
// console.log(carla.apresentar());

/* ===== Composição (preferida para partilhar comportamento) ===== */
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
    #temp = new Temporizador();
    #seg = 0;
    iniciar() {
        this.#temp.start(1000, () => {
            this.#seg++; /* render() */
        });
    }
    parar() {
        this.#temp.stop();
    }
}

/* ==========================================================================
[14] ASSÍNCRONO E EVENT LOOP (Promises, async/await, microtasks vs tasks)
============================================================================ */
/*
**Programação assíncroa:**
Um dos conceitos centrais do JavaScript é a programação assíncrona, que permite operações não bloqueantes.
Uma operação sincróna bloqueia a execução até ser concluída, enquanto uma operação assíncrona permite que outras tarefas sejam executadas enquanto aguarda a conclusão.
Por exemplo, o cliente, ao fazer uma requisição sincrona ao servidor, fica bloqueado até que o servidor responda. 
Se o utilizador clicar num botão para fazer essa requisição, a aplicação ficará congelada até que a resposta seja recebida, 
o que pode resultar numa má experiência de utilizador.
Já numa requisição assíncrona, o cliente pode continuar a interagir com a aplicação enquanto aguarda a resposta do servidor.

De forma muito básica, o JavaScript lida com operações assíncronas através de **callbacks**, que são funções passadas como 
argumentos para outras funções e são executadas quando a operação assíncrona é concluída.


**Promises:**
As Promises são uma forma moderna de lidar com operações assíncronas em JavaScript. 
Elas representam um valor que pode estar disponível agora, no futuro ou nunca.
Uma Promise pode estar em um dos três estados: pendente (pending), resolvida (fulfilled) ou rejeitada (rejected).
As Promises permitem encadear operações assíncronas de forma mais legível e evitam o "callback hell".

O callback hell ocorre quando temos múltiplos callbacks aninhados, o que pode tornar o código difícil de ler e manter.
O sistema de promisses funciona basicamente assim:
- Criamos uma Promise que representa uma operação assíncrona.
- A Promise é inicialmente pendente.
- Quando a operação é concluída com sucesso, a Promise é resolvida com um valor.
- Se a operação falhar, a Promise é rejeitada com um motivo (erro).
- Se a Promise for resolvida, o método `.then()` é chamado com o valor resolvido.
- Se a Promise for rejeitada, o método `.catch()` é chamado com o motivo da rejeição.
- Por exemplo:
new Promise((resolve, reject) => {
  // operação assíncrona
  if (sucesso) {
    resolve(valor);
  } else {
    reject(erro);
  }
})
.then(valor => {
  // lidar com o valor resolvido
})
.catch(erro => {
  // lidar com o erro
});

Exemplos de utilizações de Promisses:
- Requisições de rede (fetch)
- Operações de leitura/escrita de ficheiros (Node.js)
- Temporizadores (setTimeout, setInterval)
- Interações com bases de dados (consultas assíncronas)
- Interações com Interfaces de Utilizador (UI) (eventos assíncronos)

**async/await:**
O async/await é uma sintaxe mais moderna para lidar com operações assíncronas em JavaScript, construída sobre Promises.
A palavra-chave `async` é usada para declarar uma função assíncrona, que retorna uma Promise.
Dentro de uma função assíncrona, a palavra-chave `await` pode ser usada para esperar pela resolução de uma Promise antes de continuar a execução do código.
Isto torna o código assíncrono mais parecido com o código síncrono, tornando-o mais fácil de ler e entender.

Exemplo:
async function exemploAsync() {
  try {
    const resultado = await operacaoAssincrona();
    // usar resultado
  } catch (erro) {
    // lidar com erro
  }
}

**Event Loop:**
Javascript é single-threaded, o que significa que apenas uma coisa pode acontecer de cada vez. No entanto, ele pode lidar com 
operações assíncronas através do **event loop**.
O event loop é um mecanismo que permite ao JavaScript executar operações assíncronas, como chamadas de rede ou temporizadores, 
sem bloquear a thread principal.
Isto funciona através de uma fila de tarefas (task queue) onde as operações assíncronas são colocadas quando estão prontas 
para serem executadas. O Javascript verifica constantemente esta fila e executa as tarefas quando a thread principal está livre.

Como o nome indica, o event loop é um ciclo que verifica continuamente a fila de tarefas e executa as tarefas quando a 
thread principal está livre.

JavaScript tem um **event loop**:
- **Tasks** (macrotasks): setTimeout, setInterval, I/O do browser.
- **Microtasks**: Promises (then/catch/finally), queueMicrotask, MutationObserver.
A ordem típica: executa todas as microtasks antes da próxima task.
*/

// Ordem de execução (experimenta no DevTools):
// console.log("A");
// setTimeout(() => console.log("B - timeout 0"), 0);
// Promise.resolve().then(() => console.log("C - microtask"));
// console.log("D");
// -> A, D, C, B

/* ===== Promises ===== */
function esperar(ms, valor) {
    return new Promise((resolve) => setTimeout(() => resolve(valor), ms));
}

esperar(300, "Olá")
    .then((v) => v + " mundo")
    .then((v) => {
        /* encadeamento */ return v.toUpperCase();
    })
    .catch((err) => console.error("Erro:", err)) // apanha erros anteriores
    .finally(() => {
        /* limpa recursos */
    });

/* Combinações úteis */
const p1 = esperar(200, 1);
const p2 = esperar(300, 2);
// Promise.all → falha se uma falhar, devolve array de resultados
Promise.all([p1, p2]).then(([a, b]) => {
    /* ambos concluídos */
});
// Promise.allSettled → nunca rejeita; dá estado de cada uma
Promise.allSettled([p1, p2]).then((rs) => {
    /* ver status/valor */
});
// Promise.race → primeiro a resolver/rejeitar
// Promise.any → primeiro a **resolver** (ignora rejeições; falha só se todas falharem)

/* ===== async/await (açúcar sobre Promises) ===== */
async function exemploAsync() {
    try {
        const a = esperar(200, 10);
        const b = esperar(200, 20);
        // Esperar em paralelo (melhor performance):
        const [ra, rb] = await Promise.all([a, b]);
        return ra + rb;
    } catch (e) {
        console.error("Falhou:", e);
        return null;
    }
}
exemploAsync().then((res) => {
    /* usa res */
});

/* Top‑level await (apenas em módulos ESM) – útil para bootstrapping */
// const dados = await fetch("./data.json").then(r => r.json());

/* Debounce & Throttle (para eventos muito frequentes – scroll/input) */
function debounce(fn, delay = 300) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
}
function throttle(fn, interval = 300) {
    let last = 0;
    return (...args) => {
        const now = Date.now();
        if (now - last >= interval) {
            last = now;
            fn(...args);
        }
    };
}

/* ==========================================================================
[15] DOM BÁSICO (seletores, criar elementos, classes, atributos, eventos, delegação, forms)
============================================================================ */
/*
DOM: Document Object Model – representação em árvore dos elementos HTML.
Quando o browser carrega uma página, ele cria o DOM para que o JavaScript possa interagir com os elementos.
Cada tag HTML torna-se num **nó** (node) na árvore do DOM. Depois, o JavaScript pode selecionar, criar, modificar e 
eliminar esses nós através da API do DOM.
Existem um conjunto de métodos e propriedades para manipular o DOM:
- Seletores: `document.querySelector()`, `document.querySelectorAll()`, `getElementById()`, etc.
- Criar elementos: `document.createElement()`, `element.cloneNode()`.
- Inserir/remover: `appendChild()`, `insertBefore()`, `removeChild()`, `replaceChild()`.
- Atributos: `setAttribute()`, `getAttribute()`, `removeAttribute()`.
- Classes: `classList.add()`, `classList.remove()`, `classList.toggle()`.
- Texto/HTML: `textContent`, `innerHTML` (cuidado com XSS!).
- Eventos: `addEventListener()`, `removeEventListener()`.
- Formulários: ler valores, prevenir submit, usar FormData.
- Armazenamento local: `localStorage` e `sessionStorage`.
Boas práticas:
- Prefere `textContent` a `innerHTML` quando não precisas de HTML (evita XSS).
- Usa `classList` para adicionar/remover classes.
- Evita registar muitos listeners em listas: usa **delegação de eventos**.
- Mantém a manipulação do DOM **mínima** dentro de ciclos quentes (performance).
*/

// Seletores
const app = document.querySelector("#app"); // primeiro que bate
const botoes = document.querySelectorAll(".btn"); // NodeList estático

// Criar e injetar
const card = document.createElement("article");
card.className = "card";
card.dataset.id = "42"; // data-id="42"
card.innerHTML = `<h3>Título</h3><p>Conteúdo <strong>qualquer</strong>.</p>`; // cuidado com dados do utilizador!
app.appendChild(card);

// Alterar texto seguro
const p = document.createElement("p");
p.textContent = "Texto seguro (sem HTML interpretado).";
card.append(p);

// Classes e estilos
card.classList.add("ativo");
card.style.border = "1px solid #ddd";

// Eventos
function aoClicar(e) {
    console.log("Clique no botão:", e.currentTarget);
}
document.querySelector("#comprar").addEventListener("click", aoClicar);

// Delegação de eventos (um listener para muitos itens)
document.querySelector("#lista").addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    console.log("Clicaste no item:", li.dataset.itemId);
});

// Formulários (prevenir submit e ler campos)
document.querySelector("#form-login")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const dados = Object.fromEntries(fd.entries()); // { email: "...", senha: "..." }
    console.log(dados);
    // validações… enviar via fetch…
});

// Armazenamento local
localStorage.setItem("tema", "dark");
const tema = localStorage.getItem("tema"); // "dark"
localStorage.removeItem("tema"); // apaga
// Guarda objetos como JSON
localStorage.setItem("user", JSON.stringify({ nome: "Rita" }));
const user = JSON.parse(localStorage.getItem("user") || "null");

/* ==========================================================================
[16] FETCH / AJAX (GET/POST, JSON, erros, timeout/AbortController, upload)
============================================================================ */
/*

**Fetch API**: método moderno para fazer requisições HTTP assíncronas no browser.
**AJAX**: Asynchronous JavaScript and XML – técnica para atualizar partes da página sem recarregar tudo.

`fetch(url, options?)` retorna uma **Promise<Response>**.
- `response.ok` → true se 200–299; não lança automaticamente!
- Para JSON: `await response.json()`; para texto: `await response.text()`.
- Usa `AbortController` para timeouts/cancelamentos.
- Atenção a **CORS**: o servidor tem de permitir a origem (headers adequados).
*/

async function getJSON(url, { signal } = {}) {
    const r = await fetch(url, { signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
}

async function postJSON(url, data, { signal } = {}) {
    const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal,
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
}

/* GET com timeout */
async function getComTimeout(url, ms = 5000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
        return await getJSON(url, { signal: ctrl.signal });
    } finally {
        clearTimeout(t);
    }
}

/* Exemplo de uso (substituir por endpoint válido do vosso projeto):
(async () => {
  try {
    const lista = await getComTimeout("https://example.com/api/items", 4000);
    console.table(lista);
  } catch (e) {
    console.error("Falhou o carregamento:", e.message);
  }
})();
*/

/* POST JSON */
// postJSON("https://example.com/api/login", { email: "a@b.c", senha: "1234" })
//   .then(res => console.log("OK:", res))
//   .catch(err => console.error("Erro:", err));

/* Upload de ficheiros com FormData (boundary/multipart gerido pelo browser) */
async function uploadFoto(url, inputFile) {
    const fd = new FormData();
    // inputFile é um <input type="file"> ou um File/Blob
    const file = inputFile.files ? inputFile.files[0] : inputFile;
    fd.append("foto", file, file.name || "foto.jpg");
    const r = await fetch(url, { method: "POST", body: fd });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
}

/* Query strings e URLs seguras */
function construirURL(base, params) {
    const u = new URL(base, location.origin);
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
    return u.toString();
}
// const url = construirURL("/api/produtos", { page: 2, q: "portátil" });

/* ==========================================================================
[17] OUTROS TÓPICOS ÚTEIS NO BROWSER
============================================================================ */
/* ===== URLSearchParams (ler parametros de ?query) ===== */
const qs = new URLSearchParams(location.search);
// const q = qs.get("q"); // null ou valor

/* ===== History API (SPAs simples) ===== */
function navegar(path, state = {}) {
    history.pushState(state, "", path);
    // render() conforme path
}
window.addEventListener("popstate", () => {
    // voltar/avançar do browser
    // render() conforme location.pathname
});

/* ===== IntersectionObserver (lazy loading / observar visibilidade) ===== */
const io = new IntersectionObserver(
    (entries) => {
        for (const e of entries) {
            if (e.isIntersecting) {
                // carregar imagem/mais dados...
                // e.target.src = e.target.dataset.src;
                io.unobserve(e.target);
            }
        }
    },
    { root: null, rootMargin: "0px", threshold: 0.1 }
);
// io.observe(document.querySelector("img[data-src]"));

/* ===== Internacionalização (Intl) ===== */
const fmtMoeda = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
});
// console.log(fmtMoeda.format(1234.5)); // "1 234,50 €"
const fmtData = new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short",
});
// console.log(fmtData.format(new Date()));

/* ===== Acessibilidade & UX =====
- Garantir foco visível: :focus { outline }
- Usar roles/ARIA só quando necessário (elementos semânticos são preferidos).
- Labels associados a inputs (<label for="id">).
- Mensagens de erro claras, não só por cor (daltonismo).
*/

/* ===== Segurança no front-end (resumo) =====
- XSS: nunca inserir dados do utilizador com innerHTML sem sanitizar.
- Preferir textContent ou templates sanitizados.
- Evitar colocar tokens sensíveis no front-end.
- Considerar Content‑Security‑Policy (CSP) quando possível.
*/

/* ===== Performance (medir) ===== */
console.time("tarefa");
// ... trabalho ...
console.timeEnd("tarefa"); // imprime duração
// Também: performance.now(), PerformanceObserver, Lighthouse etc.
