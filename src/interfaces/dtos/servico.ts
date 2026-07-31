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

export interface FilterServicosRequest {

    nome_servico?: {
        startsWith: string,
        endsWith?: string
    }

    valor_servico?: {
        min?: Prisma.Decimal,
        max: Prisma.Decimal
    }

}

export interface GetServicoResponse {
    servico_id: string,
    nome_servico: string,
    valor_servico: Decimal,
}

export interface CreateServicoResponse {
    servico_id: string,
    nome_servico: string,
    valor_servico: Decimal,
}

export interface UpdateServicoRequest {
    nome_servico?: string,
    valor_servico?: Decimal
}
