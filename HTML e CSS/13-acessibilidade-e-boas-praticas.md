![Header](../Images/Header.png)

# [13] Acessibilidade e Boas Práticas (11.º ano)

## 0) Objetivo do capítulo

Garantir que a interface é utilizável por teclado, legível e semanticamente correta.

## No fim deste capítulo consegues...

- Implementar skip link e foco visível.
- Marcar erros de formulário com `aria-describedby` e `aria-invalid`.
- Comunicar estado sem depender apenas de cor.

## Vocabulário mínimo

- `skip link`: link para saltar diretamente ao conteúdo principal.
- `aria-invalid`: marca campo com erro.
- `aria-describedby`: liga campo à mensagem de ajuda/erro.
- `focus ring`: realce visual de foco.
- `landmark`: secção estrutural relevante (`main`, `nav`, `footer`).

## 1) Exemplo A (base)

```html
<a class="skip-link" href="#conteudo">Saltar para o conteúdo</a>

<header class="barra container">
  <h1>Painel de Estudo</h1>
</header>

<main id="conteudo" class="container">
  <form class="cartao" novalidate>
    <label for="email">Email</label>
    <input
      class="input"
      id="email"
      name="email"
      type="email"
      aria-invalid="true"
      aria-describedby="erro-email"
    />
    <p id="erro-email" class="mensagem is-error">Introduz um email válido.</p>

    <button class="botao" type="submit">Validar</button>
  </form>
</main>
```

```css
.skip-link {
  position: absolute;
  left: -9999px;
}

.skip-link:focus-visible {
  left: 16px;
  top: 16px;
  background: #111827;
  color: #fff;
  padding: 8px;
}

.mensagem.is-error {
  color: #b91c1c;
  border-left: 4px solid #b91c1c;
  padding-left: 8px;
}
```

## 2) Exemplo B (armadilha comum)

Problema: erro indicado só por cor.

Correção:

- Manter cor.
- Adicionar ícone/texto explícito.
- Adicionar borda/estilo adicional.

## Checkpoint visual

- `Tab` no início mostra skip link.
- Campo inválido está ligado à mensagem de erro.
- Erro compreensível mesmo em escala de cinzentos.

## DevTools: onde olhar

- `Elements`: confirma `aria-invalid` e `aria-describedby`.
- `Accessibility` (quando disponível): valida nome e descrição do input.
- Testa navegação só com teclado (`Tab`, `Shift+Tab`, `Enter`).

## Erros comuns

1. Esconder foco de teclado.
2. Repetir `id` de mensagens de erro.
3. Marcar estado só por cor sem texto.

## Exercícios em escada

### Exercício A (guiado)

Adiciona skip link e foco visível numa página existente.

Resultado esperado:

- `Tab` inicial mostra link de salto funcional.

### Exercício B (intermédio)

Aplica erro acessível a 2 campos de formulário.

Resultado esperado:

- Cada campo inválido aponta para a sua mensagem.

### Exercício C (aplicação)

Faz mini-auditoria de acessibilidade ao teu mini-projeto.

Resultado esperado:

- Lista de correções aplicada e verificada com teclado.

## Changelog

- v1.0.1 - Skip link e validação acessível com `aria-*` adicionados; regra "não usar só cor" reforçada.
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
