# [20] Projeto React — Guia de Tema, Propósitos, **Requisitos e Limites Funcionais** (11.º ano)

> **Objetivo:** orientar grupos de 3–4 alunos a planear e construir uma **aplicação em React sem backend**, cumprindo **requisitos funcionais mínimos** e respeitando **limites de âmbito** adequados ao nível atual (sem base de dados, sem autenticação, sem servidores).

---

## 0) O que é o React? (linguagem simples)

-   **React** é uma biblioteca para criar **interfaces** (ecrãs) feitas de **componentes** (peças).
-   Um componente recebe **dados de entrada** (**props**) e pode guardar **memória** (**estado**).
-   Quando a **memória muda**, o React **redesenha** a parte certa do ecrã automaticamente.

---

## 1) Propósitos pedagógicos do projeto

-   Pensar a aplicação como **componentes** reutilizáveis.
-   Treinar **estado**, **eventos**, **listas**, **formulários** e **persistência local**.
-   Praticar **planeamento**, **divisão de tarefas** e **documentação** clara.
-   Garantir **UI limpa**, **acessibilidade básica** e **responsividade**.

---

## 2) Regras gerais e limites de tecnologia

-   **Grupos**: 3–4 alunos.
-   **Stack**: React + JavaScript. CSS à escolha (CSS puro, módulos ou framework leve). Evitar bibliotecas de UI pesadas.
-   **Sem backend**: nada de base de dados ou autenticação. A persistência é **local** (`localStorage`) e pode haver **ficheiros `.json`** de exemplo.
-   **APIs externas**: **evitar**. Só se forem públicas **sem chave** e estáveis. O foco é React básico.
-   **Compatibilidade**: deve correr bem num navegador moderno (Chrome/Edge/Firefox).

---

## 3) Requisitos funcionais mínimos (MVP obrigatório)

### 3.1 Estrutura e navegação

-   Pelo menos **2 ecrãs/seções** (podem ser mostrados com **condicionais** ou **tabs**; **roteamento é opcional**).
-   **6–8 componentes** no total (inclui componentes pequenos e reutilizáveis: `Button`, `Card`, `List`, `Item`, `Form`).

### 3.2 Dados e operações

-   Um **tipo de item principal** (ex.: tarefa, receita, livro) com **campos simples**: `id`, `titulo`, `descricao`, `categoria`/`tags`, e **data** (texto é suficiente).
-   **Criar / Ler / Atualizar / Remover** (pelo menos **CRIAR** e **REMOVER**; **ATUALIZAR**).
-   **Listar** itens com **`key`** correta e **mensagem para lista vazia**.
-   **Filtrar e/ou pesquisar** (por texto ou por categoria).

### 3.3 Formulários e estado

-   Pelo menos **1 formulário controlado**.
-   **Validação mínima** (campos obrigatórios, números positivos quando aplicável).

### 3.4 Persistência local e ciclo de vida

-   **Guardar** e **ler** dados do **`localStorage`** (a dar mais à frente).
-   Usar **`useEffect`** para sincronizar o estado com o `localStorage` quando os dados mudam.

### 3.5 UX, acessibilidade e responsivo

-   **Labels** ligados a inputs, **alt** em imagens e **mensagens claras** (erro, sucesso, vazio).
-   **Layout responsivo** simples (coluna em mobile; grelha em desktop).

### 3.6 Documentação e qualidade

-   **README** com: tema, funcionalidades, como correr, secção “como os dados são guardados” e capturas/GIF curto.
-   Código com **nomes claros**, **componentes pequenos** e **estrutura simples** (`src/components`, `src/data`).

---

## 4) Limites funcionais (proibido neste projeto) **+ alternativas aceitáveis**

| NÃO permitido agora                                 | Porquê                       | Alternativa aceitável                                                                |
| --------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------ |
| **Autenticação / Contas / Login**                   | Requer backend/segurança     | **Simular** utilizador atual com um campo fixo (ex.: “Bem‑vindo, Convidado”)         |
| **Base de dados real**                              | Fora do âmbito               | Usar **`localStorage`** e/ou ficheiro `.json` de seeds                               |
| **Pagamentos / Carrinho com checkout real**         | Sensível e complexo          | **Simular** “comprar” com um **alert**/modal de confirmação e atualizar estado local |
| **Uploads para servidor**                           | Precisa de backend           | Permitir **pre‑visualização local** de imagens (URL de imagem pública) ou texto      |
| **Tempo‑real / chat / sockets**                     | Necessita servidor           | Atualizações normais via estado local (sem “tempo‑real”)                             |
| **Notificações push**                               | Exige permissões/servidor    | Mostrar **mensagens inline** no ecrã                                                 |
| **Geolocalização e mapas avançados**                | APIs e chaves                | Se necessário, usar **texto**/categorias (“Zona Norte/Sul”)                          |
| **Roteamento complexo** (muitas páginas, aninhadas) | Aumenta muito a complexidade | No máximo **2–3 páginas** ou **tabs** com estado; React Router **opcional**          |
| **3D/WebGL/Canvas avançado**                        | Muito técnico                | Gráficos simples com **texto**/barras em CSS                                         |

> Regra de ouro: **se precisa de servidor, está fora**. Se dá para **simular localmente**, está dentro.

---

## 5) Exemplos de temas + requisitos mínimos por tema

### 5.1 Gestor de Tarefas

-   Campos: `id`, `titulo`, `descricao`, `categoria` (Escola/Casa), `estado` (Pendente/Feita), `data` (texto).
-   Fluxos: **criar**, **marcar como feita**, **remover**, **filtrar por estado/categoria**, **pesquisar** por texto.

### 5.2 Catálogo de Receitas

-   Campos: `id`, `titulo`, `ingredientes` (texto), `categoria` (Doce/Salgado), `dificuldade` (1–5), `tempo` (min).
-   Fluxos: **adicionar**, **remover**, **filtrar por categoria/dificuldade**, **pesquisar**.

### 5.3 Biblioteca Pessoal

-   Campos: `id`, `titulo`, `autor`, `estado` (Por ler/A ler/Lido), `rating` (1–5).
-   Fluxos: **adicionar**, **alterar estado**, **remover**, **filtrar por estado**, **ordenar por título** (opcional).

> Qualquer tema deve cumprir **listas + formulários + filtros + persistência local**.

---

## 6) Mini‑planeamento (passos sugeridos)

### Fase 1 — Ideia e desenho (0,5–1 semana)

-   Escolher **tema** + escrever **objetivo** (2–3 linhas).
-   **Wireframes** no papel (2 ecrãs/seções).
-   Lista do **MVP** (obrigatório) e **extras** (opcionais).

### Fase 2 — Base do projeto (0,5 semana)

-   Criar projeto (ex.: Vite) e pastas: `src/components`, `src/data`.
-   Componentes “skeleton”: `App`, `Header`, `List`, `Item`, `Form`, `EmptyState`.
-   Dados **mock** (array `.js`/`.json`).

### Fase 3 — Interatividade (1 semana)

-   **useState** para lista e formulário; **eventos** (`onChange`, `onClick`).
-   **CRIAR/REMOVER** e, se possível, **EDITAR**.
-   **Filtro/Pesquisa** simples.

### Fase 4 — Persistência e polimento (0,5–1 semana)

-   **`localStorage` + `useEffect`** (guardar/ler).
-   Mensagens de **vazio** e **sucesso**.
-   **Responsivo** + **README** completo.

Papéis (podem rodar): Coordenação/Docs · UI/Estilos · Lógica/Estado · Testes/Qualidade.

---

## 7) Entregáveis

1. **Repositório Git** com código e mensagens de commit claras.
2. **README** com: tema, como correr, funcionalidades (MVP + extras), **como os dados são guardados**, capturas/GIF.
3. **Ficheiro de seeds** (`src/data/seed.js` ou `.json`) se usarem dados iniciais.
4. **Apresentação** (3–5 min): demo + quem fez o quê.

---

## 8) Critérios de avaliação (rubrica 0–20)

-   **MVP funcional** (40%): criar/listar/filtrar/remover, validação mínima, mensagens de vazio.
-   **Conceitos React** (20%): componentes/composição, props, `useState`, formulário controlado, listas com `key`, `useEffect` para `localStorage`.
-   **Respeito pelos limites** (10%): não usou features proibidas; usou alternativas de simulação quando preciso.
-   **UX/A11y/Responsivo** (10%): labels, alt, contraste, layout adapta‑se.
-   **Qualidade do código** (10%): nomes claros, estrutura simples.
-   **Documentação** (10%): README completo e claro.

---

## 9) Glossário simples

-   **Componente**: peça reutilizável do ecrã.
-   **Props**: dados que o pai envia ao filho.
-   **Estado (`useState`)**: memória do componente.
-   **Evento**: reação a clique/teclado.
-   **`localStorage`**: guarda dados em string no navegador.
-   **`useEffect`**: corre depois de desenhar; sincroniza coisas (ex.: guardar no `localStorage`).

---

## Changelog

-   **v1.1.0 — 2025-11-25** — Adicionados **requisitos funcionais mínimos**, **limites funcionais** com alternativas, exemplos por tema, checklist de conformidade e rubrica atualizada.
-   **v1.0.0 — 2025-11-25** — Versão inicial (objetivos, ideias de tema, planeamento, entregáveis, rubrica, glossário, anexo `localStorage`).
