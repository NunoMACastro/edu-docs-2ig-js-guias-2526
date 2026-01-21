# React.js (11.º Ano) - 11 · Consumo de API com backend Node.js

> **Objetivo deste ficheiro**
> Entender a ligação entre frontend React e backend Node.js.
> Criar uma API simples com Express e consumir dados com fetch.
> Tratar loading, erro e problemas de CORS com contratos consistentes.

---

## Índice

-   [0. Como usar este ficheiro](#sec-0)
-   [1. [ESSENCIAL] Modelo cliente-servidor](#sec-1)
-   [2. [ESSENCIAL] Contrato de API (o que vai e vem)](#sec-2)
-   [3. [ESSENCIAL] Criar uma API simples em Node.js](#sec-3)
-   [4. [ESSENCIAL] Consumir a API no React (GET + POST)](#sec-4)
-   [5. [ESSENCIAL] CORS e erros comuns](#sec-5)
-   [6. [EXTRA] Proxy no Vite e variáveis de ambiente](#sec-6)
-   [Exercícios - Consumo de API com backend Node.js](#exercicios)
-   [Changelog](#changelog)

<a id="sec-0"></a>

## 0. Como usar este ficheiro

-   **ESSENCIAL vs EXTRA:** cria a API e faz o fetch antes de usar proxy.
-   **Como estudar:** corre o backend e o frontend em terminais diferentes.
-   **Ligações úteis:**
    -   HTTP/CORS e contratos: `15_http_rest_cors_e_contratos_api.md`
    -   Autenticação: `16_autenticacao_em_spa_jwt_sessions_cookies.md`
    -   Upload/paginação/filtros: `17_upload_paginacao_filtros_e_cliente_api.md`

<a id="sec-1"></a>

## 1. [ESSENCIAL] Modelo cliente-servidor

### Modelo mental

O React corre no browser (cliente). O Node.js corre no servidor (backend). O React pede dados ao backend por HTTP e recebe JSON.

Pensa nisto como uma conversa simples:

-   **Cliente (React):** "Dá-me a lista de alunos."
-   **Servidor (Node.js):** "Aqui tens em JSON."

O backend é o sítio certo para lógica que não deve ficar no browser (acesso à base de dados, regras de negócio, validações). O frontend mostra os dados e reage ao utilizador.

Termos importantes (simples):

| Termo         | Significado                                    |
| ------------- | ---------------------------------------------- |
| **API**       | Conjunto de rotas que devolvem dados           |
| **Endpoint**  | Uma rota específica (ex.: `/api/alunos`)       |
| **HTTP**      | A forma como o browser comunica com o servidor |
| **JSON**      | Formato de dados (texto estruturado)           |
| **Porta**     | Número que identifica o serviço (ex.: 3000)    |
| **localhost** | O teu computador a fazer de servidor           |

### Sintaxe base (passo a passo)

-   **O backend expõe endpoints:** `/api/alunos`, `/api/cursos`, etc.
-   **O frontend faz pedidos HTTP:** com `fetch`.
-   **A resposta vem em JSON:** e tens de a converter com `res.json()`.
-   **Cada serviço tem uma porta:** ex.: backend `3000`, frontend `5173`.
-   **O caminho completo inclui protocolo + host + porta:** `http://localhost:3000/api/alunos`.

### Erros comuns

-   Pensar que o React pode aceder diretamente a uma base de dados.
-   Misturar código do servidor com código do frontend.
-   Confundir porta do backend com a do frontend.

### Boas práticas

-   Mantém backend e frontend separados.
-   Usa JSON como formato padrão de resposta.
-   Dá nomes claros aos endpoints (ex.: `/api/alunos`).

### Checkpoint

-   Qual é a diferença entre cliente e servidor?
-   O que significa a porta num URL como `http://localhost:3000`?

<a id="sec-2"></a>

## 2. [ESSENCIAL] Contrato de API (o que vai e vem)

### Modelo mental

Contrato de API é o acordo entre frontend e backend: **o que envio, o que recebo, e como vêm os erros**. Se o contrato for consistente, o frontend é mais fácil de escrever e testar.

### Formato de erro (padrão base)

```json
{ "error": { "code": "SOME_CODE", "message": "Mensagem", "details": [] } }
```

### Exemplo de contrato (alunos)

```text
GET /api/alunos
200 OK
[
  { "id": 1, "nome": "Ana", "curso": "Web" },
  { "id": 2, "nome": "Bruno", "curso": "Redes" }
]
```

```text
POST /api/alunos
Body: { "nome": "Carla", "curso": "Web" }

201 Created
{ "id": 3, "nome": "Carla", "curso": "Web" }
```

```text
POST /api/alunos (dados inválidos)
422 Unprocessable Entity
{ "error": { "code": "VALIDATION_ERROR", "message": "Nome e curso são obrigatórios", "details": [ ... ] } }
```

```text
GET /api/alunos/999 (não existe)
404 Not Found
{ "error": { "code": "NOT_FOUND", "message": "Aluno não encontrado", "details": [] } }
```

### Erros comuns

-   Não combinar o formato de erro com o frontend.
-   Usar 200 em tudo e esconder erros reais.
-   Enviar body vazio ou com campos errados.

### Boas práticas

-   Decide o contrato antes de começar o frontend.
-   Mantém sempre o mesmo formato de erro.
-   Usa status codes coerentes (200/201/404/422/500).

### Checkpoint

-   Porque é que um contrato consistente facilita o frontend?
-   Que campos mínimos tem o erro padrão?

<a id="sec-3"></a>

## 3. [ESSENCIAL] Criar uma API simples em Node.js

### Modelo mental

O Express cria um servidor HTTP rápido. Cada rota devolve dados em JSON. Vamos manter um **array em memória** (simples) e responder com status code correto.

### Sintaxe base (passo a passo)

-   **Cria uma pasta para o backend.**
-   **Inicializa um projeto Node:** `npm init -y`.
-   **Instala dependências:** `express` e `cors`.
-   **Cria `index.js`:** configura o servidor.
-   **Ativa `express.json()`** para ler JSON.
-   **Configura CORS** com a origem do Vite.
-   **Define rotas `GET` e `POST`** com erros padronizados.

> **Nota sobre ESM (padrão do curso):** usa sempre `import`/`export` e garante `"type": "module"` no `package.json`. **CommonJS (histórico)** usa `require(...)` e `module.exports`, mas não é o padrão recomendado.

> **Nota de alinhamento com o módulo Node:** nos capítulos de Node usamos `src/app.js` + `src/server.js` e, nalguns exemplos, o recurso `/api/v1/todos`. Podes adaptar este exemplo para essa estrutura — o contrato e o `fetch` mantêm‑se iguais.

### Exemplo (backend mínimo e correto)

```bash
# Cria uma pasta para o backend
mkdir backend
cd backend
# Inicia um projeto Node simples
npm init -y
# Instala Express e CORS para permitir pedidos do frontend
npm install express cors
```

```js
// backend/index.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);
app.use(express.json());

const alunos = [
    { id: 1, nome: "Ana", curso: "Web" },
    { id: 2, nome: "Bruno", curso: "Redes" },
];

function sendError(res, status, code, message, details = []) {
    return res.status(status).json({ error: { code, message, details } });
}

app.get("/api/alunos", (req, res) => {
    res.status(200).json(alunos);
});

app.get("/api/alunos/:id", (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return sendError(res, 400, "INVALID_ID", "Id inválido");
    }

    const aluno = alunos.find((a) => a.id === id);
    if (!aluno) {
        return sendError(res, 404, "NOT_FOUND", "Aluno não encontrado");
    }

    res.status(200).json(aluno);
});

app.post("/api/alunos", (req, res) => {
    const { nome, curso } = req.body || {};

    if (!nome || !curso) {
        return sendError(res, 422, "VALIDATION_ERROR", "Nome e curso são obrigatórios", [
            { field: "nome", message: "Obrigatório" },
            { field: "curso", message: "Obrigatório" },
        ]);
    }

    const duplicado = alunos.some((a) => a.nome === nome);
    if (duplicado) {
        return sendError(res, 409, "ALUNO_DUPLICADO", "Já existe um aluno com este nome");
    }

    const novo = { id: Date.now(), nome, curso };
    alunos.push(novo);
    res.status(201).json(novo);
});

app.use((err, req, res, next) => {
    console.error(err);
    return sendError(res, 500, "SERVER_ERROR", "Erro inesperado");
});

app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});
```

```bash
# Corre o servidor Node
node index.js
```

### Erros comuns

-   Esquecer o `cors` e bloquear pedidos do browser.
-   Usar uma porta diferente sem atualizar o frontend.
-   Devolver erros sem formato consistente.

### Boas práticas

-   Mantém o backend num terminal separado.
-   Usa status codes coerentes (200/201/400/404/422/500).
-   Centraliza o formato de erro num helper (`sendError`).

### Checkpoint

-   Porque é que usamos `express.json()`?
-   O que acontece quando envias um `id` inválido?

<a id="sec-4"></a>

## 4. [ESSENCIAL] Consumir a API no React (GET + POST)

### Modelo mental

No React, fazes pedidos com `fetch` dentro do `useEffect` e guardas o resultado no estado. No POST, envias JSON e atualizas a lista sem recarregar a página.

### Sintaxe base (passo a passo)

-   **Cria os estados:** `dados`, `loading`, `erro`.
-   **Cria um helper `requestJson`:** para normalizar erros.
-   **GET:** carrega dados ao montar.
-   **POST:** envia JSON e atualiza a lista.
-   **Mostra loading e erro:** sempre que fizer sentido.

### Exemplo (frontend com contrato consistente)

```jsx
// src/services/api.js
const API_BASE = "http://localhost:3000";

async function requestJson(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, options);
    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json")
        ? await res.json()
        : null;

    if (!res.ok) {
        const msg =
            body?.error?.message || `Erro ${res.status}: pedido falhou`;
        const err = new Error(msg);
        err.code = body?.error?.code;
        err.details = body?.error?.details || [];
        throw err;
    }

    return body;
}

export function getAlunos() {
    return requestJson("/api/alunos");
}

export function createAluno(data) {
    return requestJson("/api/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}
```

```jsx
// src/pages/ListaAlunos.jsx
import { useEffect, useState } from "react";
import { createAluno, getAlunos } from "../services/api.js";

function ListaAlunos() {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    const [nome, setNome] = useState("");
    const [curso, setCurso] = useState("");
    const [aEnviar, setAEnviar] = useState(false);

    async function carregar() {
        setLoading(true);
        setErro("");
        try {
            const dados = await getAlunos();
            setAlunos(dados);
        } catch (e) {
            setErro(e.message || "Falha ao carregar alunos");
        } finally {
            setLoading(false);
        }
    }

    async function criarAluno(e) {
        e.preventDefault();
        setErro("");
        setAEnviar(true);

        try {
            const novo = await createAluno({ nome, curso });
            setAlunos((prev) => [...prev, novo]);
            setNome("");
            setCurso("");
        } catch (e) {
            setErro(e.message || "Falha ao criar aluno");
        } finally {
            setAEnviar(false);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    if (loading) return <p>A carregar...</p>;

    return (
        <div>
            <form onSubmit={criarAluno}>
                <input
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <input
                    placeholder="Curso"
                    value={curso}
                    onChange={(e) => setCurso(e.target.value)}
                />
                <button type="submit" disabled={aEnviar}>
                    {aEnviar ? "A enviar..." : "Adicionar"}
                </button>
            </form>

            {erro && <p>{erro}</p>}

            <ul>
                {alunos.map((aluno) => (
                    <li key={aluno.id}>
                        {aluno.nome} - {aluno.curso}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListaAlunos;
```

### Erros comuns

-   Não validar `res.ok` e assumir sucesso.
-   Enviar body sem `Content-Type: application/json`.
-   Mostrar erros pouco claros ao utilizador.

### Boas práticas

-   Normaliza erros num helper (`requestJson`).
-   Mostra mensagens úteis (não só "deu erro").
-   Atualiza a lista depois do POST sem recarregar a página.

### Checkpoint

-   Para que serve o `requestJson`?
-   Onde está o `Content-Type` no POST?

<a id="sec-5"></a>

## 5. [ESSENCIAL] CORS e erros comuns

### Modelo mental

O browser bloqueia pedidos entre origens diferentes por segurança. Uma origem é composta por **protocolo + domínio + porta**. Exemplo:

-   Frontend: `http://localhost:5173`
-   Backend: `http://localhost:3000`

Como as portas são diferentes, o browser considera origens diferentes. O `cors` no backend permite esses pedidos.

> **Nota importante:** CORS **não** é uma barreira de segurança real. É uma regra do browser, não do servidor.

### Sintaxe base (passo a passo)

-   **Ativa o CORS no backend:** `app.use(cors({ origin: "http://localhost:5173" }))`.
-   **Garante que o backend está a correr:** sem servidor, dá erro de rede.
-   **Usa o URL correto no `fetch`:** com a porta certa.

### Erros comuns

-   Backend desligado e o frontend mostrar erro.
-   Escrever o URL errado e receber 404.
-   Esquecer que a porta do Vite normalmente é 5173.

### Boas práticas

-   Testa a API no browser antes do React.
-   Restringe a origem permitida em desenvolvimento.
-   Lembra-te: CORS não substitui autenticação nem autorização.

### Checkpoint

-   Porque é que `http://localhost:5173` e `http://localhost:3000` são origens diferentes?
-   CORS é segurança real? Porquê?

<a id="sec-6"></a>

## 6. [EXTRA] Proxy no Vite e variáveis de ambiente

### Modelo mental

Um proxy evita escrever o URL completo e reduz problemas de CORS. Variáveis de ambiente permitem trocar URLs sem mexer no código.

Isto é útil porque:

-   Em desenvolvimento usas `localhost`.
-   Em produção usas o domínio real.
-   Não queres andar a mudar o código sempre que o endereço muda.

### Sintaxe base (passo a passo)

-   **Configura proxy no `vite.config.js`:** aponta `/api` para o backend.
-   **Cria um ficheiro `.env`:** com `VITE_API_BASE`.
-   **Lê no código:** `import.meta.env.VITE_API_BASE`.
-   **Nunca guardes segredos no frontend:** tudo o que está no React é público.

### Exemplo

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        // Proxy encaminha /api para o backend local
        proxy: {
            "/api": "http://localhost:3000",
        },
    },
});
```

```bash
# .env (na raiz do projeto React)
# Prefixo VITE_ é obrigatório no Vite
VITE_API_BASE=http://localhost:3000
```

```jsx
// src/services/api.js
const API_BASE = import.meta.env.VITE_API_BASE || "";

export function fetchAlunos() {
    return fetch(`${API_BASE}/api/alunos`).then((res) => {
        if (!res.ok) {
            throw new Error("Resposta inválida");
        }
        return res.json();
    });
}
```

### Erros comuns

-   Esquecer de reiniciar o Vite depois de mudar o config.
-   Escrever `VITE_API_BASE` sem reiniciar o servidor do Vite.
-   Tentar guardar segredos num `.env` do frontend (eles ficam públicos).

### Boas práticas

-   Centraliza os pedidos num ficheiro `services`.
-   Usa `.env` só para valores públicos (URLs, nomes de projeto).

### Checkpoint

-   Porque é que tens de reiniciar o Vite depois de mudar o proxy?
-   Porque é que não deves guardar segredos num `.env` do frontend?

<a id="exercicios"></a>

## Exercícios - Consumo de API com backend Node.js

1. Cria a pasta `backend`. Entra nela no terminal e executa `npm init -y`. Abre o `package.json` e confirma que foi criado.
2. Ainda em `backend`, instala `express` e `cors` com `npm install express cors`.
3. Cria `backend/index.js` com as rotas `GET /api/alunos` e `POST /api/alunos` e o helper `sendError`.
4. Testa `GET /api/alunos` no browser e confirma o JSON.
5. Testa `POST /api/alunos` com dados válidos e confirma `201`.
6. Testa `POST /api/alunos` com dados vazios e confirma `422` com o formato de erro.
7. No React, cria `src/services/api.js` com o `requestJson` e funções `getAlunos` e `createAluno`.
8. Cria `ListaAlunos.jsx` com GET no `useEffect` e um formulário POST.
9. Mostra mensagens de erro com base em `error.message`.
10. Altera a porta do backend e confirma que o frontend falha com uma mensagem útil.
11. Configura proxy no Vite e volta a usar `/api` sem escrever o URL completo.

<a id="changelog"></a>

## Changelog

-   2026-01-11: criação do ficheiro.
-   2026-01-12: explicações detalhadas e exercícios iniciais em formato guia.
-   2026-01-12: nota CommonJS vs ESM, checkpoints e exercícios 1-6 mais guiados.
-   2026-01-12: contrato de API, erros padronizados e exemplo GET + POST fullstack.
-   2026-01-12: snippets convertidos para ESM e nota de padrão do curso.
