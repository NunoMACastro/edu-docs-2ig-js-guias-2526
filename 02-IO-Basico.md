# [2] Input/Output Básico

> **Objetivo**: saber **mostrar informação** (saída) e **ler dados** (entrada) em **browser** e em **Node.js**, usando as ferramentas mais simples e previsíveis para este nível.

## 1) Conceitos e contexto

-   **Saída (output)**: normalmente via `console.*` (consola do browser/DevTools ou terminal em Node.js).
-   **Entrada (input)**:
    -   **Browser**: `prompt`, `confirm`, `alert` (bloqueantes; bons para exercícios).
    -   **Node.js**: não tem `prompt` embutido; usa-se `readline` (ou libs como `prompt-sync`).
-   Para exercícios de iniciação, **prefere o browser**: é direto e visual.

---

## 2) Saída com `console.*` (browser e Node)

### Métodos principais

-   `console.log(...)`: mensagens gerais (texto, números, objetos).
-   `console.info(...)`: informativo (equivalente a `log` em muitos ambientes).
-   `console.warn(...)`: avisos (amarelo no browser).
-   `console.error(...)`: erros (vermelho; em Node usa `stderr`).
-   `console.table(arrayOuObjeto)`: tabela legível (ótimo para arrays de objetos).

```js
console.log("Olá, mundo!");
console.info("Info:", { versao: 1 });
console.warn("Atenção: ação irreversível.");
console.error("Ocorreu um erro");
console.table([
    { nome: "Ana", nota: 18 },
    { nome: "Bruno", nota: 9 },
]);
```

---

## 3) Entrada no **browser** com `prompt/confirm/alert`

-   `prompt(mensagem, valorPadrao?)` → devolve **string** ou **`null`** (se Cancelar).
-   `confirm(mensagem)` → **boolean** (`true` OK / `false` Cancelar).
-   `alert(mensagem)` → só mostra uma caixa (sem retorno).

```js
const nome = prompt("Como te chamas?", "aluno");
if (nome === null) {
    alert("Operação cancelada.");
} else {
    alert(`Olá, ${nome}!`);
}
```

### Números com `prompt`: conversões seguras

-   `prompt` devolve **string**. Converte com `Number(...)` / `parseFloat(...)`.

```js
const numero = Number(prompt("Escreve um número:"));
if (Number.isNaN(numero)) {
    alert("Isso não é um número válido!");
} else {
    alert(`O dobro é ${numero * 2}`);
}
```

> `isNaN` verifica se o valor é `NaN` (Not a Number).

---

## 4) Boas práticas (neste nível)

-   **Browser para começar**: `prompt/alert/confirm` são suficientes para treinar lógica.
-   Converte **explicitamente** as entradas para número (`Number`, `parseFloat`) e valida com `Number.isNaN`.
-   Usa **`console.table`** para verificar arrays/objetos durante a prática.
-   Em Node, escolhe entre **CommonJS** ou **ESM** e sê consistente.
-   Evita deixar `console.log` “espalhados” quando passares para projetos maiores (usar níveis de logging).

---

## 5) Exercícios rápidos

1. **Eco**: pede um nome com `prompt` e mostra `Olá, <nome>!` com `alert`.
2. **Soma validada**: lê dois números; se algum falhar, avisa; senão mostra a soma.
3. **Tabular**: cria um array de 3 alunos `{nome, nota}` e mostra com `console.table`.
4. **Confirmar ação**: pergunta com `confirm` se o utilizador quer continuar; imprime mensagens diferentes consoante a resposta.
5. **Cronometrar**: mede o tempo de uma operação (ex.: somar de 1 a 1e7) e imprime com `console.time/timeEnd`.
6. **Node (opcional)**: reimplementa o exercício 1 usando `readline` (CommonJS **ou** ESM).
