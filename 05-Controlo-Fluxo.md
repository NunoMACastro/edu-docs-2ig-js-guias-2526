# [5] Estruturas de Controlo (if/else, switch, truthy/falsy)

## Teoria
- `if / else if / else` para decisões.
- `switch` para muitos casos concretos (lembra-te dos `break`).
- **Guard clauses** evitam aninhamentos profundos.

## Exemplos
```js
const nota = 14;
if (nota >= 18) console.log("Excelente");
else if (nota >= 10) console.log("Aprovado");
else console.log("Reprovado");

const fruta = "maçã";
switch (fruta) {
  case "maçã":
  case "banana":
  case "laranja":
    console.log("Fruta comum"); break;
  default:
    console.log("Outra"); break;
}

function validarIdade(i){
  if (i == null) return "Idade em falta";
  if (i < 0)     return "Idade inválida";
  if (i < 18)    return "Menor";
  return "Maior";
}
```
