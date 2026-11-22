# Relacionamento Product - StockExit

## Objetivo

O relacionamento entre `Product` e `StockExit` permite registrar todas as saídas de mercadorias vinculadas a determinado produto.

Cada saída representa uma operação de retirada de unidades do estoque, podendo ocorrer por venda, consumo interno, perda, avaria ou outros motivos definidos pelo sistema.

## Cardinalidade

**One-to-Many (1:N)**

- Um produto pode possuir várias saídas de estoque.
- Cada saída pertence a um único produto.

## Chave estrangeira

| Campo | Tipo | Descrição |
|---|---|---|
| `productId` | Int | Chave estrangeira que identifica o produto relacionado. |

## Informações da saída

| Campo | Tipo | Descrição |
|---|---|---|
| `quantity` | Int | Quantidade de unidades retiradas. |
| `createdAt` | DateTime | Data e horário do registro da saída. |

## Model StockExit
  id        Int      @id @default(autoincrement())
  quantity  Int

  productId Int
  product   Product  @relation(fields: [productId], references: [id])

  createdAt DateTime @default(now())


## Regras de negócio

- Toda saída deve estar vinculada a um produto existente.
- A quantidade retirada deve ser maior que zero.
- O sistema deve verificar a disponibilidade de estoque antes de confirmar a saída.
- Uma saída não pode gerar saldo negativo.
- Cada saída deve preservar o histórico da operação.
- Quando houver controle de validade por lote, a saída deverá registrar de qual lote as unidades foram retiradas.
- O registro de uma saída deve reduzir o saldo calculado do produto.

## Observações

O módulo `StockExit` é responsável pelo registro das saídas de mercadorias.

O controle de saldo deve considerar todas as entradas e saídas registradas, respeitando as quantidades disponíveis e as regras de controle de lote.