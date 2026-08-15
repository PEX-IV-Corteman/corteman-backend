-- CreateEnum
CREATE TYPE "destino_retirada" AS ENUM ('EMPRESA', 'PESSOAL');

-- CreateTable
CREATE TABLE "retirada" (
    "retirada_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "valor_retirada" DECIMAL(10,2) NOT NULL,
    "destino" "destino_retirada" NOT NULL,
    "justificativa" TEXT,
    "realizada_em" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "retirada_pkey" PRIMARY KEY ("retirada_id")
);
