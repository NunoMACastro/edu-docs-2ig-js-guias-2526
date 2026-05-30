![Header](../Images/Header.png)

# [8] Tipografia, Cores e Variáveis CSS (11.º ano)

## 0) Objetivo do capítulo

Criar uma linguagem visual consistente com tokens reutilizáveis.

## No fim deste capítulo consegues...

- Definir tokens visuais em `:root`.
- Aplicar tipografia e cores de forma uniforme.
- Estilizar `.cartao`, `.botao`, `.mensagem` e `.input` com variáveis.

## Vocabulário mínimo

- `token`: variável de design reutilizável.
- `:root`: seletor global para variáveis CSS.
- `focus ring`: realce visual de foco.
- `contraste`: diferença entre texto e fundo.
- `escala tipográfica`: níveis de tamanho de texto.

## 1) O que são tokens (versão curta)

Tokens são valores de design guardados em variáveis (`--cor-primaria`, `--espaco-2`) para evitar repetição e manter consistência. Alteras um valor e todo o projeto acompanha.

## 2) Exemplo A (base completo)

```css
:root {
  --cor-fundo: #f8fafc;
  --cor-texto: #1f2937;
  --cor-primaria: #0f766e;
  --cor-borda: #d1d5db;
  --cor-erro: #b91c1c;
  --cor-sucesso: #166534;
  --focus-ring: 0 0 0 3px rgba(15, 118, 110, 0.35);

  --espaco-1: 8px;
  --espaco-2: 12px;
  --espaco-3: 16px;
}

body {
  font-family: "Segoe UI", sans-serif;
  background: var(--cor-fundo);
  color: var(--cor-texto);
}

.cartao {
  border: 1px solid var(--cor-borda);
  padding: var(--espaco-3);
  border-radius: 10px;
}

.botao {
  background: var(--cor-primaria);
  color: #fff;
  border: 0;
  padding: var(--espaco-1) var(--espaco-2);
}

.input {
  width: 100%;
  border: 1px solid var(--cor-borda);
  padding: var(--espaco-1);
}

.input:focus-visible,
.botao:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.mensagem.is-error {
  color: var(--cor-erro);
}

.mensagem.is-success {
  color: var(--cor-sucesso);
}
```

## 3) Exemplo B (armadilha comum)

Problema: cores e espaçamentos "hardcoded" em todo o lado.

Correção: substituir valores repetidos por tokens em `:root`.

## Checkpoint visual

- Botões e inputs partilham linguagem visual.
- Mensagens de erro/sucesso distinguem-se facilmente.
- Focus ring é visível ao navegar por teclado.

## DevTools: onde olhar

- `Styles`: confirma leitura de `var(--...)`.
- `Computed`: vê valor final de cor e padding.
- Força `:focus-visible` para testar focus ring.

## Erros comuns

1. Criar variáveis sem padrão de nomes.
2. Misturar unidades sem critério.
3. Usar contraste fraco em texto principal.

## Exercícios em escada

### Exercício A (guiado)

Define 6 tokens de cor e 4 de espaçamento.

Resultado esperado:

- Projeto usa `var(...)` em componentes principais.

### Exercício B (intermédio)

Aplica tokens em `.cartao`, `.botao`, `.mensagem` e `.input`.

Resultado esperado:

- Estilo consistente e fácil de alterar.

### Exercício C (aplicação)

Cria tema alternativo (ex.: "tema prova") mudando só `:root`.

Resultado esperado:

- Interface muda sem alterar classes dos componentes.

## Changelog

- v1.0.1 - Secção de tokens adicionada, `--focus-ring` incluído e exemplo completo de componentes normalizados.
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
