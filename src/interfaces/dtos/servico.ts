import type { Decimal } from "@prisma/client/runtime/index-browser"

export interface CreateServicoInput {
    nome_servico: string,
    valor_servico: Decimal
}

export interface CreateServicoRequest {
    nome_servico: string,
    valor_servico: Decimal
}

export interface CreateServicoResponse {
    nome_servico: string,
    valor_servico: Decimal
}