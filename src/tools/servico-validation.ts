import type { CreateServicoInput, FilterServicoRequest } from "../interfaces/dtos/servico.js";
import { Prisma } from "../../generated/prisma/client.js";

export function isServicoValid(servico: CreateServicoInput): boolean {
    
    const nome_servico = servico.nome_servico ?? null;;
    const valor_servico = servico.valor_servico ?? null;

    if (!nome_servico || !valor_servico) return false;
    if (nome_servico.length < 5) return false;
    if ((Prisma.Decimal(valor_servico).toNumber()) < 1.99) return false;

    return true;
}
