# React.js (12.º Ano) - 05 · Listas e condicionais

> **Objetivo deste ficheiro**
>
> - Renderizar **listas** de dados com `.map()` (de forma correta e legível).
> - Escolher **keys** bem escolhidas para evitar bugs e “saltos” estranhos na UI.
> - Usar **condicionais** no JSX (`if`, `&&`, ternário `? :`) para mostrar estados diferentes.
> - Construir UIs reais: **lista vazia**, **filtros**, **pesquisa**, **mensagens** e **componentização** simples.
> - Evitar erros comuns: `map` sem `return`, `key` errada, condições confusas, duplicação de UI e renderizações difíceis de ler.

---

## Índice

- [0. Como usar este ficheiro](#sec-0)
- [1. [ESSENCIAL] Renderizar listas com map](#sec-1)
- [2. [ESSENCIAL] Keys: o que são e porque importam](#sec-2)
- [3. [ESSENCIAL] Renderização condicional no JSX](#sec-3)
- [4. [ESSENCIAL+] Estados típicos de UI: vazio / filtrado / sem resultados](#sec-4)
- [5. [ESSENCIAL+] Filtrar e pesquisar sem “complicar o estado”](#sec-5)
- [6. [EXTRA] Organização: extrair componentes e evitar duplicação](#sec-6)
- [7. [EXTRA] Armadilhas comuns e diagnóstico rápido](#sec-7)
- [Exercícios - Listas e condicionais](#exercicios)
- [Changelog](#changelog)

---

<a id="sec-0"></a>

## 0. Como usar este ficheiro

- **O que observar:** listas e condicionais são quase sempre “UI a reagir a dados”. A regra é:
    - dados mudam (estado/props) → React renderiza → JSX muda.
- **Ordem recomendada:** 1 → 2 → 3 antes de ires para filtros/pesquisa.
- **Ligações úteis:**
    - Estado e eventos (arrays, toggles, imutabilidade): `04_estado_e_eventos.md`
    - Props e composição (componentes e callbacks): `03_props_e_composicao.md`
    - useEffect e dados (loading/erro): `08_useEffect_e_dados.md`

---

<a id="sec-1"></a>

## 1. [ESSENCIAL] Renderizar listas com map

### 1.1 A ideia central (modelo mental)

Quando tens vários itens para mostrar (tarefas, alunos, posts, produtos…), não vais escrever 20 `<li>` à mão.

Em React, a regra é:

- Tens um **array de dados** (estado ou props)
- Transformas esse array em **JSX** com `.map()`

Mini-diagrama:

```
array de dados (JS)
   ↓  map()
array de JSX
   ↓
render no return
```

### 1.2 Sintaxe base (passo a passo)

1. Tens um array:

```js
const nomes = ["Ana", "Bruno", "Carla"];
```

2. No JSX, fazes `map` para criar elementos:

```jsx
<ul>
    {nomes.map((nome) => (
        <li key={nome}>{nome}</li>
    ))}
</ul>
```

Repara em 2 coisas:

- `map` devolve um **novo array**
- cada elemento precisa de uma `key` (já explicamos a sério na secção 2)

### 1.3 Exemplo 1: lista simples (sem estado)

```jsx
/**
 * ListaNomes
 * Exemplo básico de renderização de listas com map.
 *
 * @returns {JSX.Element}
 */
function ListaNomes() {
    const nomes = ["Ana", "Bruno", "Carla"];

    return (
        <ul>
            {nomes.map((nome) => (
                <li key={nome}>{nome}</li>
            ))}
        </ul>
    );
}

export default ListaNomes;
```

### 1.4 Exemplo 2: lista a partir de estado

Agora uma lista “a sério”, onde os dados podem mudar.

```jsx
import { useState } from "react";

/**
 * ListaCompras
 * Demonstra uma lista gerada a partir de um array em estado.
 *
 * @returns {JSX.Element}
 */
function ListaCompras() {
    const [itens, setItens] = useState(["Leite", "Pão", "Iogurte"]);

    function remover(nome) {
        setItens((prev) => prev.filter((x) => x !== nome));
    }

    return (
        <div>
            <h2>Lista de compras</h2>

            <ul>
                {itens.map((nome) => (
                    <li key={nome}>
                        {nome}{" "}
                        <button onClick={() => remover(nome)}>Remover</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListaCompras;
```

O que aprender aqui:

- `map` serve para **mostrar** a lista
- `filter` serve para **remover** itens (sem mutação)
- `setItens(prev => ...)` evita bugs quando o novo valor depende do anterior (ver ficheiro 04)

### 1.5 Erros comuns com map

#### Erro A: esquecer `return` quando usas `{}`

Isto dá uma lista “vazia” e não percebes porquê:

```jsx
// ERRADO: com {} tens de escrever return
{
    itens.map((x) => {
        <li key={x}>{x}</li>;
    });
}
```

Soluções:

- ou usas parênteses `()` (mais comum)
- ou escreves `return`

```jsx
// CERTO (recomendado): parênteses
{
    itens.map((x) => <li key={x}>{x}</li>);
}

// CERTO: com {} e return
{
    itens.map((x) => {
        return <li key={x}>{x}</li>;
    });
}
```

#### Erro B: map fora de `{}` no JSX

No JSX, JavaScript tem de estar dentro de `{ ... }`.

```jsx
// ERRADO:
<ul>itens.map(...)</ul>
```

```jsx
// CERTO:
<ul>
    {itens.map(...)}
</ul>
```

Checkpoint:

- O que é que o `map` devolve?
- Porque é que `map` é a ferramenta certa para “transformar dados em UI”?

---

<a id="sec-2"></a>

## 2. [ESSENCIAL] Keys: o que são e porque importam

### 2.1 O que é uma key?

Quando renderizas uma lista, o React precisa de identificar cada item **de forma estável**.

A `key` é um identificador que diz ao React:

- “Este `<li>` corresponde a este item.”

Sem keys (ou com keys más), o React pode:

- reutilizar elementos errados,
- trocar conteúdos,
- e causar bugs que parecem “aleatórios” (inputs a mudar de linha, checkbox a saltar, etc.).

### 2.2 Regra simples para escolher keys

> **A key deve ser um identificador único e estável do item.**

Exemplos bons:

- `id` vindo da base de dados / API
- `uuid` gerado quando o item é criado
- um código único (ex.: número de aluno, código de produto)

Exemplos maus:

- o **índice** do `map` (`key={index}`) quando a lista pode mudar
- valores que podem repetir (ex.: nome de pessoa em turma grande)

### 2.3 Porque é que `key={index}` costuma dar problemas?

Imagina esta lista:

```js
["A", "B", "C"];
```

Se removeres “A”, a lista fica:

```js
["B", "C"];
```

Se a key era o índice:

- antes: A=0, B=1, C=2
- depois: B=0, C=1

Ou seja, o React pode pensar que “B” é o item antigo “A”, porque a key 0 era do “A”.
Isso pode causar bugs com:

- inputs controlados
- checkboxes
- animações
- componentes com estado interno

### 2.4 Exemplo correto: usar `id`

```jsx
const alunos = [
    { id: 1, nome: "Ana" },
    { id: 2, nome: "Bruno" },
    { id: 3, nome: "Carla" },
];

<ul>
    {alunos.map((a) => (
        <li key={a.id}>{a.nome}</li>
    ))}
</ul>;
```

### 2.5 Quando é que `index` pode ser aceitável?

Raramente, mas pode ser aceitável se:

- a lista é **fixa** (nunca muda)
- não há reordenação, inserção, remoção
- e não há inputs/estado dentro de cada item

Mesmo assim, se tiveres hipótese, usa `id`.

Checkpoint:

- O que é que o React faz com a `key`?
- Porque é que `index` dá problemas quando a lista muda?

---

<a id="sec-3"></a>

## 3. [ESSENCIAL] Renderização condicional no JSX

### 3.1 A ideia central

Na vida real, o ecrã raramente é “sempre igual”.
Queres mostrar coisas diferentes conforme:

- há itens ou não,
- o utilizador está autenticado ou não,
- há erro,
- há resultados ou não,
- um painel está aberto/fechado.

Em React, tens 3 formas principais:

1. **`if` fora do JSX** (return cedo)
2. **`&&`** (mostrar algo só se a condição for true)
3. **ternário `? :`** (escolher entre duas opções)

### 3.2 `if` com return cedo (muito claro)

Esta forma é excelente quando tens “estados de ecrã”:

```jsx
function Exemplo({ loading, erro }) {
    if (loading) return <p>A carregar...</p>;
    if (erro) return <p>Erro: {erro}</p>;

    return <p>Sucesso!</p>;
}
```

Vantagem:

- é muito legível
- evita JSX cheio de condições

### 3.3 `&&` (mostrar ou não mostrar)

Serve para “mostrar isto apenas quando…”.

```jsx
{
    itens.length === 0 && <p>Sem itens.</p>;
}
```

Regra:

- se a condição for `true`, aparece o JSX
- se for `false`, aparece “nada” (o React ignora)

Atenção:

- se a condição for um número, pode aparecer `0` (por isso usa comparações booleanas)

### 3.4 Ternário `? :` (escolher entre duas opções)

Serve quando queres escolher entre A e B.

```jsx
{
    ligado ? <p>Ligado</p> : <p>Desligado</p>;
}
```

Boa prática:

- usa ternário para escolhas simples
- se ficar grande, muda para `if` com return cedo ou extrai componente

### 3.5 Exemplo completo: lista vazia vs lista com itens

```jsx
import { useState } from "react";

/**
 * ListaComVazio
 * Demonstra renderização condicional:
 * - mostra mensagem quando lista está vazia
 * - mostra lista quando há itens
 *
 * @returns {JSX.Element}
 */
function ListaComVazio() {
    const [itens, setItens] = useState(["Leite", "Pão"]);

    function limpar() {
        setItens([]);
    }

    return (
        <div>
            <button onClick={limpar}>Limpar lista</button>

            {itens.length === 0 ? (
                <p>Sem itens. Adiciona algum.</p>
            ) : (
                <ul>
                    {itens.map((x) => (
                        <li key={x}>{x}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListaComVazio;
```

Checkpoint:

- Quando é que preferes `if` com return cedo?
- Quando é que preferes `&&`?
- Quando é que preferes ternário?

---

<a id="sec-4"></a>

## 4. [ESSENCIAL+] Estados típicos de UI: vazio / filtrado / sem resultados

### 4.1 O problema real

Quando começas a filtrar/pesquisar, há 3 situações comuns:

1. **Ainda não há itens** (lista vazia “de origem”)
2. **Há itens, mas o filtro deixa 0 resultados** (sem resultados)
3. **Há itens e há resultados** (mostrar lista)

Estas situações parecem parecidas, mas a mensagem ao utilizador deve ser diferente.

### 4.2 Exemplo: lista + filtro de “feitas”

Imagina tarefas:

```js
[
    { id: "1", nome: "Estudar", feita: false },
    { id: "2", nome: "Treino", feita: true },
];
```

Podes ter:

- lista vazia (ninguém criou tarefas)
- lista com tarefas, mas filtro “feitas” dá vazio

### 4.3 Exemplo completo (com mensagens certas)

```jsx
import { useState } from "react";

/**
 * TarefasComFiltro
 * Demonstra estados típicos da UI:
 * - lista vazia (sem tarefas criadas)
 * - sem resultados (tens tarefas, mas filtro não devolve nada)
 * - lista com resultados
 *
 * @returns {JSX.Element}
 */
function TarefasComFiltro() {
    const [tarefas, setTarefas] = useState([
        { id: "1", nome: "Estudar React", feita: false },
        { id: "2", nome: "Treino", feita: true },
    ]);

    const [mostrarFeitas, setMostrarFeitas] = useState(false);

    const visiveis = mostrarFeitas ? tarefas.filter((t) => t.feita) : tarefas;

    function alternarFeita(id) {
        setTarefas((prev) =>
            prev.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)),
        );
    }

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={mostrarFeitas}
                    onChange={(e) => setMostrarFeitas(e.target.checked)}
                />
                Mostrar só feitas
            </label>

            {tarefas.length === 0 ? (
                <p>Ainda não tens tarefas. Cria a primeira.</p>
            ) : visiveis.length === 0 ? (
                <p>Não há tarefas feitas (muda o filtro).</p>
            ) : (
                <ul>
                    {visiveis.map((t) => (
                        <li key={t.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={t.feita}
                                    onChange={() => alternarFeita(t.id)}
                                />
                                {t.feita ? <s>{t.nome}</s> : t.nome}
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default TarefasComFiltro;
```

O que aprender aqui:

- `tarefas.length === 0` representa “não há dados”
- `visiveis.length === 0` representa “há dados, mas o filtro deu vazio”
- mensagens diferentes ajudam a UI a parecer “inteligente”

---

<a id="sec-5"></a>

## 5. [ESSENCIAL+] Filtrar e pesquisar sem “complicar o estado”

### 5.1 Regra muito importante: não guardar “resultados” em estado

Um erro comum é guardar:

- `tarefas` em estado
- `tarefasFiltradas` em estado

Isto duplica informação e cria bugs: “uma mudou e a outra não”.

Regra:

> Guarda em estado apenas a **fonte de verdade** (dados brutos) e as **opções** (filtros/pesquisa).
> Calcula o resultado no render.

### 5.2 Exemplo: pesquisa por texto

Vamos ter:

- `produtos` (dados)
- `termo` (texto da pesquisa)

E calcular `visiveis` no render.

```jsx
import { useMemo, useState } from "react";

/**
 * PesquisaProdutos
 * Demonstra pesquisa e filtro sem duplicar estado.
 *
 * Nota: useMemo aqui é opcional. Serve só para deixar claro
 * que "visiveis" é um cálculo derivado. Podes remover e funciona igual.
 *
 * @returns {JSX.Element}
 */
function PesquisaProdutos() {
    const [termo, setTermo] = useState("");

    const produtos = [
        { id: 1, nome: "Teclado", preco: 25 },
        { id: 2, nome: "Rato", preco: 15 },
        { id: 3, nome: "Monitor", preco: 120 },
        { id: 4, nome: "Cabo HDMI", preco: 8 },
    ];

    const visiveis = useMemo(() => {
        const t = termo.trim().toLowerCase();
        if (!t) return produtos;
        return produtos.filter((p) => p.nome.toLowerCase().includes(t));
    }, [termo]);

    return (
        <div>
            <label>
                Pesquisar:
                <input
                    value={termo}
                    onChange={(e) => setTermo(e.target.value)}
                    placeholder="ex.: monitor"
                />
            </label>

            {visiveis.length === 0 ? (
                <p>Sem resultados para “{termo}”.</p>
            ) : (
                <ul>
                    {visiveis.map((p) => (
                        <li key={p.id}>
                            {p.nome} — {p.preco}€
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PesquisaProdutos;
```

Notas:

- `useMemo` aqui é EXTRA (não é obrigatório). Se achas demasiado, remove e calcula `visiveis` diretamente.
- a ideia principal é: **não guardes `visiveis` em estado**.

### 5.3 Alternativa (mais simples): sem useMemo

```jsx
const t = termo.trim().toLowerCase();
const visiveis = !t
    ? produtos
    : produtos.filter((p) => p.nome.toLowerCase().includes(t));
```

Checkpoint:

- O que é “fonte de verdade”?
- Porque é que guardar “filtrados” em estado pode dar bugs?

---

<a id="sec-6"></a>

## 6. [EXTRA] Organização: extrair componentes e evitar duplicação

### 6.1 O sinal de alerta

Se o teu `return (...)` começa a ter:

- muitos ternários
- muitos `&&`
- listas grandes com muita lógica dentro

… é um sinal de que está na hora de organizar.

A solução mais simples:

- extrair um componente para um item da lista.

### 6.2 Exemplo: extrair `TarefaItem`

```jsx
/**
 * TarefaItem
 * Item de lista isolado para manter o componente principal limpo.
 *
 * @param {{ tarefa: { id: string, nome: string, feita: boolean }, onToggle: (id: string) => void }} props
 * @returns {JSX.Element}
 */
function TarefaItem({ tarefa, onToggle }) {
    return (
        <li>
            <label>
                <input
                    type="checkbox"
                    checked={tarefa.feita}
                    onChange={() => onToggle(tarefa.id)}
                />
                {tarefa.feita ? <s>{tarefa.nome}</s> : tarefa.nome}
            </label>
        </li>
    );
}
```

E no componente principal:

```jsx
<ul>
    {visiveis.map((t) => (
        <TarefaItem key={t.id} tarefa={t} onToggle={alternarFeita} />
    ))}
</ul>
```

Benefícios:

- o `return` principal fica mais limpo
- cada componente faz “uma coisa”
- mais fácil de testar e de ler

---

<a id="sec-7"></a>

## 7. [EXTRA] Armadilhas comuns e diagnóstico rápido

### 7.1 Checklist rápido (quando “não aparece nada”)

1. **O array tem mesmo dados?**

- faz `console.log(itens)` antes do return

2. **O map está dentro de `{}`?**

- `{itens.map(...)}`
- não `itens.map(...)` direto

3. **Estás a usar `return` corretamente?**

- se tens `{}` no callback do map, precisas de `return`

4. **As keys são estáveis?**

- se a UI “salta” ou inputs trocam, desconfia de `key={index}`

### 7.2 “Mostrou 0 no ecrã” (armadilha do &&)

Isto acontece:

```jsx
{
    itens.length && <p>Há itens!</p>;
}
```

Se `itens.length` for `0`, o React pode mostrar `0`.

Solução:

- usar comparação booleana:

```jsx
{
    itens.length > 0 && <p>Há itens!</p>;
}
```

### 7.3 Condições demasiado complexas

Se tens isto:

```jsx
{
    a ? b ? c ? <X /> : <Y /> : <Z /> : <W />;
}
```

Para e simplifica:

- usa `if` com return cedo
- ou extrai componentes

### 7.4 “Porque é que isto repete?” (lista + estado)

Se a lista muda e o React parece “reaproveitar” itens errados:

- 90% das vezes é **key errada**.

Checkpoint:

- Quais são os 3 erros mais comuns em listas?
- Que sinais indicam key errada?
- Quando é que um ternário está a ficar grande demais?

---

<a id="exercicios"></a>

## Exercícios - Listas e condicionais

1. **Lista simples**

- Cria `ListaNomes.jsx` com um array fixo de nomes e renderiza com `map`.

2. **Lista com objetos**

- Cria um array de 5 alunos (`{ id, nome }`) e renderiza.
- Garante `key={id}`.

3. **Lista vazia**

- Cria `ListaVazia.jsx` com `itens = []` e mostra “Sem itens”.
- Depois muda para 2 itens e mostra a lista.

4. **Toggle de visibilidade**

- Cria `MostraEsconde.jsx` com estado `mostrar` (boolean).
- Mostra ou esconde um parágrafo com `&&` ou ternário.

5. **Filtro simples**

- Cria uma lista de tarefas com `{ id, nome, feita }`.
- Cria um checkbox “Mostrar só feitas”.
- Usa `filter` para gerar `visiveis`.

6. **Pesquisa**

- Cria um input `termo`.
- Filtra uma lista de produtos pelo nome (case-insensitive).

7. **Sem resultados**

- Quando `visiveis.length === 0`, mostra “Sem resultados”.
- Diferencia de “lista vazia de origem” (tarefas.length === 0).

8. **Extrair componente**

- Cria `TarefaItem.jsx`.
- Usa-o para renderizar cada item da lista.

9. **Erro propositado (keys)**

- Faz uma lista com `key={index}`.
- Adiciona um input por item (texto).
- Insere um item no topo e observa o que acontece.
- Corrige usando `id` como key.

10. **Desafio**

- Faz “favoritos”: um botão ⭐ por item que alterna `favorito`.
- Mostra no topo só os favoritos (podes ter duas listas no JSX).

---

<a id="changelog"></a>

## Changelog

- 2026-01-11: criação do ficheiro.
- 2026-01-26: atualização completa para nível didático mais alto: modelo mental de listas → JSX, secção dedicada a keys e bugs com `index`, renderização condicional (`if` cedo, `&&`, ternário), estados típicos de UI (vazio vs sem resultados), filtro/pesquisa sem duplicar estado, organização por extração de componentes e checklist de diagnóstico.
