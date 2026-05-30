![Header](../Images/Header.png)

# [4] Tabelas e Conteúdo Estruturado (11.º ano)

## 0) Objetivo do capítulo

Usar tabelas para dados tabulares sem confundir tabela com layout de página.

## No fim deste capítulo consegues...

- Criar tabelas com `caption`, `thead`, `tbody` e `th`.
- Melhorar legibilidade de tabelas com CSS básico.
- Evitar anti-padrões de layout com tabela.

## Vocabulário mínimo

- `tabular`: informação em linhas/colunas.
- `caption`: título da tabela.
- `th`: célula de cabeçalho.
- `tbody`: corpo da tabela.
- `border-collapse`: junta bordas da tabela.

## 1) Exemplo A (base)

```html
<section class="container">
  <h2>Notas - Módulo 1</h2>

  <table class="grelha">
    <caption>Turma 11.º IG</caption>
    <thead>
      <tr>
        <th>Aluno</th>
        <th>Nota</th>
        <th>Situação</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Ana</td>
        <td>17</td>
        <td>Aprovada</td>
      </tr>
      <tr>
        <td>Rui</td>
        <td>11</td>
        <td>Aprovado</td>
      </tr>
    </tbody>
  </table>
</section>
```

```css
.grelha {
  width: 100%;
  border-collapse: collapse;
}

.grelha th,
.grelha td {
  border: 1px solid #d1d5db;
  padding: 8px;
  text-align: left;
}
```

## 2) Exemplo B (armadilha comum)

Problema (usar tabela para layout):

```html
<table>
  <tr>
    <td>Menu</td>
    <td>Conteúdo</td>
  </tr>
</table>
```

Correção: usar `header/main/aside/section` + CSS para layout.

## Checkpoint visual

- Tabela com título, cabeçalho e linhas legíveis.
- Bordas e espaçamento consistentes.

## DevTools: onde olhar

- `Elements`: confirma `caption`, `thead`, `tbody`, `th`.
- `Styles`: confirma `border-collapse: collapse`.

## Erros comuns

1. Colocar texto de cabeçalho em `td`.
2. Omitir `caption` em tabelas relevantes.
3. Excesso de colunas sem necessidade.

## Exercícios em escada

### Exercício A (guiado)

Cria tabela de horários com 3 colunas e 5 linhas.

Resultado esperado:

- Estrutura completa com `thead` e `tbody`.

### Exercício B (intermédio)

Aplica estilo para melhorar leitura (bordas, padding, zebra opcional).

Resultado esperado:

- Tabela visualmente clara e alinhada.

### Exercício C (aplicação)

Cria tabela de avaliação com status e nota final.

Resultado esperado:

- Dados legíveis, sem uso indevido de tabela para layout.

## Changelog

- v1.0.1 - Exemplo tabular completo, anti-padrão de layout clarificado e exercícios A/B/C alinhados.
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
