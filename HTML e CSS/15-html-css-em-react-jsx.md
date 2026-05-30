![Header](../Images/Header.png)

# [15] HTML/CSS em React e JSX (11.º ano)

## 0) Objetivo do capítulo

Traduzir HTML/CSS clássico para React com sintaxe e convenções corretas.

## No fim deste capítulo consegues...

- Converter HTML para JSX sem erros comuns.
- Aplicar classes de estado em React com consistência.
- Organizar CSS por componente com import explícito.

## Vocabulário mínimo

- `JSX`: sintaxe declarativa para UI em React.
- `className`: atributo de classe em JSX.
- `camelCase`: padrão de nomes em atributos/eventos React.
- `props`: dados passados entre componentes.
- `estado`: dados internos que controlam UI.

## 1) Exemplo A (base)

`BotaoPrimario.jsx`

```jsx
import './BotaoPrimario.css';

export default function BotaoPrimario({ texto, desativado, onClick }) {
  return (
    <button className="botao" disabled={desativado} onClick={onClick} tabIndex={0}>
      {texto}
    </button>
  );
}
```

`BotaoPrimario.css`

```css
.botao {
  background: #0f766e;
  color: #fff;
  border: 0;
  padding: 10px 14px;
  border-radius: 8px;
}
```

## 2) Exemplo B (3 armadilhas essenciais)

### Armadilha 1: `style` em JSX

Errado:

```jsx
<div style="color: red">Erro</div>
```

Certo:

```jsx
<div style={{ color: 'red' }}>Erro</div>
```

### Armadilha 2: atributos/eventos

Errado: `onclick`, `tabindex`, `class`

Certo: `onClick`, `tabIndex`, `className`

### Armadilha 3: esquecer import de CSS

Se usas CSS por componente, importa explicitamente:

```jsx
import './BotaoPrimario.css';
```

## Checkpoint visual

- Componente renderiza com estilo aplicado.
- Evento `onClick` dispara sem erro.
- `style={{ ... }}` funciona quando usado.

## DevTools: onde olhar

- `React DevTools`: confirma props do componente.
- `Elements`: valida classes finais no DOM.
- `Console`: apanha warnings de JSX.

## Erros comuns

1. Copiar HTML puro para JSX sem adaptar atributos.
2. Misturar estilos inline e classes sem critério.
3. Criar classes com nomes inconsistentes (`.card` vs `.cartao`).

## Exercícios em escada

### Exercício A (guiado)

Converte um bloco HTML simples para componente React.

Resultado esperado:

- JSX válido com `className` e `htmlFor`.

### Exercício B (intermédio)

Cria componente `CartaoAluno` com estados visuais (`.is-success`, `.is-error`).

Resultado esperado:

- Estado visual muda por props.

### Exercício C (aplicação)

Replica secção do mini-projeto com React, mantendo classes em PT.

Resultado esperado:

- UI coerente com capítulos de HTML/CSS e React.

## Changelog

- v1.0.1 - Armadilhas críticas de JSX adicionadas (`style` objeto, camelCase e import CSS).
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
