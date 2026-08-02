import type { Decimal } from "@prisma/client/runtime/index-browser"

export interface FilterServicosRequest {

    nome_servico?: {
        startsWith: string,
        endsWith?: string
    }

    valor_servico?: {
        min?: number,
        max: number
    }

}

export interface FilterServicosQuery {
    nome_servico?: string,
    valor_max?: string
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
