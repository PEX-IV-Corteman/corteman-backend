import { prisma } from "../config/db.js";
import type { CreateServicoInput, CreateServicoResponse } from "../interfaces/dtos/servico.js";

export class ServicoService {
    public async create(servicoData: CreateServicoInput): Promise<CreateServicoResponse | null> {
        try {
            const servico: CreateServicoResponse = await prisma.servicos.create({ data: servicoData });
            return servico;
        } catch (e) {
            throw new Error("Erro ao criar novo serviço.")
        }
    }
}
