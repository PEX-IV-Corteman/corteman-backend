import type { CreateServicoInput, GetServicoRequest } from "../interfaces/dtos/servico.js";
import { Prisma } from "../../generated/prisma/client.js";

export function isServicoValid(servico: CreateServicoInput): boolean {
    let nome_servico;
    let valor_servico;
    
    try {
        nome_servico = servico.nome_servico ? servico.nome_servico : null;
        valor_servico = servico.valor_servico ? servico.valor_servico : null;

        if (!nome_servico || !valor_servico) return false;
        if (nome_servico.length < 5) return false;
        if ((Prisma.Decimal(valor_servico).toNumber()) < 1.99) return false;

        return true;

    } catch (e) {
        console.error(e);
        return false;
    }
}


export function isServicoQueryValid(servico: GetServicoRequest ): boolean {

    if (servico) {
        const nome_servico = servico.nome_servico ? servico.nome_servico : null;
        if (!nome_servico) return false;
        return true;
    }

    return true;
}
