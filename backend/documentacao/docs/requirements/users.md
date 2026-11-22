# Requisitos --- Módulo de Usuários

## Objetivo

Gerenciar as contas que acessam o sistema, incluindo cadastro, consulta,
atualização, inativação, autenticação e autorização.

## Formas de cadastro

### Autocadastro

Qualquer pessoa poderá criar uma conta. O backend deverá atribuir
automaticamente o perfil `OPERATOR`.

### Cadastro administrativo

Um administrador autenticado poderá cadastrar outros usuários e definir
seus perfis de acesso.

## Requisitos funcionais

  Código   Descrição
  -------- -------------------------------------------------------------
  RF01     Permitir autocadastro de usuários.
  RF02     Permitir cadastro realizado por administrador.
  RF03     Exigir nome completo, e-mail e senha.
  RF04     Validar formato e normalizar o e-mail.
  RF05     Impedir e-mails duplicados.
  RF06     Atribuir `OPERATOR` automaticamente no autocadastro.
  RF07     Permitir que administradores definam o perfil de terceiros.
  RF08     Registrar a origem do cadastro.
  RF09     Permitir listar e consultar usuários.
  RF10     Permitir atualizar dados cadastrais.
  RF11     Permitir inativar e reativar usuários.
  RF12     Permitir autenticação por e-mail e senha.
  RF13     Emitir JWT após validar credenciais e status da conta.
  RF14     Permitir renovação e encerramento de sessão.
  RF15     Permitir consultar os dados do usuário autenticado.

## Regras de negócio

  -----------------------------------------------------------------------
  Código                              Regra
  ----------------------------------- -----------------------------------
  RN01                                Todo usuário deverá possuir
                                      identificador único.

  RN02                                Não permitir e-mails duplicados.

  RN03                                Senhas nunca poderão ser
                                      armazenadas em texto puro.

  RN04                                O autocadastro sempre criará um
                                      usuário `OPERATOR`.

  RN05                                Somente administradores poderão
                                      definir o perfil de outros
                                      usuários.

  RN06                                Usuários inativos não poderão
                                      realizar login.

  RN07                                A inativação deverá preservar os
                                      dados cadastrais e o histórico.

  RN08                                Somente usuários autorizados
                                      poderão reativar contas.

  RN09                                O primeiro administrador deverá ser
                                      criado por procedimento seguro de
                                      inicialização.

  RN10                                O JWT somente será emitido após
                                      validação das credenciais e do
                                      status da conta.

  RN11                                Não haverá confirmação de e-mail na
                                      primeira versão.
  -----------------------------------------------------------------------

## Perfis de acesso

  Perfil       Responsabilidade
  ------------ ---------------------------------------------
  `ADMIN`      Gerenciamento administrativo e de usuários.
  `OPERATOR`   Operações permitidas no estoque.

As permissões deverão ser verificadas no backend, não apenas na
interface.

## Endpoints previstos

  Método   Endpoint              Acesso                 Finalidade
  -------- --------------------- ---------------------- -------------------------
  POST     `/users/register`     Público                Autocadastro
  POST     `/users`              ADMIN                  Cadastro administrativo
  GET      `/users`              ADMIN                  Listar usuários
  GET      `/users/:id`          ADMIN                  Consultar usuário
  PUT      `/users/:id`          Conforme política      Atualizar usuário
  PATCH    `/users/:id/status`   ADMIN                  Inativar ou reativar
  POST     `/auth/login`         Público                Autenticar
  POST     `/auth/refresh`       Refresh Token válido   Renovar sessão
  POST     `/auth/logout`        Autenticado            Encerrar sessão
  GET      `/auth/me`            Autenticado            Consultar usuário atual

## Critérios de segurança

-   Hash de senha com bcrypt.
-   JWT assinado com segredo mantido em variável de ambiente.
-   Access Token com validade curta.
-   Refresh Token com armazenamento seguro, rotação e revogação.
-   Não incluir senha ou dados sensíveis no payload JWT.
-   Proteger rotas com autenticação e autorização.
-   Aplicar limitação de tentativas em endpoints sensíveis,
    especialmente login.
