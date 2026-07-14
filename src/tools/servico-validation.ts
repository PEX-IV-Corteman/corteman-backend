import type { CreateServicoRequest } from "../interfaces/dtos/servico.js";


export function validateCreateServicoBody(value: unknown): value is CreateServicoRequest {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const body = value as Record<string, unknown>;

    return (
        typeof body.nome_servico === "string" &&
        body.nome_servico.length > 0 &&
        typeof body.valor_servico === "number" &&
        body.valor_servico > 0
    );
}
