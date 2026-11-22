# Arquitetura do Backend

## Stack

  Tecnologia     Responsabilidade
  -------------- ------------------
  Node.js        Runtime
  TypeScript     Tipagem estática
  Express        API REST
  PostgreSQL     Persistência
  Prisma ORM     Acesso ao banco
  Zod            Validação
  jsonwebtoken   JWT
  bcrypt         Hash de senhas

## Arquitetura em camadas

O backend será organizado em módulos e camadas, mantendo
responsabilidades separadas.

### Routes

Define os endpoints e associa cada rota ao middleware e controller
correspondente.

### Controller

Recebe a requisição HTTP, chama o service e constrói a resposta.

### Service

Implementa as regras de negócio e coordena as operações.

### Repository

Centraliza o acesso ao banco de dados por meio do Prisma.

### Schema

Define e valida os dados de entrada com Zod.

### Middlewares

Implementa preocupações transversais, como autenticação JWT, autorização
por perfil e tratamento de erros.

## Estrutura inicial sugerida

``` text
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── modules/
│   │   ├── users/
│   │   │   ├── user.routes.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── user.schema.ts
│   │   │   ├── auth/
│   │   │   └── middlewares/
│   │   ├── estoque/
│   │   ├── fornecedores/
│   │   └── reports/
│   ├── database/
│   ├── middlewares/
│   ├── utils/
│   └── server.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Fluxo de uma requisição

`Routes → Middleware (quando necessário) → Controller → Service → Repository → PostgreSQL`

O retorno percorre as camadas de volta até o cliente.

## Autenticação JWT

Configuração inicial planejada:

  Item            Definição
  --------------- ----------------
  Biblioteca      `jsonwebtoken`
  Algoritmo       HS256
  Access Token    15 minutos
  Refresh Token   7 dias
  Hash de senha   bcrypt

O Refresh Token deverá ser persistido de forma segura, permitir rotação
e revogação. A estratégia de armazenamento deverá considerar o tipo de
cliente que consumirá a API.

## Padrões de desenvolvimento

-   Manter regras de negócio nos Services.
-   Evitar acesso direto ao Prisma nos Controllers.
-   Centralizar consultas ao banco nos Repositories.
-   Validar entradas com Zod.
-   Não retornar hashes de senha.
-   Utilizar variáveis de ambiente para credenciais e segredos.
-   Versionar alterações de banco com migrations.
-   Padronizar respostas e tratamento de erros.
-   Criar testes para regras de negócio e autorização.

## Etapas de implementação

1.  Configurar PostgreSQL e Prisma.
2.  Criar a entidade `User`.
3.  Executar a primeira migration.
4.  Implementar cadastro.
5.  Implementar autenticação JWT.
6.  Implementar autorização por perfil.
7.  Implementar consulta, atualização e inativação.
8.  Adicionar testes.
