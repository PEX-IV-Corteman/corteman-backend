import type { Decimal } from "@prisma/client/runtime/index-browser"

export interface CreateRetiradaResponse {
    valor_retirada: Decimal,
    destino: string,
    justificativa?: string
}

export interface GetRetiradaResponse {
    valor_retirada: Decimal,
    destino: string,
    justificativa?: string
}

export interface UpdateRetiradaResponse {
    valor_retirada: Decimal,
    destino: string,
    justificativa?: string
};
