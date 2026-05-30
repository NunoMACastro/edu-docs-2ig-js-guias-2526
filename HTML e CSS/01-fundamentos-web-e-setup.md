![Header](../Images/Header.png)

# [1] Fundamentos Web e Setup (11.º ano)

## 0) Objetivo do capítulo

Perceber como HTML, CSS e JavaScript colaboram no browser e preparar um ambiente base estável.

## No fim deste capítulo consegues...

- Explicar o papel de HTML, CSS e JavaScript na mesma página.
- Criar uma estrutura de projeto mínima com caminhos corretos.
- Usar DevTools para confirmar se ficheiros estão a carregar.

## Vocabulário mínimo

- `DOM`: representação em árvore do HTML no browser.
- `viewport`: área visível da página no dispositivo.
- `path relativo`: caminho baseado na pasta do ficheiro atual.
- `defer`: adia execução do script até o HTML estar lido.
- `render`: processo de desenhar a interface no ecrã.
- `DevTools`: ferramentas de inspeção e depuração no browser.

## 1) Estrutura base recomendada

```text
mini-projeto/
  index.html
  css/
    base.css
    layout.css
    components.css
  js/
    main.js
```

## 2) Exemplo A (base)

`index.html`

```html
<!doctype html>
<html lang="pt-PT">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Primeira Página</title>
    <link rel="stylesheet" href="css/base.css" />
    <link rel="stylesheet" href="css/layout.css" />
    <link rel="stylesheet" href="css/components.css" />
  </head>
  <body>
    <main class="container">
      <h1>Olá, turma</h1>
      <p class="mensagem">Projeto base pronto.</p>
      <button class="botao" id="btn-teste">Testar</button>
    </main>

    <script defer src="js/main.js"></script>
  </body>
</html>
```

`css/base.css`

```css
html,
body {
  margin: 0;
  padding: 0;
}

```

`css/layout.css`

```css
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
}
```

`css/components.css`

```css
.botao {
  padding: 8px 12px;
}
```

`js/main.js`

```js
const botao = document.querySelector('#btn-teste');
botao?.addEventListener('click', () => {
  console.log('Clique registado com sucesso.');
});
```

## 3) Exemplo B (armadilha comum)

Problema:

```html
<link rel="stylesheet" href="base.css" />
<script src="main.js"></script>
```

Se os ficheiros estão em `css/` e `js/`, os caminhos falham.

Correção:

```html
<link rel="stylesheet" href="css/base.css" />
<link rel="stylesheet" href="css/layout.css" />
<link rel="stylesheet" href="css/components.css" />
<script defer src="js/main.js"></script>
```

## Checkpoint visual

- Vês o título, o parágrafo e o botão com espaçamento.
- Ao clicar no botão, aparece log na consola.
- Não há erros 404 no separador Network.

## DevTools: onde olhar

- `Elements`: confirma `<link>` e `<script defer ...>`.
- `Network`: verifica `css/base.css`, `css/layout.css`, `css/components.css` e `js/main.js` com estado `200`.
- `Console`: confirma ausência de `Uncaught` erros.

## Erros comuns

1. Esquecer `defer` e aceder ao DOM antes do tempo.
2. Usar caminhos absolutos sem necessidade.
3. Esquecer `meta viewport` e quebrar mobile.

## Exercícios em escada

### Exercício A (guiado)

Cria a estrutura de pastas e liga os 3 CSS + `js/main.js` com os caminhos corretos.

Resultado esperado:

- Página abre sem erros.
- Botão gera log na consola.

### Exercício B (intermédio)

Adiciona um segundo botão e imprime mensagens diferentes no clique.

Resultado esperado:

- Cada botão dispara o seu próprio log.

### Exercício C (aplicação)

Monta uma landing simples com `header`, `main` e `footer`, mantendo os caminhos corretos e `defer`.

Resultado esperado:

- Estrutura semântica mínima funcional.
- Sem erros em Console e Network.

## Changelog

- v1.0.2 - Estrutura base alinhada ao padrão canónico (`base/layout/components` + `main.js`).
- v1.0.1 - Caminhos corrigidos (`css/` e `js/`), `defer` adicionado e exercícios A/B/C normalizados.
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
