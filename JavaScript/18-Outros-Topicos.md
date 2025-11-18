# [18] Outros Tópicos Úteis no Browser - URLSearchParams, History API, IntersectionObserver, Intl, A11y, Segurança, Performance (11.º ano)

> **Objetivo**: conhecer ferramentas úteis do browser para tornar as páginas mais **funcionais, acessíveis e rápidas**. Explicações simples, exemplos curtos e desafios.

---

## 0) Mapa do capítulo

-   **URL & Query Strings** com `URL` e `URLSearchParams`
-   **History API** (`pushState`, `replaceState`, `popstate`) — navegação sem recarregar
-   **IntersectionObserver** — detectar quando algo entra no ecrã (lazy‑loading, infinito)
-   **Intl** — formatar números, moedas e datas em `pt-PT`
-   **Acessibilidade (A11y)** — labels, foco visível, ARIA mínimo
-   **Segurança no front‑end** — XSS e boas práticas
-   **Performance** — `DocumentFragment`, debouncing/throttling, `requestAnimationFrame`, `console.time`

---

## 1) URL & Query Strings (ler e construir URLs)

### 1.1 Ler parâmetros da query

```html
<!-- Ex.: https://site.com/pesquisa.html?q=javascript&page=2 -->
<input id="q" />
<script>
    const qs = new URLSearchParams(location.search);
    document.querySelector("#q").value = qs.get("q") ?? "";
    const pagina = Number(qs.get("page") ?? 1);
    console.log("Página", pagina);
</script>
```

### 1.2 Construir URLs com segurança

```js
function urlComParams(base, params) {
    const u = new URL(base, location.origin); // resolve relativo
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
    return u.toString();
}

const url = urlComParams("/api/produtos", { page: 3, q: "caderno A5" });
// -> "/api/produtos?page=3&q=caderno+A5"
```

> **Vantagem**: `URL`/`URLSearchParams` tratam encoding por ti (evita erros com espaços/acentos).

---

## 2) History API (navegação sem recarregar a página)

Permite alterar a **barra de endereço** e reagir aos **botões voltar/avançar** sem recarregar tudo — útil para **SPAs simples**.

```html
<nav>
    <a href="/#home" data-view="home">Home</a>
    <a href="/#sobre" data-view="sobre">Sobre</a>
</nav>
<main id="app"></main>
<script>
    const app = document.querySelector("#app");

    function render(view) {
        if (view === "sobre") app.textContent = "Página Sobre";
        else app.textContent = "Página Home";
    }

    // Navegação por clique (evita recarregar)
    document.querySelector("nav").addEventListener("click", (e) => {
        const link = e.target.closest("a[data-view]");
        if (!link) return;
        e.preventDefault();
        const view = link.dataset.view;
        history.pushState({ view }, "", `/#${view}`); // altera URL
        render(view);
    });

    // Botões voltar/avançar
    window.addEventListener("popstate", (e) => {
        const view = e.state?.view ?? "home";
        render(view);
    });

    // Primeira renderização
    const inicial = location.hash.replace("#", "") || "home";
    history.replaceState({ view: inicial }, "", `/#${inicial}`);
    render(inicial);
</script>
```

**Ideia**: guardas **estado** com o histórico e atualizas a UI consoante a URL.

---

## 3) IntersectionObserver (detectar quando algo está visível)

Serve para **lazy‑loading** de imagens, **carregar mais items** ao chegar ao fim, ativar **animações** quando um elemento entra no ecrã.

```html
<img data-src="foto-grande.jpg" alt="Paisagem" class="lazy" width="600" />
<script>
    const io = new IntersectionObserver(
        (entries, obs) => {
            for (const e of entries) {
                if (!e.isIntersecting) continue;
                const img = e.target;
                img.src = img.dataset.src; // substitui pelo verdadeiro src
                obs.unobserve(img); // já não precisamos de observar esta
            }
        },
        { root: null, rootMargin: "0px 0px 200px 0px", threshold: 0.01 }
    );
    document.querySelectorAll("img.lazy").forEach((img) => io.observe(img));
</script>
```

-   `rootMargin: '... 200px ...'` começa a carregar **um pouco antes** de aparecer.
-   `threshold` define “quanto do elemento” precisa estar visível.

**Loading infinito (esqueleto)**

```js
const sentinel = document.querySelector("#sentinela"); // um <div> no fim da lista

const io = new IntersectionObserver(
    async (entries) => {
        if (!entries[0].isIntersecting) return;
        await carregarMaisItems(); // busca e injeta mais <li>
    },
    { threshold: 0.1 }
);

io.observe(sentinel);
```

---

## 4) Intl (formatar números, moedas e datas)

O objeto `Intl` adapta formatações ao **país/idioma** — perfeito para `pt-PT`.

```js
// Moedas
const eur = new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
});
console.log(eur.format(1234.5)); // "1 234,50 €"

// Datas
const dt = new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
    timeStyle: "short",
});
console.log(dt.format(new Date()));

// Texto ordenado com acentos correto
const coll = new Intl.Collator("pt-PT");
["maçã", "manga", "abacate"].sort(coll.compare);

// Relativo (há 5 minutos, daqui a 2 dias)
const rtf = new Intl.RelativeTimeFormat("pt-PT", { numeric: "auto" });
console.log(rtf.format(-5, "minute")); // "há 5 minutos"
```

> Vantagem: não precisas de inventar formatações — usas a do sistema/idioma correto.

---

## 5) Acessibilidade (A11y) — o básico que faz diferença

-   Usa **HTML semântico**: `<button>` para botões, `<nav>`, `<header>`, `<main>`, `<footer>`.
-   **Labels** associadas a inputs: `<label for="email">Email</label><input id="email">`.
-   **Foco visível** no CSS: não tires o `outline` sem alternativa visível.
-   **Botões com ícone** precisam de texto/`aria-label`.

```html
<button aria-label="Abrir menu">
    <svg aria-hidden="true" ...><!-- ícone --></svg>
</button>
```

**Estado ARIA controlado por JS**

```js
const btn = document.querySelector("#alternar");
btn.addEventListener("click", () => {
    const on = btn.getAttribute("aria-pressed") === "true";
    btn.setAttribute("aria-pressed", String(!on));
});
```

---

## 6) Segurança no front‑end (resumo prático)

-   **XSS**: nunca inserires dados do utilizador com `innerHTML`. Prefere `textContent`.
-   Se precisares mesmo de HTML dinâmico, **sanitiza** antes (bibliotecas específicas; tema avançado).
-   **Nunca** guardes tokens/chaves sensíveis no front‑end público.
-   Ativa **CSP** (Content‑Security‑Policy) quando possível (configuração no servidor).

Exemplo seguro:

```js
const p = document.createElement("p");
p.textContent = inputDoUtilizador; // não interpreta como HTML
container.append(p);
```

---

## 7) Performance — tornar a UI suave

-   **Mudar muita coisa de uma vez** → usa `DocumentFragment` e injeta no fim.
-   **Eventos rápidos** (scroll, input) → usa **debounce**/**throttle**.
-   **Animações** → usa `requestAnimationFrame` para sincronizar com o ecrã.
-   **Medir é reinar**: `console.time` / `console.timeEnd`.

```js
// Debounce: só corre depois de parar de escrever por 300ms
function debounce(fn, delay=300){
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}
const filtrar = debounce(() => /* filtra lista */, 300);
document.querySelector('#q').addEventListener('input', filtrar);

// DocumentFragment
const frag = document.createDocumentFragment();
for (let i=0;i<1000;i++){ const li=document.createElement('li'); li.textContent='Item '+i; frag.append(li); }
document.querySelector('ul').append(frag);

// Medir
console.time('render');
// ... faz coisas ...
console.timeEnd('render');
```

---

## 8) Mini‑projetos guiados

1. **Pesquisa via query string**

    - Lê `q` de `location.search` e preenche um `<input>`. Ao submeter, usa `URL`/`searchParams` para atualizar a URL.

2. **SPA simples com History API**

    - 2 vistas (“Home”, “Sobre”) que trocam sem recarregar. Suporta voltar/avançar do browser.

3. **Lazy‑loading de imagens**

    - Troca `data-src` por `src` quando a imagem entra no ecrã. Usa `rootMargin` para carregar antes.

4. **Lista longa + throttle**

    - Com 2000 `<li>`, faz um filtro que só corre de 200 em 200 ms.

5. **Intl**

    - Mostra uma tabela com preços formatados em EUR e datas `dateStyle: "medium"`.

6. **A11y rápido**
    - Botão com ícone só: adiciona `aria-label`. Garante foco visível via CSS.

---

## 9) Mini desafios

1. **Ler query** — escreve `getQuery(nome)` usando `new URLSearchParams(location.search)` e testa com `?q=js&page=2`.
2. **Atualizar query** — cria um formulário com campo `q`. No `submit`, usa `url.searchParams.set` e `history.replaceState` para atualizar a barra de endereço sem recarregar.
3. **SPA simples** — dois botões “Home” e “Sobre” que trocam o conteúdo de uma `<section>` e usam `history.pushState`/`popstate` para manter o estado ao navegar para trás.
4. **IntersectionObserver básico** — observa o último `<li>` e, quando aparece no ecrã, adiciona mais três itens a partir de um array (sem servidor).
5. **Intl** — mostra o preço `12.5` como `pt-PT` EUR e a data atual com `Intl.DateTimeFormat`. Ordena `["maçã", "manga", "abacate"]` com `localeCompare`.
6. **A11y rápido** — cria um botão só com ícone e adiciona `aria-label`. Depois adiciona `aria-pressed` para indicar favorito e alterna o valor ao clicar.
7. **Performance/medição** — cria 500 `<li>` usando `DocumentFragment` e mede com `console.time`/`console.timeEnd` quanto demorou.

---

## 10) Resumo

-   `URL`/`URLSearchParams` simplificam **ler/construir** URLs.
-   **History API** permite **navegação sem recarregar** e suporta voltar/avançar.
-   **IntersectionObserver** permite **lazy‑loading** e **infinito** de forma eficiente.
-   **Intl** dá **formatação correta** para números/datas/texto em `pt-PT`.
-   **A11y** e **Segurança**: pequenas regras que evitam grandes problemas.
-   **Performance**: agrupa alterações, limita eventos rápidos, mede resultados.

## Changelog

-   **v1.2.0 — 2025-11-10**
    -   Mini desafios reescritos com passos mais guiados (sem dependência de APIs externas ou listas enormes).
-   **v1.1.0 — 2025-11-10**
    -   Secção final convertida em Mini desafios com foco em APIs modernas do browser.
    -   Adicionado changelog para manter histórico de alterações.
