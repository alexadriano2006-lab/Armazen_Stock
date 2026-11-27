-- CreateEnum
CREATE TYPE "Recurso" AS ENUM ('PRODUTO', 'USUARIO', 'PERFIL', 'MOVIMENTACAO');

-- CreateEnum
CREATE TYPE "Acao" AS ENUM ('CRIAR', 'LER', 'ATUALIZAR', 'DELETAR', 'ENTRADA_ESTOQUE', 'SAIDA_ESTOQUE');

-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('ENTRADA', 'SAIDA');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "perfilId" INTEGER,
ADD COLUMN     "ultimoLogin" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Permissao" (
    "id" SERIAL NOT NULL,
    "recurso" "Recurso" NOT NULL,
    "acao" "Acao" NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Permissao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perfil" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfilPermissao" (
    "perfilId" INTEGER NOT NULL,
    "permissaoId" INTEGER NOT NULL,

    CONSTRAINT "PerfilPermissao_pkey" PRIMARY KEY ("perfilId","permissaoId")
);

-- CreateTable
CREATE TABLE "UsuarioPermissao" (
    "userId" INTEGER NOT NULL,
    "permissaoId" INTEGER NOT NULL,
    "concedida" BOOLEAN NOT NULL,

    CONSTRAINT "UsuarioPermissao_pkey" PRIMARY KEY ("userId","permissaoId")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "quantidadeAtual" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movimentacao" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "tipo" "TipoMovimentacao" NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "dataMovimentacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movimentacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permissao_recurso_acao_key" ON "Permissao"("recurso", "acao");

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_nome_key" ON "Perfil"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_sku_key" ON "Produto"("sku");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilPermissao" ADD CONSTRAINT "PerfilPermissao_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "Perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilPermissao" ADD CONSTRAINT "PerfilPermissao_permissaoId_fkey" FOREIGN KEY ("permissaoId") REFERENCES "Permissao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioPermissao" ADD CONSTRAINT "UsuarioPermissao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioPermissao" ADD CONSTRAINT "UsuarioPermissao_permissaoId_fkey" FOREIGN KEY ("permissaoId") REFERENCES "Permissao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimentacao" ADD CONSTRAINT "Movimentacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimentacao" ADD CONSTRAINT "Movimentacao_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
