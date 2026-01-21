# React.js - Materiais Didáticos (11.º Ano)

Conjunto de materiais em Markdown para o módulo de React.js.

## Como usar

- Começa no ficheiro `01_fundamentos_e_setup.md` e segue a ordem.
- Faz os exemplos no teu projeto e depois resolve os exercícios.
- Os blocos [EXTRA] são opcionais para quem quer aprofundar.

## Pré-requisitos

- **Node.js + npm:** idealmente Node 18+.
- **Editor de código:** VS Code ou equivalente.
- **Terminal:** para correr comandos (`npm`, `node`).
- **Browser atualizado:** Chrome, Edge ou Firefox.

## Setup rápido

```bash
# criar projeto React com Vite
npm create vite@latest meu-app -- --template react
cd meu-app
npm install
npm run dev
```

## Comandos mais usados

- `npm install`: instala dependências.
- `npm run dev`: inicia o servidor local.
- `npm run build`: gera a versão final.
- `npm run preview`: testa a versão final localmente.

## Portas típicas

- **Vite (frontend):** `http://localhost:5173`
- **Backend Node (exemplos):** `http://localhost:3000`

## Troubleshooting rápido

- **Erro de dependências:** apaga `node_modules` e corre `npm install`.
- **Página em branco:** confirma o `div#root` no `index.html`.
- **CORS:** verifica se o backend tem `cors` ativo. (Se se aplicar)
- **StrictMode em dev:** alguns efeitos podem correr duas vezes (ver ficheiro 08).
- **Windows/PowerShell (npm.ps1):** se aparecer "cannot be loaded because running scripts is disabled", abre o PowerShell como administrador e corre `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. Em alternativa, usa o terminal "Command Prompt" (cmd).

## Índice de ficheiros

- [01 - Fundamentos e setup de React](01_fundamentos_e_setup.md)
- [02 - JSX e componentes](02_jsx_e_componentes.md)
- [03 - Props e composição](03_props_e_composicao.md)
- [04 - Estado e eventos](04_estado_e_eventos.md)
- [05 - Listas e renderização condicional](05_listas_e_condicionais.md)
- [06 - Formulários controlados](06_formularios_controlados.md)
- [07 - Comunicação síncrona e assíncrona](07_comunicacao_sincrona_e_assincrona.md)
- [08 - useEffect e dados externos](08_useEffect_e_dados.md)
- [09 - React Router: fundamentos e setup](09_react_router_fundamentos.md)
- [10 - Navegação e rotas dinâmicas](10_navegacao_e_rotas_dinamicas.md)
- [11 - Consumo de API com backend Node.js](11_consumo_api_e_backend_node.md)
- [12 - Context API e estado global](12_context_api_estado_global.md)
- [13 - Organização e boas práticas](13_organizacao_e_boas_praticas.md)
- [14 - Mini-projeto guiado (React puro)](14_miniprojeto_guiado.md)
- [15 - HTTP, REST, CORS e contratos de API](15_http_rest_cors_e_contratos_api.md)
- [16 - Autenticação em SPA: JWT, sessões e cookies](16_autenticacao_em_spa_jwt_sessions_cookies.md)
- [17 - Upload, paginação, filtros e cliente de API](17_upload_paginacao_filtros_e_cliente_api.md)
