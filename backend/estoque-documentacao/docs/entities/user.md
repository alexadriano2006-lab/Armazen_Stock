# Entidade User

## Objetivo

Representar as contas de usuários que terão acesso ao sistema de
gerenciamento de estoque.

## Atributos

  Campo                Tipo Prisma            Obrigatório Descrição
  -------------------- -------------------- ------------- ---------------------
  id                   String                         Sim Identificador UUID
  name                 String                         Sim Nome completo
  email                String                         Sim E-mail único
  password             String                         Sim Hash da senha
  role                 Role                           Sim Perfil de acesso
  status               Boolean                        Sim Situação da conta
  registrationSource   RegistrationSource             Sim Origem do cadastro
  createdAt            DateTime                       Sim Data de criação
  updatedAt            DateTime                       Sim Data de atualização

## Enumerações

### Role

-   `ADMIN`: acesso administrativo.
-   `OPERATOR`: acesso operacional.

### RegistrationSource

-   `SELF`: usuário realizou o próprio cadastro.
-   `ADMIN`: cadastro realizado por administrador.

## Schema Prisma inicial

``` prisma
enum Role {
  ADMIN
  OPERATOR
}

enum RegistrationSource {
  SELF
  ADMIN
}

model User {
  id                 String             @id @default(uuid())
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

## Decisões de modelagem

-   O identificador será UUID.
-   O e-mail será único e deverá ser normalizado antes de persistir.
-   A senha será armazenada somente como hash bcrypt.
-   O autocadastro terá perfil `OPERATOR` definido pelo backend.
-   O status será usado para inativar e reativar contas sem apagar seus
    dados.
-   Não haverá confirmação de e-mail na primeira versão.
-   Não haverá exclusão definitiva de usuários como operação padrão.

## Observações para implementação

1.  Nunca retornar o campo `password` nas respostas da API.
2.  O backend deve ignorar tentativas de definir `ADMIN` no
    autocadastro.
3.  A criação do primeiro administrador deverá ocorrer por procedimento
    seguro de inicialização.
4.  Avaliar futuramente campos de auditoria, como `createdById`, caso
    seja necessário identificar qual administrador criou uma conta.
