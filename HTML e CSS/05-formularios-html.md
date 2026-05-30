![Header](../Images/Header.png)

# [5] Formulários HTML e Validação Nativa (11.º ano)

## 0) Objetivo do capítulo

Construir formulários completos, usáveis e acessíveis, cobrindo as tags principais e os tipos de `input` usados no dia a dia.

## No fim deste capítulo consegues...

- Estruturar formulários com semântica (`form`, `fieldset`, `legend`, `label`).
- Usar os controlos de formulário principais (`input`, `textarea`, `select`, `datalist`, `button`, `output`, `meter`, `progress`).
- Aplicar validação nativa (`required`, `minlength`, `pattern`, `min/max`, etc.).
- Diagnosticar problemas de submissão no DevTools.

## Vocabulário mínimo

- `form`: contentor de submissão de dados.
- `name`: chave enviada no submit.
- `label`: texto associado ao controlo.
- `required`: campo obrigatório.
- `pattern`: expressão regular para validar formato.
- `fieldset` e `legend`: agrupamento semântico de campos.
- `aria-invalid`: marca estado inválido para acessibilidade.

## 1) Anatomia de um formulário moderno

Tags mais importantes dentro de um formulário:

- `form`: define ação (`action`), método (`method`) e formato de envio (`enctype`).
- `label`: obrigatório para campos visíveis.
- `input`: múltiplos tipos (`text`, `email`, `password`, etc.).
- `textarea`: texto longo.
- `select`, `option`, `optgroup`: listas de escolha.
- `datalist`: sugestões para `input`.
- `fieldset` e `legend`: secções de formulário.
- `button`: ações (`submit`, `reset`, `button`).
- `output`: valor calculado em tempo real.
- `meter`: indicador de valor dentro de intervalo.
- `progress`: progresso de tarefa.
- `object` (raro): conteúdo externo associado ao formulário.

## 2) Exemplo A (formulário completo com várias tags)

```html
<form
  class="container cartao"
  action="/inscricao"
  method="post"
  enctype="multipart/form-data"
  autocomplete="on"
>
  <h2>Ficha de inscrição</h2>
  <p class="mensagem">Preenche os campos obrigatórios antes de submeter.</p>

  <fieldset>
    <legend>Dados pessoais</legend>

    <label for="nome">Nome completo</label>
    <input class="input" id="nome" name="nome" type="text" minlength="2" required />

    <label for="email">Email</label>
    <input class="input" id="email" name="email" type="email" autocomplete="email" required />

    <label for="password">Palavra-passe</label>
    <input
      class="input"
      id="password"
      name="password"
      type="password"
      minlength="8"
      autocomplete="new-password"
      required
    />

    <label for="telemovel">Telemóvel</label>
    <input
      class="input"
      id="telemovel"
      name="telemovel"
      type="tel"
      pattern="^9[1236][0-9]{7}$"
      placeholder="912345678"
      required
    />

    <label for="curso">Curso pretendido</label>
    <input class="input" id="curso" name="curso" type="text" list="lista-cursos" required />
    <datalist id="lista-cursos">
      <option value="Técnico de Gestão e Programação de Sistemas Informáticos"></option>
      <option value="Técnico de Multimédia"></option>
      <option value="Técnico de Redes"></option>
    </datalist>

    <label for="bio">Mini apresentação</label>
    <textarea
      class="input"
      id="bio"
      name="bio"
      rows="4"
      maxlength="300"
      placeholder="Fala um pouco sobre os teus interesses."
    ></textarea>
  </fieldset>

  <fieldset>
    <legend>Preferências</legend>

    <p>Turno preferido</p>
    <label for="manha">
      <input id="manha" name="turno" type="radio" value="manha" required />
      Manhã
    </label>
    <label for="tarde">
      <input id="tarde" name="turno" type="radio" value="tarde" />
      Tarde
    </label>

    <p>Tecnologias com que já tiveste contacto</p>
    <label for="html">
      <input id="html" name="tecnologias" type="checkbox" value="html" />
      HTML
    </label>
    <label for="css">
      <input id="css" name="tecnologias" type="checkbox" value="css" />
      CSS
    </label>
    <label for="js">
      <input id="js" name="tecnologias" type="checkbox" value="js" />
      JavaScript
    </label>

    <label for="nivel">Nível de confiança (1 a 10)</label>
    <input
      class="input"
      id="nivel"
      name="nivel"
      type="range"
      min="1"
      max="10"
      value="5"
      oninput="nivelOutput.value = nivel.value"
    />
    <output id="nivelOutput" for="nivel">5</output>

    <label for="progresso">Progresso de candidatura</label>
    <progress id="progresso" value="60" max="100">60%</progress>

    <label for="forcaPassword">Força mínima da palavra-passe</label>
    <meter id="forcaPassword" min="0" max="4" low="1" high="3" optimum="4" value="2">
      2 de 4
    </meter>
  </fieldset>

  <fieldset>
    <legend>Documentos e confirmação</legend>

    <label for="cv">CV (PDF)</label>
    <input class="input" id="cv" name="cv" type="file" accept=".pdf" required />

    <label for="portfolio">Portefólio (imagens)</label>
    <input class="input" id="portfolio" name="portfolio" type="file" accept="image/*" multiple />

    <label for="cor">Cor favorita para perfil</label>
    <input id="cor" name="cor" type="color" value="#2563eb" />

    <input id="origem" name="origem" type="hidden" value="campanha-escola" />

    <label for="termos">
      <input id="termos" name="termos" type="checkbox" required />
      Aceito os termos e condições
    </label>
  </fieldset>

  <div class="acoes">
    <button class="botao" type="submit">Submeter</button>
    <button class="botao botao-secundario" type="reset">Limpar</button>
    <button class="botao botao-secundario" type="button">Guardar rascunho</button>
  </div>

  <p class="mensagem is-error hidden" id="erro-form">Verifica os campos assinalados.</p>
</form>
```

## 3) Todos os `input type` relevantes

| Tipo | Uso principal | Exemplo |
| --- | --- | --- |
| `text` | texto curto | nome |
| `email` | valida formato de email | email escolar |
| `password` | texto oculto | palavra-passe |
| `tel` | telefone | telemóvel |
| `url` | ligação web | site/portefólio |
| `search` | pesquisa | barra de pesquisa |
| `number` | valor numérico | idade |
| `range` | valor por deslize | nível 1-10 |
| `date` | data | data de nascimento |
| `time` | hora | hora preferida |
| `datetime-local` | data e hora local | marcação |
| `month` | mês/ano | período |
| `week` | semana/ano | planeamento |
| `color` | seletor de cor | tema |
| `file` | envio de ficheiros | CV |
| `checkbox` | escolha múltipla | interesses |
| `radio` | escolha única | turno |
| `hidden` | valor invisível | origem da campanha |
| `submit` | submeter formulário | enviar |
| `reset` | repor campos | limpar |
| `button` | ação JS personalizada | abrir modal |
| `image` | botão submit com imagem | botão gráfico |

Nota: o tipo `datetime` foi removido do padrão moderno. Usa `date` + `time` ou `datetime-local`.

## 4) Exemplo B (laboratório de tipos `input`)

```html
<form class="container cartao" action="/laboratorio" method="get">
  <h2>Laboratório de inputs</h2>

  <label for="i-text">text</label>
  <input id="i-text" name="text" type="text" />

  <label for="i-email">email</label>
  <input id="i-email" name="email" type="email" />

  <label for="i-password">password</label>
  <input id="i-password" name="password" type="password" />

  <label for="i-tel">tel</label>
  <input id="i-tel" name="tel" type="tel" />

  <label for="i-url">url</label>
  <input id="i-url" name="url" type="url" />

  <label for="i-search">search</label>
  <input id="i-search" name="search" type="search" />

  <label for="i-number">number</label>
  <input id="i-number" name="number" type="number" min="0" max="100" step="1" />

  <label for="i-range">range</label>
  <input id="i-range" name="range" type="range" min="0" max="100" />

  <label for="i-date">date</label>
  <input id="i-date" name="date" type="date" />

  <label for="i-time">time</label>
  <input id="i-time" name="time" type="time" />

  <label for="i-datetime-local">datetime-local</label>
  <input id="i-datetime-local" name="datetime_local" type="datetime-local" />

  <label for="i-month">month</label>
  <input id="i-month" name="month" type="month" />

  <label for="i-week">week</label>
  <input id="i-week" name="week" type="week" />

  <label for="i-color">color</label>
  <input id="i-color" name="color" type="color" />

  <label for="i-file">file</label>
  <input id="i-file" name="file" type="file" />

  <input id="i-hidden" name="hidden" type="hidden" value="valor-oculto" />

  <p>checkbox</p>
  <label for="i-check-a"><input id="i-check-a" name="check_a" type="checkbox" /> Opção A</label>
  <label for="i-check-b"><input id="i-check-b" name="check_b" type="checkbox" /> Opção B</label>

  <p>radio</p>
  <label for="i-radio-a"><input id="i-radio-a" name="grupo_radio" type="radio" value="a" /> A</label>
  <label for="i-radio-b"><input id="i-radio-b" name="grupo_radio" type="radio" value="b" /> B</label>

  <input type="submit" value="submit" />
  <input type="reset" value="reset" />
  <input type="button" value="button" />
  <input type="image" src="/assets/send.png" alt="Enviar" />
</form>
```

## 5) Validação nativa: atributos obrigatórios de dominar

| Atributo | Aplicação | Exemplo |
| --- | --- | --- |
| `required` | campo obrigatório | `required` |
| `minlength` e `maxlength` | tamanho de texto | `minlength="8"` |
| `min`, `max`, `step` | valores numéricos/data | `min="0" max="20"` |
| `pattern` | formato customizado | telefone/NIF |
| `multiple` | múltiplos valores | `file`, `email` |
| `accept` | tipos de ficheiro | `.pdf,image/*` |
| `readonly` | bloqueado mas enviado | nº aluno |
| `disabled` | bloqueado e não enviado | campo inativo |
| `autocomplete` | preenchimento automático | `autocomplete="email"` |

Exemplo de `pattern` (NIF português simplificado):

```html
<label for="nif">NIF</label>
<input id="nif" name="nif" type="text" pattern="^[1-9][0-9]{8}$" required />
```

## 6) `select`, `option`, `optgroup` e `textarea`

```html
<label for="disciplina">Disciplina favorita</label>
<select id="disciplina" name="disciplina" required>
  <optgroup label="Tecnológicas">
    <option value="ai">Arquitetura de Computadores</option>
    <option value="ps">Programação de Sistemas</option>
  </optgroup>
  <optgroup label="Gerais">
    <option value="pt">Português</option>
    <option value="mat">Matemática</option>
  </optgroup>
</select>

<label for="mensagem">Mensagem</label>
<textarea id="mensagem" name="mensagem" rows="5" cols="30"></textarea>
```

## 7) Exemplo C (armadilhas comuns e correção)

Problema 1: campo sem `name` (não segue no submit).

```html
<label for="email">Email</label>
<input id="email" type="email" required />
```

Correção:

```html
<label for="email">Email</label>
<input id="email" name="email" type="email" required />
```

Problema 2: `placeholder` usado como label.

```html
<input id="nome" name="nome" placeholder="Nome completo" />
```

Correção:

```html
<label for="nome">Nome completo</label>
<input id="nome" name="nome" type="text" placeholder="Ex: Ana Silva" />
```

Problema 3: `id` repetidos em radios.

```html
<input id="turno" name="turno" type="radio" value="manha" />
<input id="turno" name="turno" type="radio" value="tarde" />
```

Correção:

```html
<input id="turno-manha" name="turno" type="radio" value="manha" />
<input id="turno-tarde" name="turno" type="radio" value="tarde" />
```

## 8) Acessibilidade mínima obrigatória

- Cada controlo visível deve ter `label`.
- Usa `fieldset` e `legend` para grupos (ex.: morada, pagamento, preferências).
- Mensagens de erro devem ser explícitas.
- Usa `aria-invalid="true"` quando o campo falha validação.
- Liga erro ao campo com `aria-describedby`.

Exemplo de erro acessível:

```html
<label for="email2">Email</label>
<input
  id="email2"
  name="email2"
  type="email"
  aria-invalid="true"
  aria-describedby="erro-email2"
/>
<p id="erro-email2" class="mensagem is-error">Introduz um email válido.</p>
```

## 9) DevTools: onde olhar quando não submete

- `Elements`: confirma `label for`, `id`, `name` e atributos `required`.
- `Console`: verifica erros JS que bloqueiam submit.
- `Network`: confirma método (`GET`/`POST`) e payload enviado.
- `Event Listeners`: valida se existe `preventDefault()` no submit.

## 10) Checkpoint visual

- Todos os campos visíveis têm `label`.
- Campos obrigatórios são identificáveis.
- Radios partilham o mesmo `name`.
- Checkboxes e radios têm `id` únicos.
- Erros são compreensíveis sem depender só da cor.

## 11) Erros comuns

1. Misturar `novalidate` com validação nativa sem plano.
2. Usar `disabled` em campos que querias enviar.
3. Esquecer `enctype="multipart/form-data"` quando há ficheiros.
4. Definir `pattern` demasiado restritivo.
5. Não testar formulário apenas com teclado.

## 12) Exercícios em escada

### Exercício A (guiado)

Cria formulário de contacto com:

- `nome` (`text`)
- `email` (`email`)
- `assunto` (`select`)
- `mensagem` (`textarea`)
- botão `submit`

Resultado esperado:

- Todos os campos têm `label` e `name`.

### Exercício B (intermédio)

Expande para inscrição com:

- `password` com `minlength`
- `radio` para turno
- `checkbox` para termos (`required`)
- `file` para CV (`accept=".pdf"`)

Resultado esperado:

- Submissão bloqueada quando faltam requisitos.

### Exercício C (aplicação)

Constrói um "laboratório de formulário" que inclua:

- Pelo menos 12 tipos diferentes de `input`
- `datalist`
- `output` ligado a `range`
- `progress` e `meter`

Resultado esperado:

- Formulário completo, funcional e semanticamente correto.

## 13) Mini-desafio extra

Sem usar bibliotecas:

1. Mostra erro de validação por campo.
2. No primeiro submit inválido, faz foco automático no primeiro campo inválido.
3. Mostra resumo de dados submetidos num bloco `<pre>` para inspeção.

## Changelog

- v1.1.0 - Capítulo expandido com tags de formulário, lista completa de `input type`, validação nativa detalhada, acessibilidade e laboratório prático.
- v1.0.1 - Regras de `label`/`name` reforçadas, exemplos A/B ajustados e exercícios A/B/C adicionados.
- v1.0.0 - Capítulo criado.

![Footer](../Images/Footer.png)
