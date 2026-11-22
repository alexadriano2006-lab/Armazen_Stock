# Entidade User

## Objetivo

A entidade `User` representa os usuários cadastrados no sistema de gerenciamento de estoque, sendo responsável pelo armazenamento das informações de identificação, autenticação, controle de acesso e gerenciamento das contas.

Cada usuário possui credenciais individuais e um perfil de acesso (`role`), que determina quais funcionalidades e operações poderá executar no sistema.

Também são armazenadas informações sobre a origem do cadastro, situação da conta e datas de criação e atualização, permitindo o controle administrativo e a rastreabilidade dos registros.

## Atributos

| Campo | Tipo Prisma | Obrigatório | Descrição |
|---|---|---|---|
| id | Int | Sim | Identificador único, gerado automaticamente por autoincremento. |
| name | String | Sim | Nome completo do usuário. |
| email | String | Sim | Endereço de e-mail único, utilizado para identificação e autenticação. |
| password | String | Sim | Hash bcrypt da senha. A senha original nunca deve ser armazenada. |
| role | Role | Sim | Perfil de acesso responsável por determinar as permissões do usuário. |
| status | Boolean | Sim | Indica se a conta está ativa ou inativa. |
| registrationSource | RegistrationSource | Sim | Identifica a origem do cadastro. |
| createdAt | DateTime | Sim | Data e horário de criação do registro. |
| updatedAt | DateTime | Sim | Data e horário da última atualização do registro. |

## Enumerações

### Role

Define o perfil de acesso e as permissões atribuídas ao usuário.

- `ADMIN`: perfil administrativo, com acesso às funcionalidades administrativas e de gerenciamento do sistema.
- `OPERATOR`: perfil operacional, destinado às atividades rotineiras de gerenciamento de estoque, respeitando as permissões estabelecidas.

### RegistrationSource

Identifica a origem do cadastro da conta.

- `SELF`: cadastro realizado pelo próprio usuário por meio do fluxo de autocadastro.
- `ADMIN`: cadastro realizado por um usuário com perfil administrativo.

## Schema Prisma

```prisma
enum Role {
  ADMIN
  OPERATOR
}

enum RegistrationSource {
  SELF
  ADMIN
}

model User {
  id                 Int                @id @default(autoincrement())
  name               String
  email              String             @unique
  password           String
  role               Role               @default(OPERATOR)
  status             Boolean            @default(true)
  registrationSource RegistrationSource @default(SELF)
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt
}
```

## Regras de negócio

### Cadastro
- O sistema permitirá o autocadastro de usuários.
- O perfil padrão do autocadastro será `OPERATOR`, definido exclusivamente pelo backend.
- O usuário não poderá definir ou alterar seu próprio perfil de acesso.
- Administradores poderão cadastrar usuários e definir seus respectivos perfis, conforme suas permissões.
- O e-mail deverá ser normalizado antes da persistência.
- Não será permitido cadastrar dois usuários com o mesmo e-mail.

### Segurança
- As senhas deverão ser processadas com bcrypt antes da persistência.
- Somente o hash da senha poderá ser armazenado no banco de dados.
- O campo `password` nunca deverá ser incluído nas respostas públicas da API.
- A comparação das credenciais deverá utilizar `bcrypt.compare()` durante a autenticação.

### Controle de acesso
- O campo `role` determinará as permissões de cada usuário.
- O backend deverá verificar as permissões antes de executar operações restritas.
- Usuários inativos não poderão realizar autenticação.
- Alterações de perfil deverão ser restritas a usuários autorizados.

### Gerenciamento da conta
- O campo `status` permitirá ativar ou inativar contas sem excluir seus registros.
- A inativação deverá preservar os dados e relacionamentos associados ao usuário.
- A exclusão definitiva não será disponibilizada como operação padrão.

## Decisões de modelagem

- Identificador do tipo `Int`, gerado automaticamente por autoincremento.
- E-mail único e normalizado antes da persistência.
- Senha armazenada exclusivamente como hash bcrypt.
- Perfil padrão: `OPERATOR`.
- Status padrão: `true`.
- Origem padrão do cadastro: `SELF`.
- Não haverá confirmação de e-mail na primeira versão.
- Não haverá exclusão definitiva como operação padrão.

## Observações para implementação

1. Utilizar `publicUserSelect` para impedir a exposição do campo `password` nas respostas da API.
2. O backend deverá ignorar ou rejeitar tentativas de atribuição de `ADMIN` durante o autocadastro.
3. A criação do primeiro administrador deverá ocorrer por um procedimento seguro de inicialização.
4. A autenticação deverá utilizar JWT, com validação das credenciais e verificação do status da conta.
5. A autorização deverá ser aplicada por middleware, respeitando as permissões de cada perfil.
6. Avaliar futuramente a inclusão de campos de auditoria, como `createdById`, para identificar o administrador responsável pela criação de uma conta.