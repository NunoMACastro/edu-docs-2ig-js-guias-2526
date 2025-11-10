# [16] Fetch / AJAX (GET/POST, JSON, erros, timeout/AbortController, upload)

## Teoria
- `fetch(url, opts?)` → `Promise<Response>`. Verifica `response.ok`. Atenção a **CORS**.
- Usa `AbortController` para timeout/cancelar.

## Exemplos
```js
async function getJSON(url,{signal}={}){
  const r=await fetch(url,{signal}); if(!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
async function postJSON(url,data,{signal}={}){
  const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data),signal});
  if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json();
}
```
