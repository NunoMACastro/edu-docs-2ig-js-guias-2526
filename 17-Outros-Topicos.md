# [17] Outros Tópicos Úteis no Browser

## URLSearchParams
```js
const qs=new URLSearchParams(location.search);
const q=qs.get("q");
```

## History API (SPAs simples)
```js
function navegar(path,state={}){ history.pushState(state,"",path); }
window.addEventListener("popstate",()=>{ /* render conforme path */ });
```

## IntersectionObserver (lazy loading)
```js
const io=new IntersectionObserver(entries=>{ for(const e of entries){ if(e.isIntersecting){ /* load */ io.unobserve(e.target); }}});
```

## Internacionalização (Intl)
```js
new Intl.NumberFormat("pt-PT",{style:"currency",currency:"EUR"}).format(1234.5);
new Intl.DateTimeFormat("pt-PT",{dateStyle:"medium",timeStyle:"short"}).format(new Date());
```

## Acessibilidade, Segurança, Performance (resumo)
- Foco visível, semântica primeiro; evitar `innerHTML` com dados do utilizador.
- Considerar **CSP**; medir com `console.time`, `performance.now`, Lighthouse.
