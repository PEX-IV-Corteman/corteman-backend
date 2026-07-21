import type { Decimal } from "@prisma/client/runtime/index-browser"
import type { Prisma } from "../../../generated/prisma/client.js";

export interface CreateServicoInput {
    nome_servico: string,
    valor_servico: Decimal;
}

export interface CreateServicoRequest {
    nome_servico: string,
    valor_servico: Decimal,
}

export interface FilterServicoRequest {
    nome_servico?: string,
    valor_servico?: Prisma.Decimal
}

export interface FilterServicoResponse {
    nome_servico: string,
    valor_servico: Prisma.Decimal
}

export interface GetServicoResponse {
    servico_id: string,
    nome_servico: string,
    valor_servico: Decimal,
}

export interface CreateServicoResponse {
    nome_servico: string,
    valor_servico: Decimal,
}

export interface UpdateServicoRequest {
    nome_servico?: string,
    valor_servico?: Decimal
}

export interface DeleteServicoRequest {
    id_servico?: string,
    nome_servico?: string,
}
