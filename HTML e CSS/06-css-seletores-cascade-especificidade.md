![Header](../Images/Header.png)

# [6] Seletores, Cascade e Especificidade (11.º ano)

## 0) Objetivo do capítulo

Perceber como o browser decide qual regra CSS aplicar e resolver conflitos sem `!important`.

## No fim deste capítulo consegues...

- Identificar diferenças entre seletor de elemento, classe e id.
- Explicar por que uma regra ganhou noutra situação.
- Corrigir conflitos de estilo com estratégia limpa.

## Vocabulário mínimo

- `cascade`: ordem final de aplicação das regras.
- `especificidade`: peso relativo de um seletor.
- `seletor descendente`: estilo aplicado com base na estrutura.
- `pseudo-classe`: estado do elemento (`:hover`, `:focus-visible`).
- `anti-padrão`: solução que complica manutenção.

## 1) Exemplo A (base)

```html
<section class="container">
  <p class="mensagem" id="aviso">Mensagem importante</p>
  <button class="botao">Continuar</button>
</section>
```

```css
p {
  color: #1f2937;
}

.mensagem {
  color: #065f46;
}

#aviso {
  color: #b91c1c;
}

.botao:hover {
  background: #0f766e;
  color: #fff;
}
```

## 2) Exemplo B (armadilha comum + correção)

Problema real:

```css
.cartao .mensagem {
  color: #065f46;
}

#painel .mensagem {
  color: #b91c1c;
}

.mensagem {
  color: #1f2937 !important;
}
```

Correção sem `!important`:

```css
/* 1) Definir base */
.mensagem {
  color: #1f2937;
}

/* 2) Definir estado/contexto com mais clareza */
#painel .mensagem {
  color: #b91c1c;
}
```

Regra prática: simplifica seletor, remove duplicação, controla ordem.

## Checkpoint visual

- A mensagem com `id="aviso"` fica vermelha.
- Botão muda no hover sem quebrar outros estilos.

## DevTools: onde olhar

- `Elements > Styles`: vê regras riscadas e regra vencedora.
- `Computed`: confirma o valor final de `color`.
- Passa o rato para testar `:hover` em tempo real.

## Erros comuns

1. Acumular seletores longos e frágeis.
2. Usar `!important` como primeira opção.
3. Misturar estilos de estado com estilos base sem critério.

## Exercícios em escada

### Exercício A (guiado)

Cria 3 regras para a mesma propriedade (`elemento`, `.classe`, `#id`) e observa o vencedor.

Resultado esperado:

- Consegues explicar o vencedor por especificidade.

### Exercício B (intermédio)

Simula conflito real em `.mensagem` e resolve sem `!important`.

Resultado esperado:

- CSS mais curto e previsível.

### Exercício C (aplicação)

Implementa estilos de `.mensagem` para estado normal, erro e sucesso.

Resultado esperado:

- Estados visuais claros sem conflitos inesperados.

## Changelog

- v1.0.1 - Conflito real de cascade adicionado e estratégia sem `!important` formalizada.
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
