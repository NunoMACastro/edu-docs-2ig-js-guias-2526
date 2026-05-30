![Header](../Images/Header.png)

# [12] Estados Visuais, Interação e Transições (11.º ano)

## 0) Objetivo do capítulo

Melhorar feedback visual de interação sem sacrificar acessibilidade.

## No fim deste capítulo consegues...

- Estilizar estados de botão e cartão com clareza.
- Usar `:focus-visible` em vez de remover foco.
- Respeitar utilizadores com redução de movimento.

## Vocabulário mínimo

- `focus-visible`: foco visível quando apropriado.
- `transition`: animação entre estados.
- `prefers-reduced-motion`: preferência de acessibilidade do utilizador.
- `estado de UI`: loading, erro, sucesso, vazio.
- `feedback`: resposta visual a uma ação.

## 1) Exemplo A (base)

```css
.botao {
  background: #0f766e;
  color: #fff;
  border: 0;
  padding: 10px 14px;
  border-radius: 8px;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.botao:hover {
  transform: translateY(-1px);
}

.botao:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.35);
}

.botao:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cartao {
  transition: transform 160ms ease;
}

.cartao:hover {
  transform: translateY(-2px);
}

.mensagem.is-error {
  border-left: 4px solid #b91c1c;
}

.mensagem.is-success {
  border-left: 4px solid #166534;
}

@media (prefers-reduced-motion: reduce) {
  .botao,
  .cartao {
    transition: none;
  }
}
```

## 2) Exemplo B (armadilha comum)

Problema:

```css
*:focus {
  outline: none;
}
```

Correção: manter foco visível com `:focus-visible`.

## Checkpoint visual

- Botão responde a hover/focus/disabled.
- Cartão anima de forma subtil.
- Com `prefers-reduced-motion`, transições param.

## DevTools: onde olhar

- `Styles`: força estados `:hover`, `:focus-visible`, `:disabled`.
- `Rendering` (quando disponível): simula `prefers-reduced-motion`.

## Erros comuns

1. Retirar foco visível para "limpar" o design.
2. Usar animações longas e distrativas.
3. Usar só cor para indicar estado.

## Exercícios em escada

### Exercício A (guiado)

Estiliza `.botao` com estados hover, focus-visible e disabled.

Resultado esperado:

- Navegação por teclado mantém foco evidente.

### Exercício B (intermédio)

Adiciona `.mensagem.is-error` e `.mensagem.is-success` com reforço visual.

Resultado esperado:

- Estado legível mesmo sem depender só de cor.

### Exercício C (aplicação)

Cria cartões interativos com transição e fallback de movimento reduzido.

Resultado esperado:

- Interação fluida e acessível.

## Changelog

- v1.0.1 - `:focus-visible` e `prefers-reduced-motion` adicionados; classes normalizadas para `.cartao`.
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
