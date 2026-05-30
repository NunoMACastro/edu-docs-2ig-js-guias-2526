![Header](../Images/Header.png)

# [11] Responsividade Mobile-First (11.º ano)

## 0) Objetivo do capítulo

Desenhar interfaces que funcionam primeiro em mobile e escalam com segurança para tablet/desktop.

## No fim deste capítulo consegues...

- Aplicar abordagem mobile-first com breakpoints claros.
- Usar container com largura máxima de forma robusta.
- Validar comportamento em 375px, 768px e 1024px.

## Vocabulário mínimo

- `mobile-first`: começar pelo menor ecrã.
- `breakpoint`: ponto de mudança de layout.
- `max-width`: limite superior de largura.
- `min()`: função CSS para limites responsivos.
- `viewport`: janela visível no dispositivo.

## 1) Exemplo A (base)

```css
.container {
  width: min(100% - 24px, 1100px);
  margin-inline: auto;
}

.grelha {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 768px) {
  .grelha {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grelha {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 2) Exemplo B (armadilha comum)

Problema: definir primeiro layout desktop e tentar "encolher" depois.

Correção: começa com 1 coluna e adiciona colunas nos breakpoints.

## Checkpoint visual

- **375px:** 1 coluna, leitura confortável, sem scroll horizontal.
- **768px:** 2 colunas com espaçamento regular.
- **1024px:** 3 colunas estáveis e centradas no container.

## DevTools: onde olhar

- `Toggle Device Toolbar`: simula 375, 768 e 1024.
- `Styles`: confirma media query ativa em cada largura.
- `Layout`: valida grelha e gaps.

## Erros comuns

1. Usar larguras fixas (`width: 1200px`) em mobile.
2. Esquecer `meta viewport` no HTML.
3. Não testar imagens grandes.

## Exercícios em escada

### Exercício A (guiado)

Cria `.container` com `width: min(...)` e uma grelha de 1 coluna.

Resultado esperado:

- Conteúdo centrado e sem overflow.

### Exercício B (intermédio)

Adiciona breakpoints para 2 e 3 colunas.

Resultado esperado:

- Reorganização automática em 768/1024.

### Exercício C (aplicação)

Monta página com navbar + grelha de cartões e valida nos 3 checkpoints.

Resultado esperado:

- Layout responsivo completo e consistente.

## Changelog

- v1.0.1 - Container com `width: min(...)` e checkpoints 375/768/1024 adicionados.
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
