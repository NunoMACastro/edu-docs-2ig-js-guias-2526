# [15] DOM Básico (seletores, criar elementos, classes, eventos, delegação)

## Teoria
- Interagir com o **DOM**: `querySelector`, criar/inserir/remover nós, `classList`, `dataset`, eventos.
- Preferir `textContent`; usar `innerHTML` com cuidado (XSS).

## Exemplos
```js
const app=document.querySelector("#app");
const card=document.createElement("article");
card.className="card";
card.textContent="Conteúdo seguro.";
app.appendChild(card);

document.querySelector("#lista").addEventListener("click",(e)=>{
  const li=e.target.closest("li"); if(!li) return;
  console.log("Clicaste:", li.dataset.itemId);
});
```
