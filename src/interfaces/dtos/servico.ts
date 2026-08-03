import type { Decimal } from "@prisma/client/runtime/index-browser"

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

export interface UpdateServicoResponse {
    servico_id: string,
    nome_servico: string,
    valor_servico: Decimal,
}
