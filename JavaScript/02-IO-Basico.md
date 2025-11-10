# [2] Input/Output Básico — Versão Didática (11.º ano)

> **Objetivo**: mostrar informação (`output`) e recolher dados (`input`) tanto no browser como em Node.js, usando ferramentas simples e previsíveis.

---

## 0) Onde está o nosso código?

-   **Browser** → usas a consola das DevTools (`F12` ou `Ctrl+Shift+I`) e tens `prompt/alert/confirm` à disposição.
-   **Node.js** → corres ficheiros `.js` no terminal. Não existe `prompt`, por isso usamos módulos como `readline`.

Começa sempre por abrir a consola para veres erros e mensagens.

---

## 1) Mostrar informação com `console.*`

Muda o método consoante o tipo de mensagem.

```js
console.log("Olá, turma!"); // mensagem normal
console.info("Versão", 1); // informação
console.warn("Atenção!", dados); // aviso
console.error("Ups, deu erro"); // erro
console.table([
    { nome: "Ana", nota: 18 },
    { nome: "Bruno", nota: 9 },
]); // tabela amigável
```

> `console.table` é perfeito para arrays de objetos (notas, inventários, etc.).

---

## 2) Entrada no browser (`prompt`, `confirm`, `alert`)

-   `prompt(mensagem, valorInicial?)` → devolve **string** ou `null` (se clicares Cancelar).
-   `confirm(mensagem)` → devolve **boolean** (`true` se OK).
-   `alert(mensagem)` → só mostra texto.

```js
const nome = prompt("Como te chamas?", "aluno");
if (nome === null) {
    alert("Operação cancelada");
} else {
    alert(`Olá, ${nome}!`);
}
```

### Converter texto em números

`prompt` devolve sempre texto. Converte com `Number`, `parseFloat` ou `parseInt` e valida com `Number.isNaN`.

```js
const entrada = prompt("Indica um número para dobrar:");
const numero = Number(entrada);
if (Number.isNaN(numero)) {
    alert("Isso não é número válido");
} else {
    alert(`O dobro de ${numero} é ${numero * 2}`);
}
```

### Caixa de confirmação

```js
if (confirm("Queres guardar?")) {
    console.log("Guardado!");
} else {
    console.log("Operação cancelada");
}
```

---

## 3) Entrada simples em Node.js (`readline`)

Para exercícios rápidos em Node, usa `readline`. Exemplo minimalista:

```js
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });
const nome = await rl.question("Nome: ");
console.log(`Olá, ${nome}!`);
rl.close();
```

> Node não suporta `prompt` nativamente; por isso recorremos a bibliotecas externas ou a este módulo da própria plataforma.

---

## 4) Boas práticas para I/O nesta fase

-   Prefere o **browser** nos primeiros exercícios: feedback imediato e menos configuração.
-   Converte entradas para o tipo certo logo após leres (números, booleanos, etc.).
-   Usa `console.log` para mensagens normais e `console.error` para erros; ajuda muito quando o projeto crescer.
-   Limpa `console.log` supérfluos antes de entregar trabalhos finais.
-   Nunca assumas que o utilizador escreveu algo válido — valida sempre.

---

## 5) Mini desafios

1. Pergunta dois números com `prompt`, converte-os e mostra a soma com `alert`.
2. Pergunta o nome e pergunta com `confirm` se quer receber notificações. Mostra uma frase diferente para cada resposta.
3. Em Node, pede a idade com `readline` e classifica como "menor" ou "maior".
