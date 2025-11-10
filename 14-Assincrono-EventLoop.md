# [14] Assíncrono e Event Loop (Promises, async/await, microtasks vs tasks)

## Teoria
- JS é **single‑threaded**; o **event loop** gere **tasks** e **microtasks**.
- **Promises** modelam resultados futuros; **async/await** simplifica o encadeamento.

## Exemplos
```js
console.log("A");
setTimeout(()=>console.log("B - task"),0);
Promise.resolve().then(()=>console.log("C - microtask"));
console.log("D"); // A, D, C, B

function esperar(ms,val){ return new Promise(r=>setTimeout(()=>r(val),ms)); }
async function exemplo(){
  const [a,b]=await Promise.all([esperar(200,10), esperar(200,20)]);
  return a+b;
}
```
