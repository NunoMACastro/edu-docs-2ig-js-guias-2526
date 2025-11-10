# [11] Funções (declaração, expressão, arrow, parâmetros, hoisting, scope, closures, `this`)

## Teoria
- **Declaração**: sofre hoisting (podes chamar antes no ficheiro).
- **Expressão**: atribuída a variável; sem hoisting utilizável.
- **Arrow**: sintaxe curta, **sem `this` próprio** (herda do léxico); ótima para callbacks.
- **Parâmetros**: default, rest (`...args`), desestruturação.
- **Closures**: funções que “lembram” o ambiente onde foram criadas.

## Exemplos
```js
console.log(somarDeclaracao(2,3)); // 5
function somarDeclaracao(a,b){ return a+b; }

const somarExpr = function(a,b){ return a+b; };
const somarArrow = (a,b) => a+b;

function saudacao(nome="aluno"){ return `Olá, ${nome}!`; }

function somaTudo(...nums){ return nums.reduce((acc,n)=>acc+n,0); }

function criarContador(inicial=0){
  let v=inicial;
  return () => (++v);
}
const prox = criarContador(10);
console.log(prox()); // 11
console.log(prox()); // 12
```
