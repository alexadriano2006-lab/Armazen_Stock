# Relacionamento Product - StockEntry

## Objetivo

O relacionamento entre `Product` e `StockEntry` permite registrar todas as entradas de mercadorias vinculadas a determinado produto.

Cada entrada representa uma operação de recebimento, registrando a quantidade recebida, o custo de aquisição e, quando aplicável, as informações de lote.

## Cardinalidade

**One-to-Many (1:N)**

- Um produto pode possuir várias entradas de estoque.
- Cada entrada pertence a um único produto.

## Chave estrangeira

| Campo | Tipo | Descrição |
|---|---|---|
| `productId` | Int | Chave estrangeira que identifica o produto relacionado. |

## Informações da entrada

| Campo | Tipo | Descrição |
|---|---|---|
| `quantity` | Int | Quantidade de unidades recebidas. |
| `costPrice` | Decimal | Custo unitário praticado na aquisição. |
| `lotCode` | String | Código de identificação do lote, quando aplicável. |
| `expiresAt` | DateTime | Data de validade do lote, quando aplicável. |

## Model StockEntry 

  id        Int      @id @default(autoincrement())
  quantity  Int
  costPrice Decimal  @db.Decimal(10, 2)
  lotCode   String?
  expiresAt DateTime?

  productId Int
  product   Product  @relation(fields: [productId], references: [id])

  createdAt DateTime @default(now())


## Regras de negócio

- Toda entrada deve estar vinculada a um produto existente.
- A quantidade recebida deve ser maior que zero.
- O custo unitário da aquisição deve ser registrado na movimentação.
- Produtos perecíveis devem possuir identificação de lote e validade, conforme as regras de recebimento.
- Produtos não perecíveis podem possuir entradas sem informações de lote.
- Cada recebimento deve gerar um novo registro de entrada.
- O registro de uma entrada deve aumentar o saldo calculado do produto.
- As movimentações devem preservar o histórico das operações realizadas.

## Controle de lotes

As informações de lote serão armazenadas diretamente na entidade `StockEntry`, sem a necessidade de uma entidade independente `Lot`.

Cada entrada poderá registrar seu próprio código de lote e data de validade.

Quando o mesmo lote for recebido novamente, será criada uma nova movimentação de entrada, preservando o histórico do recebimento.

## Observações

O módulo `StockEntry` é responsável pelo registro das entradas de mercadorias.

A quantidade disponível não será armazenada diretamente na entidade `Product`, mas calculada a partir das movimentações de entrada e saída.