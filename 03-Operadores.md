# [3] Operadores Essenciais

## Teoria
- **Aritméticos**: `+ - * / % **`
- **Atribuição**: `=, +=, -=, *=, /=, %=, **=`
- **Comparação**: `> >= < <= == === != !==`
- **Lógicos**: `&& || !` (curto‑circuito)
- **Ternário**: `cond ? a : b`
- **Nullish coalescing**: `??` (só troca `null/undefined`)
- **Encadeamento opcional**: `?.` (acesso seguro)

## Exemplos
```js
let x = 10;
x += 5;                         // 15
console.log(5 % 2);             // 1
console.log("2" == 2);          // true  (coerção)
console.log("2" === 2);         // false (estrita)

const aluno = { nome: "Ana", encarregado: null };
console.log(aluno.encarregado?.telefone); // undefined

let entrada = 0;
console.log(entrada || 100);    // 100 (0 é falsy)
console.log(entrada ?? 100);    // 0   (null/undefined → 100)
```
