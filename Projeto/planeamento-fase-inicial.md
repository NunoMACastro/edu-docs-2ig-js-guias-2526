# Projeto React — Questionário de Arranque e Mapa Mental (11.º ano)

> **Objetivo deste ficheiro**  
> Ajudar o teu grupo a:
>
> 1. Clarificar a **ideia** da aplicação.
> 2. Fazer um **mapa mental simples** do projeto.
> 3. Transformar esse mapa numa **lista de requisitos funcionais** (o que a app faz).
>
> Lembra-te:
>
> -   Este projeto é **só frontend**: **React no navegador**, sem qualquer servidor.
> -   Não há **backend** (sem base de dados externa, sem autenticação real).
> -   Os dados são guardados **no navegador** (ex.: `localStorage`) e/ou carregados de **ficheiros `.json`**.
> -   O foco é **React básico**: componentes, estado, listas, formulários, filtros e persistência local.

> Neste documento vais ler várias vezes a palavra `localStorage`. Isto é algo que vamos explicar mais à frente, mas basicamente é uma forma simples de guardar dados no navegador do utilizador, sem precisar de servidores ou bases de dados externas. Os dados ficam guardados mesmo quando o utilizador fecha o browser, e podem ser lidos quando a app é aberta outra vez.

---

## 0) Como usar este ficheiro

1. Respondam às perguntas **por escrito** (podem copiar este ficheiro e editar).
2. Façam um **esquema / desenho** do mapa mental numa folha ou numa ferramenta à escolha.
3. No fim, criem uma **lista de 8–12 requisitos funcionais** a partir das respostas (ver secção 4).

---

## 1) Ideia geral do projeto (Tema e Objetivo)

### 1.1 Nome e resumo rápido

1. **Nome provisório da aplicação:**

    > Resposta: …

2. Expliquem a app **numa frase**, como se estivessem a falar com um amigo:

    > “A nossa app é …”

3. Quem é o **principal utilizador** da vossa app?  
   (Ex.: aluno do secundário, fã de receitas, leitor de livros, atleta amador…)

    > Resposta: …

4. Qual é o **principal problema** que a app quer resolver ou melhorar? (se se aplicar)

    > Resposta: …

5. O que é que a app **não** vai resolver (pelo menos nesta primeira versão)? (se se aplicar)
   (Isto ajuda a não inventar funcionalidades a mais.)

    > Resposta: …

---

## 2) Mapa mental em 4 partes

Numa folha de papel, vamos criar um mapa mental da aplicação. No centro do mapa mental coloquem o **nome da app**.  
Depois criem **4 ramos principais**:

-   Utilizadores
-   Informação (dados)
-   Ações (funcionalidades)
-   Ecrãs / secções

As perguntas abaixo servem para encher esses 4 ramos.

---

## 2.1 Utilizadores (Quem usa a app?)

6.  Quem pode usar a app? Há **tipos diferentes de utilizador** ou é só “um utilizador genérico”?
    (Lembrem-se que a app não tem autenticação real, por isso se houver tipos diferentes, é só para pensar nas funcionalidades.)

    > Resposta:

7.  Há alguma diferença importante entre utilizadores?  
    (Ex.: professor vs aluno, treinador vs atleta)  
    Ou neste projeto todos os utilizadores são tratados da mesma forma?

    > Resposta: …

8.  Há alguém que **vê** os dados mas não pode **editar**? (se se aplicar a edição de dados)
    Ou, para este projeto, qualquer utilizador pode criar/editar/remover?

    > Resposta: …

> No mapa mental, criem um ramo “Utilizadores” e ponham estas ideias em volta.

---

## 2.2 Informação (Dados principais da app)

9. Qual é o **“item principal”** da vossa app?  
   (Ex.: tarefa, receita, livro, filme, hábito, nota, episódio, treino…)

    > Resposta: …

10. Que **campos básicos** cada item precisa de ter?  
    Exemplos de campos:

    - Título / nome
    - Descrição
    - Categoria / tipo (ex.: Escola/Casa; Doce/Salgado; Por ler/Lido)
    - Data (texto chega, não precisam de datas “reais”)
    - Números (ex.: rating 1–5, tempo em minutos, dificuldade)

    > Lista de campos: …

11. Há **listas secundárias** ou coisas relacionadas?  
    (Ex.: numa receita, uma lista de ingredientes em texto; num livro, notas pessoais.)

    > Resposta: …

12. Sabendo que **não há backend nem base de dados externa**, faz sentido terem **mais do que um tipo de item**  
    ou 1 tipo bem pensado chega para este projeto?

    > Resposta: …

> No mapa mental, criem um ramo “Dados / Informação” com estes campos e tipos de item.

---

## 2.3 Ações (O que o utilizador consegue fazer?)

Aqui focam-se só nos **verbos** (ações) que o utilizador faz com os dados.

13. O que é que o utilizador precisa de **criar / adicionar**? Ou não precisa de criar nada?

    > Resposta: …

14. O que é que o utilizador precisa de **ver / listar**?

    > Resposta: …

15. O que é que o utilizador precisa de **atualizar / editar**?

    > Resposta: …

16. O que é que o utilizador precisa de **remover / apagar**?

    > Resposta: …

17. O utilizador precisa de **filtrar** os itens?  
    Se sim, por quê?

    -   Ex.: por categoria, por estado (pendente/feito), por dificuldade…

    > Resposta: …

18. O utilizador precisa de **pesquisar** por texto?  
    Se sim, onde faz sentido essa pesquisa (sobre que campo)?

    > Resposta: …

19. Há alguma **ação especial simples** que faça sentido?  
    Exemplos:

    -   “Marcar tarefa como feita”
    -   “Mudar estado do livro de ‘Por ler’ para ‘Lido’”
    -   “Ordenar lista por título ou por data”

    > Ações especiais: …

20. De todas as ações que escreveram, quais são:

    -   **Obrigatórias** (sem isto a app não faz sentido)?
    -   **Interessantes mas opcionais** (podem ficar como extra)?

    > MVP (obrigatórias): …  
    > Extras (opcionais): …

> No mapa mental, criem um ramo “Ações” e liguem os verbos aos dados (ex.: “Tarefa → marcar como feita”).

---

## 2.4 Ecrãs / Secções (Onde aparece o quê?)

21. Quando o utilizador abre a app, **o que deve aparecer no ecrã principal**?

    -   Uma lista de itens?
    -   Um resumo (dashboard)?
    -   Um formulário?

    > Resposta: …

22. Quais são as **2 ou 3 secções principais** da app?  
    Exemplos:

    -   “Lista de itens”
    -   “Adicionar novo”
    -   “Sobre a app” / “Ajuda”

    > Secções: …

23. A app vai ter:

    -   Um só ecrã com **partes diferentes** (ex.: tabs, condicionais, mostrar/esconder), ou
    -   “Páginas” separadas (ex.: ecrã principal + ecrã de detalhe)?

    > Resposta: …

24. O que aparece em cada secção?  
    Podem fazer uma mini-tabela:

    | Secção / ecrã            | O que mostra |
    | ------------------------ | ------------ |
    | Ecrã principal           | …            |
    | Outra secção (se houver) | …            |

> No mapa mental, criem um ramo “Ecrãs / Secções” e liguem cada secção às ações e dados que aparecem lá.

---

## 3) Limites do projeto (o que NÃO vai ter agora)

Regras importantes (para este projeto):

-   Não há **backend** (sem Node, sem Express, sem base de dados externa).
-   Não há **autenticação real** (sem registos, sem login, sem tokens).
-   Não há **pagamentos reais** (nada que mexa com dinheiro de verdade).

Usem estas perguntas para garantir que as ideias respeitam estes limites.

25. A app vai ter algum ecrã de **“login” ou “utilizador”**?

    -   Lembra-te: não podem criar **contas reais** nem guardar passwords em servidores.
    -   Se quiserem algo deste género, tem de ser **SIMULADO**, por exemplo:
        -   Um campo para escrever o nome e guardar esse nome em `localStorage`.
        -   Uma mensagem “Olá, [nome]” no topo da app.

    > Como vão tratar esta parte (se existir)? …

26. A app precisa de **guardar dados entre sessões** (quando fecham o browser)?

    -   Se sim, vão usar **`localStorage`** para guardar e ler os dados.
    -   Podem também ter um ficheiro **`.json`** com **dados iniciais** (seeds) carregados no arranque.

    > Que dados vão guardar em `localStorage`?  
    > Vão usar ficheiro `.json` com seeds? Quais? …

27. Querem usar **APIs externas** (dados vindos da internet)?

> Uma API (Application Programming Interface) é uma forma de obter dados de um serviço diferente do que estamos a usar.
> Por exemplo, uma API de filmes pode dar-nos listas de filmes populares, detalhes sobre cada filme, etc.
> É uma forma de comunicação entre diferentes aplicações.
> Vamos ver a sua utilização mais ao pormenor mais à frente.

    -   Não é obrigatório usar APIs.
    -   Se usarem, têm de ser **públicas**, **sem chave** e simples.
    -   Muitas vezes é mais seguro e simples **simular** esses dados num ficheiro `.json` ou num array em JavaScript.

    > Vão usar API externa? Qual?
    > Conseguem também trabalhar se a API falhar, usando dados simulados num `.json`? …

> No mapa mental, podem ter um cantinho com “Limites” e escrever:  
> sem backend, sem autenticação real, sem pagamentos reais, dados em `localStorage` / `.json`, etc.

---

## 4) Requisitos funcionais iniciais

Agora vão transformar as ideias em **frases claras** de requisitos funcionais.

### 4.1 Regra para escrever requisitos funcionais

Cada requisito funcional deve ser uma frase do tipo:

> “O utilizador consegue **\<ação>** **\<o quê>** **\<(opcional: com que detalhe/condição)>**.”

Exemplos:

-   “O utilizador consegue **adicionar** uma nova tarefa com título, descrição, categoria, estado e data.”
-   “O utilizador consegue **marcar** uma tarefa como concluída.”
-   “O utilizador consegue **remover** uma tarefa da lista.”
-   “O utilizador consegue **filtrar** as tarefas por categoria e estado.”
-   “O utilizador consegue **pesquisar** tarefas pelo título.”

### 4.2 Tarefa do grupo

1. Voltem ao mapa mental e às respostas das secções anteriores.
2. Escrevam **8–12 frases** de requisitos funcionais para o **MVP**.

    Exemplo de estrutura a preencher (podem copiar):

    1. O utilizador consegue …
    2. O utilizador consegue …
    3. O utilizador consegue …
    4. O utilizador consegue …
    5. O utilizador consegue …
    6. O utilizador consegue …
    7. O utilizador consegue …
    8. O utilizador consegue …

3. Se quiserem, escrevam mais 3–5 requisitos para **funcionalidades extra** (não obrigatórias, mas desejadas).

---

## 5) Checklist final

Antes de entregar esta fase do trabalho, confirmem:

-   [ ] Têm **nome provisório** e **objetivo em 1–3 frases**.
-   [ ] Têm um **mapa mental** com pelo menos 4 ramos: Utilizadores, Dados, Ações, Ecrãs.
-   [ ] As ideias **respeitam os limites**: só frontend, sem backend, sem autenticação real, sem pagamentos reais.
-   [ ] Identificaram o **tipo de item principal** e respetivos **campos**.
-   [ ] Listaram as principais **ações** (criar, ver, editar, remover, filtrar, pesquisar…).
-   [ ] Definiram o que entra no **MVP** e o que fica como **extra**.
-   [ ] Escreveram **8–12 requisitos funcionais** para o MVP, no formato:
    -   “O utilizador consegue …”

Quando isto estiver completo, já têm uma **base sólida** para começar o planeamento do código e dos componentes em React.
