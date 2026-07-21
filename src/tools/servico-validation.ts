import type { CreateServicoRequest, ServicoFilters, UpdateServicoRequest } from "../interfaces/dtos/servico.js";

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Keys extends keyof T
    ? Required<Pick<T, Keys>> & Partial<Omit<T, Keys>>
    : never;

type validFilters = RequireAtLeastOne<ServicoFilters>;

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

export function isFilterBodyValid(value: unknown): value is validFilters {

    if (typeof value != "object" || value === null) return false;

    const body = value as Record<string, unknown>;

    return (
        (
            (typeof body.nome_servico === "object")
        ) &&
        (
            (typeof body.valor_servico === "object")
        ) ||
        (
            typeof body.nome_servico === "object" ||
            typeof body.valor_servico === "object"
        )
    );
}
