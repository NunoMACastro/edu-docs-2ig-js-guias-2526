# [8] Funções de Alto Nível em Arrays (map, filter, reduce, find, ...)

## Teoria
- `map` transforma; `filter` seleciona; `reduce` agrega.
- `find`/`findIndex`; `some`/`every` para testes.
- `sort` **muta**: copia antes se precisares preservar.

## Exemplos
```js
const alunos=[{nome:"Ana",nota:17},{nome:"Bruno",nota:9},{nome:"Carla",nota:14}];

const nomes = alunos.map(a=>a.nome);
const aprov = alunos.filter(a=>a.nota>=10);
const media = alunos.reduce((acc,a)=>acc+a.nota,0)/alunos.length;
const primeiroReprov = alunos.find(a=>a.nota<10);
const idxReprov = alunos.findIndex(a=>a.nota<10);
const nomesPT = alunos.slice().sort((a,b)=>a.nome.localeCompare(b.nome,"pt"));
```
