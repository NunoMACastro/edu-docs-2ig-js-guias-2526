# [10] Exceções (try/catch/finally, throw, erros personalizados)

## Teoria
- `try/catch/finally` para lidar com erros em tempo de execução.
- `throw` para lançar erros; podes criar **erros personalizados**.

## Exemplos
```js
function dividir(a,b){
  if (typeof a!=="number" || typeof b!=="number") throw new TypeError("Números!");
  if (b===0) throw new RangeError("Divisão por zero");
  return a/b;
}

try {
  console.log(dividir(10,2));    // 5
} catch(e){
  console.error("Erro:", e.message);
} finally {
  // limpar recursos...
}

class NotaInvalidaError extends Error {
  constructor(nota){ super(`Nota inválida: ${nota}`); this.name="NotaInvalidaError"; }
}
```
