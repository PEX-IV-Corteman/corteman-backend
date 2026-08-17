/*
  Warnings:

  - You are about to drop the `retirada` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "retirada";

-- CreateTable
CREATE TABLE "retiradas" (
    "retirada_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "valor_retirada" DECIMAL(10,2) NOT NULL,
    "destino" "destino_retirada" NOT NULL,
    "justificativa" TEXT,
    "realizada_em" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "retiradas_pkey" PRIMARY KEY ("retirada_id")
);
