## ⚙️ Configuração do Ambiente

Esta seção apresenta os requisitos e procedimentos necessários para configurar o ambiente de desenvolvimento do sistema de gerenciamento de estoque.

### 1. Tecnologias e ferramentas

| Tecnologia | Versão / Ambiente | Responsabilidade |
|---|---|---|
| Node.js | 24.21.0 | Ambiente de execução JavaScript |
| TypeScript | 5.9.3 | Tipagem estática e desenvolvimento |
| Express | 5.3.0 | Framework HTTP para construção da API REST |
| Prisma ORM | 7.10.1 | Mapeamento de dados e migrations |
| Prisma Client | 7.10.1 | Consultas e operações com o banco |
| PostgreSQL | Gerenciado pelo Neon | Banco de dados relacional |
| Neon | Cloud — São Paulo | Hospedagem do PostgreSQL |
| Zod | 4.6.7 | Validação de dados e schemas |
| dotenv | Dependência do projeto | Carregamento de variáveis de ambiente |
| pg | 8.23.1 | Driver PostgreSQL |
| @prisma/adapter-pg | 7.10.1 | Integração entre Prisma Client e PostgreSQL |
| Prettier | Configurado no projeto | Padronização da formatação |
| Git e GitHub | Controle de versão | Histórico, branches e colaboração |
| VS Code | Ambiente de desenvolvimento | Edição e depuração |

As versões devem ser conferidas no `backend/package.json`, que é a referência oficial das dependências instaladas.

### 2. Pré-requisitos

Antes de iniciar a configuração, certifique-se de possuir:

- Node.js 24.21.0 instalado.
- npm instalado.
- Conta e projeto configurados no Neon.
- Banco de dados PostgreSQL criado no Neon.
- Git instalado.
- Visual Studio Code instalado.

Para conferir as versões instaladas:

```bash
node -v
npm -v
git --version
```

### 3. Clonagem e instalação do projeto

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Acesse a pasta do backend:

```bash
cd backend
```

Instale as dependências do projeto:

```bash
npm install
```

### 4. Configuração do banco de dados — Neon

O projeto utiliza PostgreSQL hospedado na plataforma Neon.

Para obter as credenciais:

1. Acesse o painel do Neon.
2. Selecione o projeto e o banco de dados.
3. Clique em **Connect**.
4. Selecione a branch e o banco desejado.
5. Copie as duas strings de conexão disponibilizadas.

Serão utilizadas duas conexões:

- **Pooled connection:** conexão com pool, utilizada pela aplicação.
- **Direct connection:** conexão direta, utilizada pelas ferramentas do Prisma para migrations e operações administrativas.

A conexão pooled normalmente apresenta `-pooler` no endereço do servidor.

### 5. Variáveis de ambiente

Na raiz da pasta `backend`, crie os arquivos `.env` e `.env.example`.

**Arquivo `.env`:**

```env
# Servidor
PORT=3000
NODE_ENV=development

# PostgreSQL — Neon
DATABASE_URL="CONEXAO_POOLED_DO_NEON"
DIRECT_URL="CONEXAO_DIRECT_DO_NEON"

# JWT
JWT_SECRET="CHAVE_SECRETA_ACCESS_TOKEN"
JWT_REFRESH_SECRET="CHAVE_SECRETA_REFRESH_TOKEN"

# Expiração dos tokens
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

**Arquivo `.env.example`:**

```env
PORT=3000
NODE_ENV=development

DATABASE_URL=""
DIRECT_URL=""

JWT_SECRET=""
JWT_REFRESH_SECRET=""

JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

**Regras de segurança:**

- Nunca compartilhe o arquivo `.env`.
- Não envie credenciais reais para o GitHub.
- Utilize segredos fortes e diferentes para os tokens JWT.
- Mantenha o `.env.example` atualizado, sem informações confidenciais.

### 6. Configuração do Prisma ORM 7

O projeto utiliza Prisma ORM 7.10.1. Nesta versão, a configuração da conexão do banco é feita em um arquivo de configuração próprio, separado do `schema.prisma`.

Instale as dependências, caso ainda não estejam presentes no projeto:

```bash
npm install @prisma/client@7.10.1 @prisma/adapter-pg@7.10.1 pg@8.23.1 dotenv@<VERSAO_CONFIGURADA>
```

Instale o Prisma CLI:

```bash
npm install -D prisma@7.10.1
```

Inicialize o Prisma, caso ainda não esteja configurado:

```bash
npx prisma init
```

#### 6.1. Arquivo de configuração do Prisma

Na raiz do backend, utilize o arquivo `prisma7.config.ts`:

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: env("DIRECT_URL"),
  },
});
```

O `DIRECT_URL` será utilizado pelo Prisma CLI para executar migrations e outras operações que exigem conexão direta.

#### 6.2. Arquivo schema.prisma

O arquivo `prisma/schema.prisma` será responsável por definir os modelos, relacionamentos e estrutura das entidades do banco.

Configuração inicial:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

Os modelos das entidades serão adicionados posteriormente, conforme a implementação dos módulos do sistema.

#### 6.3. Configuração do Prisma Client

O Prisma 7 exige um driver adapter para estabelecer a conexão com o banco de dados.

Exemplo de inicialização do cliente:

```typescript
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
  adapter,
});
```

Esse exemplo representa a inicialização do cliente. O caminho de importação deve ser ajustado conforme a localização do arquivo responsável pela conexão.

### 7. Migrations e geração do Prisma Client

Após definir os primeiros modelos no `schema.prisma`, execute:

**Criar a primeira migration:**

```bash
npx prisma migrate dev --name init
```

**Gerar o Prisma Client:**

```bash
npx prisma generate
```

**Abrir o Prisma Studio:**

```bash
npx prisma studio
```

As migrations devem ser utilizadas para registrar e controlar as alterações realizadas na estrutura do banco de dados.

### 8. Scripts de execução

Os comandos disponíveis dependem dos scripts configurados no `package.json`.

Exemplo de execução em desenvolvimento, caso o script esteja configurado:

```bash
npm run dev
```

Para iniciar o projeto em produção, utilize o script de inicialização definido no `package.json`.

### 9. Arquivo .gitignore

O arquivo `.gitignore` deve conter, no mínimo:

```gitignore
# Dependências
node_modules/

# Arquivos compilados
dist/

# Variáveis de ambiente
.env
.env.*
!.env.example

# Logs
*.log

# Sistema operacional
.DS_Store
Thumbs.db
```

### 10. Estrutura esperada do backend

```text
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── generated/
│   │   └── prisma/
│   │
│   ├── modules/
│   ├── database/
│   ├── middlewares/
│   ├── utils/
│   └── server.ts
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── prisma7.config.ts
└── tsconfig.json
```

### 11. Boas práticas de desenvolvimento

- Manter as dependências e versões documentadas.
- Utilizar TypeScript em todo o backend.
- Separar responsabilidades entre Routes, Controllers, Services e Repositories.
- Validar entradas e parâmetros utilizando Zod.
- Utilizar Prisma para operações com o banco de dados.
- Registrar alterações estruturais por meio de migrations.
- Não armazenar senhas em texto puro.
- Proteger rotas por autenticação e autorização.
- Utilizar variáveis de ambiente para informações sensíveis.
- Padronizar o código com Prettier.

---

**Status:** documentação inicial da configuração do ambiente.

**Próxima etapa:** configuração efetiva do backend e implementação da primeira entidade do sistema.

### 12. Autenticação e autorização — JWT

O sistema utilizará JSON Web Token (JWT) para autenticação dos usuários e controle de acesso aos recursos protegidos da API.

A implementação será baseada em dois tipos de tokens:

| Token | Validade | Responsabilidade |
|---|---|---|
| Access Token | 15 minutos | Autorizar requisições aos endpoints protegidos |
| Refresh Token | 7 dias | Renovar o Access Token sem exigir novo login |

#### 12.1. Dependências

Instale as dependências:

```bash
npm install jsonwebtoken bcrypt
```

Instale os tipos do TypeScript:

```bash
npm install -D @types/jsonwebtoken @types/bcrypt
```

#### 12.2. Configuração das variáveis de ambiente

Adicionar ao arquivo `.env`:

```env
# JWT
JWT_SECRET="SEGREDO_ACCESS_TOKEN"
JWT_REFRESH_SECRET="SEGREDO_REFRESH_TOKEN"

JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
```

Os segredos devem ser fortes, diferentes entre si e mantidos exclusivamente nas variáveis de ambiente.

#### 12.3. Fluxo de autenticação

O processo de autenticação seguirá o fluxo:

1. O usuário informa e-mail e senha.
2. O backend consulta o usuário no banco de dados.
3. O sistema verifica se a conta está ativa.
4. O bcrypt compara a senha informada com o hash armazenado.
5. Se as credenciais forem válidas, o backend gera o Access Token e o Refresh Token.
6. O Access Token será utilizado nas requisições protegidas.
7. Quando o Access Token expirar, o Refresh Token poderá solicitar novos tokens.

#### 12.4. Estrutura do JWT

O Access Token conterá apenas informações necessárias para identificar e autorizar o usuário.

Exemplo de payload:

```json
{
  "sub": "uuid-do-usuario",
  "role": "OPERATOR",
  "iat": 1795200000,
  "exp": 1795200900
}
```

Onde:

- `sub`: identificador único do usuário.
- `role`: perfil de acesso.
- `iat`: data de emissão do token.
- `exp`: data de expiração.

Não armazenar senhas, hashes ou informações sensíveis no payload.

#### 12.5. Middlewares de autenticação e autorização

A proteção das rotas será dividida em duas responsabilidades:

**Authenticate:**
- Receber o token enviado no cabeçalho Authorization.
- Validar assinatura e expiração.
- Identificar o usuário pelo identificador presente no token.
- Consultar o usuário no banco e verificar se está ativo.
- Bloquear requisições não autenticadas.

**Authorize:**
- Verificar o perfil do usuário autenticado.
- Permitir ou bloquear o acesso conforme as permissões definidas.
- Impedir que usuários OPERATORS acessem recursos exclusivos de ADMIN.

Exemplo de utilização:

```typescript
router.get(
  "/users",
  authenticate,
  authorize("ADMIN"),
  userController.list
);
```

#### 12.6. Refresh Token e controle de sessão

O Refresh Token será utilizado para renovar a autenticação sem solicitar novamente as credenciais do usuário.

Requisitos:

- Armazenar o Refresh Token de maneira segura no banco de dados.
- Implementar rotação de tokens a cada renovação.
- Revogar o token anterior após a renovação.
- Permitir revogação da sessão durante o logout.
- Impedir a renovação de sessões revogadas ou expiradas.
- Verificar se o usuário continua ativo antes de renovar a sessão.

O armazenamento deverá utilizar hash do Refresh Token, evitando persistir seu valor original no banco.

#### 12.7. Endpoints de autenticação

| Método | Endpoint | Descrição | Acesso |
|---|---|---|---|
| POST | `/auth/login` | Autenticação do usuário | Público |
| POST | `/auth/refresh` | Renovação dos tokens | Refresh Token |
| POST | `/auth/logout` | Encerramento da sessão | Autenticado |
| GET | `/auth/me` | Consulta dos dados do usuário autenticado | Autenticado |

#### 12.8. Regras de segurança

- Não emitir tokens para usuários com credenciais inválidas.
- Não permitir autenticação de usuários inativos.
- Validar a assinatura e a expiração dos tokens.
- Não armazenar senhas ou Refresh Tokens em texto puro.
- Não permitir que o usuário altere seu próprio perfil enviando dados diretamente na requisição.
- Verificar permissões no backend.
- Utilizar HTTPS em produção.
- Revogar sessões quando necessário.

**Observação:** em aplicações web, recomenda-se armazenar o Refresh Token em cookie `HttpOnly`, `Secure` e com política `SameSite` adequada. O armazenamento do Access Token deve considerar o tipo de cliente utilizado.