# [5] Formulários HTML e Validação Nativa (11.º ano)

## 0) Objetivo do capítulo

Criar formulários usáveis e acessíveis com validação nativa, preparando a ponte para React.

## No fim deste capítulo consegues...

- Montar formulários com `label` obrigatório para cada campo.
- Aplicar validação nativa (`required`, `minlength`, `pattern`, etc.).
- Diagnosticar rapidamente erros de submissão no DevTools.

## Vocabulário mínimo

- `label`: descrição associada ao campo.
- `required`: campo obrigatório.
- `pattern`: expressão para validar formato.
- `aria-invalid`: estado de erro para acessibilidade.
- `name`: chave enviada no submit do formulário.

## 1) Exemplo A (base)

```html
<form class="container cartao" action="/inscricao" method="post" novalidate>
  <h2>Registo</h2>

  <label for="nome">Nome</label>
  <input class="input" id="nome" name="nome" type="text" minlength="2" required />

  <label for="email">Email</label>
  <input class="input" id="email" name="email" type="email" required />

  <label for="password">Palavra-passe</label>
  <input class="input" id="password" name="password" type="password" minlength="8" required />

  <label>
    <input id="termos" name="termos" type="checkbox" required />
    Aceito os termos
  </label>

  <button class="botao" type="submit">Enviar</button>
  <p class="mensagem is-error hidden" id="erro-form">Verifica os campos assinalados.</p>
</form>
```

## 2) Exemplo B (armadilha comum)

Problema (campo sem label):

```html
<input id="email" type="email" required />
```

Correção:

```html
<label for="email">Email</label>
<input id="email" name="email" type="email" required />
```

## Checkpoint visual

- Todos os campos têm texto associado.
- O botão submete apenas quando os campos estão válidos.

## DevTools: onde olhar

- `Elements`: confirma `for` no `label` e `id` no `input`.
- `Console`: valida se não há erros JS no submit.
- `Network`: confirma se o request só dispara quando válido.

## Erros comuns

1. Usar `placeholder` no lugar de `label`.
2. Esquecer `name`, impedindo envio correto dos dados.
3. Misturar validação nativa com lógica JS sem estratégia clara.

## Exercícios em escada

### Exercício A (guiado)

Constrói um formulário de contacto com `nome`, `email` e `mensagem`.

Resultado esperado:

- Todos os campos têm `label` + `name`.

### Exercício B (intermédio)

Adiciona validação para palavra-passe e checkbox de termos.

Resultado esperado:

- Formulário não submete sem requisitos cumpridos.

### Exercício C (aplicação)

Cria formulário de inscrição completo com feedback de erro em `.mensagem.is-error`.

Resultado esperado:

- Fluxo de validação claro e acessível.

## Changelog

- v1.0.1 - Regras de `label`/`name` reforçadas, exemplos A/B ajustados e exercícios A/B/C adicionados.
- v1.0.0 - Capítulo criado.
