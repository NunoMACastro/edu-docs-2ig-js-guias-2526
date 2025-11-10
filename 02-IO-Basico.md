# [2] Input/Output Básico

## Teoria
- **`console.log`, `console.error`, `console.warn`, `console.table`** para saída em Node/DevTools.
- **`prompt/alert/confirm`** existem apenas no **browser** e são bloqueantes (evitar em projetos reais).

## Exemplos
```js
console.log("Olá, mundo!");
console.warn("Atenção!");
console.error("Ocorreu um erro");
console.table([{nome:"Ana", nota:18},{nome:"Bruno",nota:9}]);
```
