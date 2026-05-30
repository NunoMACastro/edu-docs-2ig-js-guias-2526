![Header](../Images/Header.png)

# [3] Texto, Listas, Links e Media (11.º ano)

## 0) Objetivo do capítulo

Dominar conteúdo textual e multimédia com boas práticas de acessibilidade.

## No fim deste capítulo consegues...

- Escrever texto estruturado com tags corretas.
- Criar links externos seguros.
- Inserir imagens e vídeo com fallback e descrição adequada.

## Vocabulário mínimo

- `alt`: texto alternativo para imagens.
- `fallback`: conteúdo alternativo quando algo falha.
- `noopener noreferrer`: proteção para links em nova aba.
- `figure/figcaption`: bloco de media com legenda.
- `lista ordenada`: sequência com ordem importante.

## 1) Exemplo A (base)

```html
<section class="container">
  <h2>Recursos de estudo</h2>

  <p class="mensagem">Revê os tópicos antes do teste.</p>

  <ol>
    <li>Ler resumo da aula</li>
    <li>Praticar exercícios</li>
    <li>Testar no DevTools</li>
  </ol>

  <p>
    Documentação recomendada:
    <a href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer">MDN</a>
  </p>

  <figure class="cartao">
    <img src="assets/imagens/turma.jpg" alt="Turma do 11.º ano em aula de programação" />
    <figcaption>Prática semanal de frontend.</figcaption>
  </figure>

  <video controls width="480">
    <source src="assets/video/demo.mp4" type="video/mp4" />
    O teu browser não suporta vídeo.
  </video>
</section>
```

## 2) Exemplo B (armadilha comum)

Problema:

```html
<a href="https://example.com" target="_blank">Abrir</a>
<img src="foto.jpg" />
```

Correção:

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Abrir</a>
<img src="foto.jpg" alt="Descrição da foto" />
```

## Checkpoint visual

- Vês lista ordenada, link funcional, imagem com legenda e vídeo.
- O link abre em nova aba sem aviso de segurança.

## DevTools: onde olhar

- `Elements`: confirma `rel="noopener noreferrer"` no link.
- `Elements`: confirma atributo `alt` na imagem.
- `Network`: verifica se imagem e vídeo carregam (`200`).

## Erros comuns

1. Usar links genéricos tipo "clica aqui".
2. Esquecer `alt`.
3. Usar lista errada (`ul` quando devia ser `ol`).

## Exercícios em escada

### Exercício A (guiado)

Cria uma secção com texto, lista ordenada e link externo seguro.

Resultado esperado:

- Link com `target="_blank"` e `rel="noopener noreferrer"`.

### Exercício B (intermédio)

Adiciona uma `figure` com imagem e `figcaption`.

Resultado esperado:

- Imagem visível com legenda e `alt` descritivo.

### Exercício C (aplicação)

Monta uma página de "Recursos da disciplina" com 2 listas, 2 links externos e 1 vídeo.

Resultado esperado:

- Conteúdo claro, estruturado e acessível.

## Changelog

- v1.0.1 - Links externos normalizados com `noopener noreferrer` e bloco multimédia reforçado.
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
