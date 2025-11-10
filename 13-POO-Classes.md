# [13] Classes e OOP Moderno (constructor, métodos, getters/setters, private, static, extends)

## Teoria
- `class` é açúcar sobre protótipos. Usa **encapsulamento** com `#privados` + `get/set`.
- **Estáticos** pertencem à classe. **Herança** com `extends`/`super`.
- **Composição** é preferível a herança quando possível.

## Exemplos
```js
class Pessoa {
  static especie="Homo sapiens";
  nome; #idade;
  constructor(nome, idade){ this.nome=nome; this.#idade=idade; }
  get idade(){ return this.#idade; }
  set idade(v){ if(v<0||v>130) throw new RangeError("Idade inválida"); this.#idade=v; }
  apresentar(){ return `Olá, sou ${this.nome} e tenho ${this.#idade}.`; }
  static compararPorIdade(a,b){ return a.#idade - b.#idade; }
}

class Aluno extends Pessoa {
  constructor(nome, idade, turma){ super(nome, idade); this.turma=turma; }
  apresentar(){ return `${super.apresentar()} Estou na turma ${this.turma}.`; }
}
```
