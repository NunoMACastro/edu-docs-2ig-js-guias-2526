![Header](../Images/Header.png)

# [14] Ponte para DOM e JavaScript (11.º ano)

## 0) Objetivo do capítulo

Preparar HTML/CSS para manipulação de DOM com JavaScript de forma limpa e previsível.

## No fim deste capítulo consegues...

- Estruturar formulário com `id`, `name` e `label` corretos.
- Evitar itens vazios com `trim()`.
- Usar delegação de eventos com `data-action`.

## Vocabulário mínimo

- `querySelector`: seleção de elementos no DOM.
- `trim()`: remove espaços no início/fim de texto.
- `delegação de eventos`: listener único para vários elementos.
- `dataset`: acesso a atributos `data-*`.
- `estado visual`: classes que representam estado da UI.

## 1) Exemplo A (base)

```html
<section class="container cartao" data-modulo="tarefas">
  <h2>Tarefas</h2>

  <form id="form-tarefa">
    <label for="input-tarefa">Nova tarefa</label>
    <input id="input-tarefa" name="tarefa" class="input" type="text" required />
    <button class="botao" type="submit">Adicionar</button>
  </form>

  <p id="msg-tarefa" class="mensagem is-error hidden">Escreve uma tarefa válida.</p>
  <ul id="lista-tarefas"></ul>
</section>
```

```js
const form = document.querySelector('#form-tarefa');
const input = document.querySelector('#input-tarefa');
const lista = document.querySelector('#lista-tarefas');
const msg = document.querySelector('#msg-tarefa');

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  const texto = input.value.trim();
  if (!texto) {
    msg.classList.remove('hidden');
    return;
  }

  msg.classList.add('hidden');

  const li = document.createElement('li');
  li.className = 'cartao';
  const span = document.createElement('span');
  span.textContent = texto;

  const botaoConcluir = document.createElement('button');
  botaoConcluir.className = 'botao';
  botaoConcluir.type = 'button';
  botaoConcluir.dataset.action = 'concluir';
  botaoConcluir.textContent = 'Concluir';

  const botaoRemover = document.createElement('button');
  botaoRemover.className = 'botao';
  botaoRemover.type = 'button';
  botaoRemover.dataset.action = 'remover';
  botaoRemover.textContent = 'Remover';

  li.append(span, botaoConcluir, botaoRemover);

  lista.append(li);
  input.value = '';
});
```

## 2) Exemplo B (delegação de eventos)

```js
lista?.addEventListener('click', (event) => {
  const botao = event.target.closest('button[data-action]');
  if (!botao) return;

  const item = botao.closest('li');
  const acao = botao.dataset.action;

  if (acao === 'remover') item?.remove();
  if (acao === 'concluir') item?.classList.toggle('is-done');
});
```

## Checkpoint visual

- Não adiciona tarefas vazias.
- Botão "Concluir" alterna classe `.is-done`.
- Botão "Remover" apaga o item certo.

## DevTools: onde olhar

- `Elements`: confirma `data-action` nos botões.
- `Console`: faz `console.log(event.target)` para depurar cliques.
- `Event Listeners`: confirma listener no `ul`, não em cada botão.

## Erros comuns

1. Esquecer `name` no `input`.
2. Validar texto sem `trim()`.
3. Criar vários listeners em vez de delegação.

## Exercícios em escada

### Exercício A (guiado)

Implementa formulário com validação de vazio via `trim()`.

Resultado esperado:

- Input vazio mostra mensagem e não cria item.

### Exercício B (intermédio)

Adiciona botões `concluir` e `remover` usando `data-action`.

Resultado esperado:

- Ações funcionam por delegação no `ul`.

### Exercício C (aplicação)

Adiciona filtro de tarefas (`todas`, `feitas`, `por fazer`) usando classes.

Resultado esperado:

- Estado da lista atualiza sem recarregar página.

## Changelog

- v1.0.2 - Exemplo de criação de itens atualizado para evitar `innerHTML` inseguro.
- v1.0.1 - Formulário com `label` + `name`, validação com `trim()` e delegação com `data-action` adicionados.
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
