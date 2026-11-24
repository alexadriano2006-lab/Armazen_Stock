# Frontend - Armazen Stock (React + JS)

Painel modular simples em **React + JavaScript** (Vite), separado por módulos, consumindo a API do backend.

## Estrutura modular

```text
frontend/
  src/
    app/                    # Shell da aplicação, topbar e navegação
    shared/
      components/           # Componentes reutilizáveis (ex.: Sidebar)
      services/             # Cliente HTTP/base de API
      styles/               # Estilos globais
    modules/
      dashboard/            # Módulo de visão geral
      users/
        components/         # Formulário e tabela de usuários
        screens/            # Telas: lista, cadastro e edição
        services/           # Serviço de usuários (chamadas à API)
        UsersPage.jsx       # Controlador de telas/estado do módulo
```

## Funcionalidades incluídas

- **Dashboard:** exibe status da API e total de usuários.
- **Usuários (telas dedicadas):**
  - **Lista:** tela com botões aparentes de ação (`+ Novo usuário`, `Atualizar lista`, `Limpar mensagens`) e ações por linha (`Editar`, `Excluir`).
  - **Cadastro:** tela dedicada para criação de usuário (nome, e-mail, senha, perfil).
  - **Edição:** tela dedicada para edição do usuário selecionado (nome, e-mail, perfil), com botão de voltar para a lista.
- Consome endpoints do backend via proxy: `GET/POST/PATCH /users` (e tentativa de `DELETE /users/:id` pelo botão de exclusão).
- Proxy do Vite: `/api` → `http://localhost:3000` (evita CORS no desenvolvimento).

> Observação: o backend atual precisa estar rodando com a rota de atualização registrada e com o build/fonte atualizado para que `PATCH /users/:id` funcione. O botão **Excluir** depende de um endpoint `DELETE /users/:id` no backend; se não existir, a interface mostra uma mensagem de erro amigável.

## Dependências necessárias (instalar)

### Runtime
- `react` (^18.3.1)
- `react-dom` (^18.3.1)

### Desenvolvimento
- `vite` (^6.0.0)
- `@vitejs/plugin-react` (^4.3.4)

## Instalação e execução

No diretório `frontend`:

```powershell
npm install
npm run dev
```

- Frontend (dev): `http://localhost:5173`
- Backend esperado: `http://localhost:3000` (ajuste em `vite.config.js` se usar outra porta)

Build de produção:

```powershell
npm run build
npm run preview
```

## Observações

- Este painel é simples e sem autenticação/guards (o backend ainda não expõe fluxo completo de auth no código atual).
- Novos módulos podem ser adicionados em `src/modules/<nome>` e registrados na navegação em `src/app/App.jsx` e `src/shared/components/Sidebar.jsx`.
- Como não instalei dependências automaticamente, execute `npm install` antes de rodar.
