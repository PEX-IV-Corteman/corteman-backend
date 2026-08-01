import type { CreateServicoRequest, FilterServicosQuery, FilterServicosRequest, UpdateServicoRequest } from "../interfaces/dtos/servico.js";

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Keys extends keyof T
    ? Required<Pick<T, Keys>> & Partial<Omit<T, Keys>>
    : never;

export type ServicoFilters = RequireAtLeastOne<FilterServicosRequest>;

export function isCreateServicoBodyValid(value: unknown): value is CreateServicoRequest {

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


export function isUpdateServicoBodyValid(value: unknown): value is UpdateServicoRequest {

    if (typeof value != "object" || value === null) {
        return false;
    }

    const body = value as Record<string, unknown>;

    if (body.nome_servico === null && body.valor_servico === null) {
        return false;
    }

    return (
        (
            (typeof body.nome_servico === "string" && body.nome_servico.length > 0) ||
            (typeof body.nome_servico === null)
        ) &&
        (
            (typeof body.valor_servico === "number" && body.valor_servico > 0) ||
            (typeof body.valor_servico === null)
        )
    );

}

export function isFilterQueryValid(value: unknown): value is FilterServicosQuery {

    if (typeof value != "object" || value === null) return false;

    const query = value as Record<string, unknown>;

    if (query.nome_servico === undefined && query.valor_max === undefined) return false;

    if (
        query.nome_servico !== undefined &&
        (typeof query.nome_servico !== "string" || query.nome_servico.length === 0)
    ) return false;

    if (
        query.valor_max !== undefined &&
        (
            typeof query.valor_max !== "string" ||
            query.valor_max.length === 0 ||
            !Number.isFinite(Number(query.valor_max)) ||
            Number(query.valor_max) <= 0
        )
    ) return false;

    return true;
    
}
