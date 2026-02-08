# React.js (12.º Ano) - 16 · Qualidade profissional: TypeScript, testes e tooling

> **Objetivo deste ficheiro**
>
> - Perceber **porque é que projetos reais usam tooling** (lint, format, testes) e como isso evita bugs.
> - Aprender o **mínimo útil de TypeScript** para React (props, estado, eventos).
> - Criar **testes simples de componentes** com Vitest + React Testing Library.
> - Organizar scripts de qualidade (`lint`, `format`, `test`) e hábitos profissionais.
> - Distinguir o que é **ESSENCIAL** do que é **EXTRA** numa equipa real.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] Qualidade em projetos reais (porquê isto existe)](#sec-1)
- [2. [ESSENCIAL] Lint + format: evitar bugs e manter consistência](#sec-2)
- [3. [ESSENCIAL] TypeScript mínimo para React](#sec-3)
- [4. [ESSENCIAL] Testes de componentes (Vitest + RTL)](#sec-4)
- [5. [ESSENCIAL+] Scripts e pipeline básico de qualidade](#sec-5)
- [6. [EXTRA] Boas práticas de equipa (reviews, debugging, performance)](#sec-6)
- [Exercícios - Qualidade profissional](#exercicios)
- [Changelog](#changelog)

---

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **Se estás a começar:** faz 1 → 2 → 3 → 4. Isso cobre o essencial para um projeto real.
- **Se já tens projeto pronto:** aplica a secção 5 (scripts) e escolhe 1 extra da secção 6.
- **Ligações úteis:**
    - `04_estado_e_eventos.md` (conceitos base para exemplos)
    - `06_formularios_controlados.md` (para testar inputs)
    - `08_useEffect_e_dados.md` (para perceber efeitos e estados de UI)
    - `11_consumo_api_e_backend_node.md` (para testes de componentes com dados)

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] Qualidade em projetos reais (porquê isto existe)

### 1.1 O problema real

Quando um projeto cresce, aparecem 3 dores comuns:

1. **Erros humanos repetidos** (ex.: `class` em vez de `className`, dependências erradas do `useEffect`, mutação de estado).
2. **Código inconsistente** (cada pessoa escreve de forma diferente → difícil de ler/manter).
3. **Mudanças que quebram coisas sem ninguém notar**.

É por isso que equipas reais usam:

- **Lint** (deteta erros e más práticas)
- **Format** (garante estilo consistente)
- **Testes** (garantem que o código continua a funcionar)
- **TypeScript** (deteta erros antes de correr)

### 1.2 O que são testes (definição simples)

**Testes** são pequenos programas que verificam automaticamente se o teu código faz o que devia.
Em vez de “testar à mão” no browser, tu escreves regras do tipo:

- “Quando renderizo este componente, este texto aparece.”
- “Quando clico neste botão, o contador aumenta.”

Para que servem?

- **Evitar regressões**: algo que funcionava continua a funcionar.
- **Documentar comportamento**: o teste mostra “o que se espera” do componente.
- **Dar confiança** para mudar código sem medo.

Onde se aplicam?

- **Componentes** (UI): renderiza, mostra texto, reage a cliques.
- **Funções utilitárias**: validações, formatação, filtros.
- **Integrações simples**: componente + API simulada.

Tipos comuns (visão rápida):

- **Unitários**: testam uma função isolada.
- **Componentes**: testam UI com render e interação.
- **Integração**: combinam várias peças (ex.: página com formulário).
- **E2E** (end‑to‑end): testam a app inteira no browser (mais pesado).

Como se aplicam no dia a dia?

- Corres os testes com um comando (`npm run test`).
- Os testes também correm num **CI** (pipeline) antes de aceitar mudanças.
- Se um teste falhar, é um sinal de que algo mudou ou está quebrado.

### 1.3 Modelo mental simples

- **Lint**: “há um erro ou má prática aqui?”
- **Format**: “o código está formatado de forma consistente?”
- **Testes**: “o que funcionava continua a funcionar?”
- **TypeScript**: “estou a usar os dados com o tipo certo?”

> Regra prática: quanto maior o projeto, **mais valem estas ferramentas**.

---

<a id="sec-2"></a>

## 2. [ESSENCIAL] Lint + format: evitar bugs e manter consistência

### 2.0 O que é “lint” e o que é “formatar”?

**Lint** é um “verificador de qualidade” do código. Ele encontra:

- erros prováveis (ex.: hooks mal usados, variáveis não usadas)
- más práticas (ex.: dependências em falta no `useEffect`)

**Formatar** é alinhar o estilo do código:

- espaços, quebras de linha, aspas
- tudo fica uniforme (independentemente de quem escreveu)

Onde se aplica?

- **No editor** (formatar ao guardar) → evita “guerras de estilo”.
- **Na linha de comandos** (`npm run lint`, `npm run format`).
- **No CI** → impede que código “desleixado” entre no projeto.

Regra prática:

- Lint **aponta erros** (e às vezes corrige automaticamente).
- Format **mexe no estilo**, mas não muda o comportamento.

### 2.1 Lint (ESLint): detetar erros e más práticas

O ESLint ajuda a encontrar problemas antes de correr a app, por exemplo:

- hooks usados fora de componente
- dependências em falta no `useEffect`
- variáveis não usadas
- erros de JSX

**Exemplo de instalação (Vite + React):**

```bash
npm install -D eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
```

**Script típico:**

```json
{
  "scripts": {
    "lint": "eslint ."
  }
}
```

> Nota: em projetos reais, o Vite já vem com base para ESLint em muitos templates. Aqui o objetivo é perceber **porque existe**.

### 2.2 Format (Prettier): estilo consistente

O Prettier não decide “se está certo”, só decide **como formatar**:

- tamanhos de linha
- aspas
- indentação

**Exemplo de instalação:**

```bash
npm install -D prettier
```

**Script típico:**

```json
{
  "scripts": {
    "format": "prettier . --write"
  }
}
```

### 2.3 Regra prática (muito importante)

- **Lint** evita bugs.
- **Format** evita discussões de estilo.

Se tens estas duas coisas, o código fica muito mais previsível e profissional.

---

<a id="sec-3"></a>

## 3. [ESSENCIAL] TypeScript mínimo para React

TypeScript é JavaScript com tipos. Em projetos reais, é muito comum.

Aqui vamos ver só o **mínimo útil** para React:

### 3.1 O que muda na prática?

- Ficheiros passam a usar `.tsx`.
- Props e estados passam a ter tipos explícitos.
- Erros aparecem **antes** de correr a app.

### 3.2 Exemplo: componente com props tipadas

```tsx
// src/components/Badge.tsx

type BadgeProps = {
    texto: string;
    cor?: "verde" | "vermelho" | "azul";
};

function Badge({ texto, cor = "verde" }: BadgeProps) {
    return <span className={`badge badge--${cor}`}>{texto}</span>;
}

export default Badge;
```

### 3.3 Estado tipado

```tsx
import { useState } from "react";

type Tarefa = {
    id: number;
    texto: string;
    feita: boolean;
};

function Lista() {
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    // ...
    return null;
}
```

### 3.4 Eventos (inputs)

```tsx
import { useState } from "react";
import type { ChangeEvent } from "react";

function Nome() {
    const [nome, setNome] = useState("");

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        setNome(e.target.value);
    }

    return <input value={nome} onChange={onChange} />;
}
```

### 3.5 Checkpoint

- O que significa `props` tipadas?
- O que ganhas ao tipar um array de tarefas?
- Porque é que `useState<Tarefa[]>()` evita erros?

---

<a id="sec-4"></a>

## 4. [ESSENCIAL] Testes de componentes (Vitest + RTL)

Para React com Vite, o par mais comum é:

- **Vitest** (test runner)
- **React Testing Library** (testes de UI de forma realista)

### 4.0 O que é testar um componente?

Testar um componente é **renderizá‑lo num ambiente de teste** e verificar:

- se aparece o texto certo,
- se responde a cliques e inputs,
- se mostra o estado correto (loading, erro, sucesso).

Regra prática:

- Testa **o que o utilizador vê** e **o que consegue fazer**.
- Evita testar detalhes internos (ex.: estados privados), porque mudam facilmente.

### 4.1 Instalação mínima

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

### 4.2 Configuração mínima (package.json)

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

### 4.3 Exemplo simples: componente renderiza texto

```tsx
// src/components/Saudacao.tsx

type SaudacaoProps = { nome: string };

function Saudacao({ nome }: SaudacaoProps) {
    return <p>Olá, {nome}!</p>;
}

export default Saudacao;
```

```tsx
// src/components/Saudacao.test.tsx
import { render, screen } from "@testing-library/react";
import Saudacao from "./Saudacao";

it("mostra a saudação com o nome", () => {
    render(<Saudacao nome="Rita" />);
    expect(screen.getByText(/Olá, Rita/i)).toBeInTheDocument();
});
```

### 4.4 Exemplo simples: input controlado

```tsx
// src/components/NomeAoVivo.tsx
import { useState } from "react";

export function NomeAoVivo() {
    const [nome, setNome] = useState("");

    return (
        <div>
            <input value={nome} onChange={(e) => setNome(e.target.value)} />
            <p>{nome}</p>
        </div>
    );
}
```

```tsx
// src/components/NomeAoVivo.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NomeAoVivo } from "./NomeAoVivo";

it("atualiza o texto quando o utilizador escreve", async () => {
    render(<NomeAoVivo />);
    const input = screen.getByRole("textbox");

    await userEvent.type(input, "Ana");

    expect(screen.getByText("Ana")).toBeInTheDocument();
});
```

### 4.5 Checkpoint

- O que é o Vitest?
- Porque é que usamos Testing Library (em vez de testar detalhes internos)?
- O que é que um teste garante num projeto real?

---

<a id="sec-5"></a>

## 5. [ESSENCIAL+] Scripts e pipeline básico de qualidade

Em projetos reais, o `package.json` costuma ter estes scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier . --write",
    "test": "vitest"
  }
}
```

Regra prática (em equipa):

- Antes de entregar/partilhar: `lint` + `test`.
- Antes de publicar: `build`.

Se tiveres GitHub Actions ou GitLab CI, o pipeline costuma fazer:

1. `npm ci`
2. `npm run lint`
3. `npm run test`
4. `npm run build`

Isto garante que o código passa na qualidade mínima.

---

<a id="sec-6"></a>

## 6. [EXTRA] Boas práticas de equipa (reviews, debugging, performance)

### 6.1 Code review (checklist simples)

- O código está legível?
- Os nomes são claros?
- Há mutações de estado?
- O `useEffect` tem dependências corretas?
- Há feedback de loading/erro em fetches?

### 6.2 Debugging “rápido” (método)

- `console.log` estratégico (render/effect/handler)
- Ver Network e Console
- Confirmar estado no ecrã com `<pre>{JSON.stringify(...)}</pre>`

### 6.3 Performance (só o mínimo)

- Evitar renders desnecessários (props estáveis, não criar objetos novos sem necessidade)
- Usar `useMemo`/`useCallback` só quando há impacto real

> Regra prática: **não otimizes cedo**. Primeiro garante que funciona e está claro.

---

<a id="exercicios"></a>

## Exercícios - Qualidade profissional

1. **Lint/Format**
   - Adiciona scripts `lint` e `format` ao projeto.
   - Corre `npm run lint` e corrige 2 avisos/erros.

2. **TypeScript (props)**
   - Cria `Saudacao.tsx` com props tipadas (`nome: string`).

3. **TypeScript (estado)**
   - Cria `ListaTarefas.tsx` com tipo `Tarefa` e `useState<Tarefa[]>`.

4. **Teste simples**
   - Cria um teste para `Saudacao` e verifica o texto renderizado.

5. **Teste com input**
   - Cria um input controlado e testa se o texto aparece ao escrever.

6. **Pipeline básico**
   - Adiciona `test` e `lint` ao `package.json`.
   - Explica em 3 linhas porque isso é útil numa equipa.

---

<a id="changelog"></a>

## Changelog

- 2026-01-28: criação do ficheiro (qualidade profissional com TypeScript, testes e tooling).
