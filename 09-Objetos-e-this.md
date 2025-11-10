# [9] Objetos (criar, ler/escrever) e `this` (noção inicial)

## Teoria
- Literais `{ chave: valor }` criam objetos.
- Acesso por **dot** e **brackets**.
- Métodos com sintaxe de método usam `this` como o **objeto à esquerda do ponto**.
- Utilitários: `Object.keys/values/entries`, cópia com spread, desestruturação.
- Acesso seguro com `?.` e valor por defeito com `??`.

## Exemplos
```js
const pessoa={
  nome:"Marta",
  idade:22,
  falar(){ return `Olá, eu sou a ${this.nome}.`; }
};

pessoa.idade=23; pessoa.escola="EPMS"; delete pessoa["campo-velho"];
const chaves=Object.keys(pessoa);
const copia={...pessoa, cidade:"Viseu"};

const cliente={perfil:{contacto:{email:"x@y.z"}}};
const email = cliente.perfil?.contacto?.email ?? "sem email";
```
