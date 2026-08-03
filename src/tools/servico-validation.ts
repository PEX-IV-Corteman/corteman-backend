import type { FilterServicosQuery, FilterServicosRequest } from "../interfaces/dtos/servico.js";

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Keys extends keyof T
    ? Required<Pick<T, Keys>> & Partial<Omit<T, Keys>>
    : never;

export type ServicoFilters = RequireAtLeastOne<FilterServicosRequest>;

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
