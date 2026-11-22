# Entidade Product

## Objetivo

A entidade `Product` é responsável pelo cadastro e gerenciamento dos produtos disponíveis no sistema de controle de estoque.

Armazena as informações de identificação, características físicas e valores comerciais dos produtos, servindo como referência para as operações de entrada, saída e consulta de estoque.

A entidade não armazena diretamente a quantidade disponível, pois o saldo será calculado a partir das movimentações de estoque.

## Propriedades

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | Int | Sim | Identificador único e autoincrementável do produto. |
| `name` | String | Sim | Nome ou descrição do produto. |
| `barcode` | String | Não | Código de barras utilizado na etiqueta do produto. |
| `weight` | Decimal | Não | Peso do produto, expresso em quilogramas (kg). |
| `sku` | String | Sim | Código interno único utilizado para identificar o produto. |
| `eanGtin` | String | Não | Código comercial de identificação do produto (EAN/GTIN). |
| `costPrice` | Decimal | Sim | Preço de custo de referência do produto. |
| `salePrice` | Decimal | Sim | Preço definido para comercialização do produto. |
| `isPerishable` | Boolean | Sim | Indica se o produto possui características perecíveis. |
| `createdAt` | DateTime | Sim | Data e horário de criação do registro. |
| `updatedAt` | DateTime | Sim | Data e horário da última atualização do registro. |

## Model Product 

  id           Int      @id @default(autoincrement())
  name         String
  barcode      String?  @unique
  weight       Decimal? @db.Decimal(10, 3)
  sku          String   @unique
  eanGtin      String?  @unique
  costPrice    Decimal  @db.Decimal(10, 2)
  salePrice    Decimal  @db.Decimal(10, 2)
  isPerishable Boolean  @default(false)

  entries      StockEntry[]
  exits        StockExit[]

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt


## Regras de negócio

- O identificador `id` é gerado automaticamente pelo banco de dados.
- O nome do produto é obrigatório.
- O SKU deve ser único no sistema.
- O barcode, quando informado, deve ser único.
- O EAN/GTIN deve ser armazenado como texto, preservando possíveis zeros à esquerda.
- O peso deve ser registrado em quilogramas.
- Os preços de custo e venda não podem ser negativos.
- Os valores monetários devem utilizar precisão decimal.
- O campo `isPerishable` determina se o produto exige controle de validade.
- O cadastro do produto não exige quantidade inicial.
- O estoque inicial, quando informado no cadastro, deverá gerar uma movimentação de entrada.
- As informações de lote não pertencem diretamente à entidade `Product`.

## Relacionamentos

### StockEntry

Um produto pode possuir várias movimentações de entrada, registrando as quantidades recebidas ao longo do tempo.

Cada entrada pode conter informações de lote, como código e validade, quando aplicáveis.

### StockExit

Um produto pode possuir várias movimentações de saída, registrando as quantidades retiradas do estoque.

## Controle de estoque

A entidade `Product` não armazena o saldo disponível.

O estoque será calculado considerando as movimentações registradas:

**Saldo disponível = Total de entradas − Total de saídas**

Quando houver controle por lote, as informações de identificação e validade serão mantidas nos respectivos registros de entrada.

## Observações

A entidade `Product` representa o cadastro e a identificação do produto, mantendo separadas as informações comerciais e as movimentações de estoque.

Essa separação permite cadastrar produtos antes de possuir unidades disponíveis e registrar novas entradas ao longo do tempo, sem necessidade de alterar o cadastro original.